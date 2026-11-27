const crypto = require("node:crypto");
const fs = require("node:fs/promises");
const http = require("node:http");
const path = require("node:path");
const menuItems = require("./menu-data.js");

const root = __dirname;
loadEnvironmentFile();

const dataRoot = path.join(root, "data");
const pendingRoot = path.join(dataRoot, "pending-orders");
const paidRoot = path.join(dataRoot, "orders");
const host = process.env.HOST || "127.0.0.1";
const port = Number(process.env.PORT || 3000);
const paymentKeyId = process.env.RAZORPAY_KEY_ID || "";
const paymentKeySecret = process.env.RAZORPAY_KEY_SECRET || "";
const livePaymentsAllowed = process.env.ALLOW_LIVE_PAYMENTS === "true";
const paymentsEnabled = Boolean(
  paymentKeyId &&
  paymentKeySecret &&
  (!paymentKeyId.startsWith("rzp_live_") || livePaymentsAllowed)
);
const products = new Map(menuItems.map((item) => [slugify(item.name), item]));

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new RangeError("PORT must be an integer between 1 and 65535.");
}

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function isSameOrigin(request) {
  const origin = request.headers.origin;
  if (!origin || !request.headers.host) return false;
  try {
    return new URL(origin).host.toLowerCase() === request.headers.host.toLowerCase();
  } catch {
    return false;
  }
}

function loadEnvironmentFile() {
  const envPath = path.join(root, ".env");
  if (!require("node:fs").existsSync(envPath)) return;

  const lines = require("node:fs").readFileSync(envPath, "utf8").split(/\r?\n/);
  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;
    const separator = trimmed.indexOf("=");
    if (separator < 1) return;
    const key = trimmed.slice(0, separator).trim();
    let value = trimmed.slice(separator + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = value;
  });
}

function sendJson(response, status, value) {
  response.writeHead(status, {
    "Cache-Control": "no-store",
    "Content-Type": "application/json; charset=utf-8",
    "X-Content-Type-Options": "nosniff"
  });
  response.end(JSON.stringify(value));
}

function sendText(response, status, value, contentType = "text/plain; charset=utf-8") {
  response.writeHead(status, {
    "Cache-Control": "no-store",
    "Content-Type": contentType,
    "X-Content-Type-Options": "nosniff"
  });
  response.end(value);
}

async function readJsonBody(request) {
  const chunks = [];
  let length = 0;
  for await (const chunk of request) {
    length += chunk.length;
    if (length > 16_384) {
      const error = new Error("Request body is too large.");
      error.statusCode = 413;
      throw error;
    }
    chunks.push(chunk);
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    const error = new Error("Request body must be valid JSON.");
    error.statusCode = 400;
    throw error;
  }
}

function validateCustomer(customer) {
  return customer &&
    typeof customer.name === "string" &&
    customer.name.trim().length >= 2 &&
    customer.name.trim().length <= 80 &&
    typeof customer.phone === "string" &&
    /^[0-9+() -]{8,20}$/.test(customer.phone.trim()) &&
    typeof customer.address === "string" &&
    customer.address.trim().length >= 8 &&
    customer.address.trim().length <= 350;
}

function validateItems(items) {
  if (!Array.isArray(items) || items.length === 0 || items.length > menuItems.length) return null;

  const normalized = [];
  const seen = new Set();
  for (const entry of items) {
    if (!entry || typeof entry.id !== "string" || !Number.isInteger(entry.quantity) ||
      entry.quantity < 1 || entry.quantity > 10 || seen.has(entry.id)) {
      return null;
    }
    const product = products.get(entry.id);
    if (!product) return null;
    seen.add(entry.id);
    normalized.push({
      id: entry.id,
      name: product.name,
      quantity: entry.quantity,
      unitPrice: product.price
    });
  }
  return normalized;
}

function razorpayAuthorization() {
  return `Basic ${Buffer.from(`${paymentKeyId}:${paymentKeySecret}`).toString("base64")}`;
}

async function createProviderOrder(amount) {
  const response = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      Authorization: razorpayAuthorization(),
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      amount,
      currency: "INR",
      receipt: `warm-${crypto.randomUUID().replace(/-/g, "").slice(0, 20)}`
    })
  });
  const result = await response.json();
  if (!response.ok || typeof result.id !== "string") {
    console.error("Razorpay order creation failed with status", response.status);
    throw new Error("The payment provider could not create an order.");
  }
  return result;
}

async function readProviderPayment(paymentId) {
  const response = await fetch(`https://api.razorpay.com/v1/payments/${encodeURIComponent(paymentId)}`, {
    headers: { Authorization: razorpayAuthorization() }
  });
  const result = await response.json();
  if (!response.ok) {
    console.error("Razorpay payment lookup failed with status", response.status);
    throw new Error("The payment provider could not verify the payment.");
  }
  return result;
}

function safeOrderId(orderId) {
  return typeof orderId === "string" && /^order_[A-Za-z0-9]+$/.test(orderId);
}

function verifySignature(orderId, paymentId, signature) {
  if (typeof signature !== "string" || !/^[a-f0-9]{64}$/i.test(signature)) return false;
  const expected = crypto
    .createHmac("sha256", paymentKeySecret)
    .update(`${orderId}|${paymentId}`)
    .digest();
  const received = Buffer.from(signature, "hex");
  return received.length === expected.length && crypto.timingSafeEqual(received, expected);
}

async function serveStatic(pathname, response) {
  const publicFiles = new Map([
    ["/", ["index.html", "text/html; charset=utf-8"]],
    ["/index.html", ["index.html", "text/html; charset=utf-8"]],
    ["/styles.css", ["styles.css", "text/css; charset=utf-8"]],
    ["/script.js", ["script.js", "text/javascript; charset=utf-8"]],
    ["/menu-data.js", ["menu-data.js", "text/javascript; charset=utf-8"]]
  ]);
  let file;
  let contentType;

  if (publicFiles.has(pathname)) {
    [file, contentType] = publicFiles.get(pathname);
    file = path.join(root, file);
  } else if (pathname.startsWith("/assets/photos/")) {
    let photoName;
    try {
      photoName = decodeURIComponent(pathname.slice("/assets/photos/".length));
    } catch {
      sendText(response, 400, "Invalid asset path.");
      return;
    }
    if (!/^[a-z0-9-]+\.jpg$/i.test(photoName)) {
      sendText(response, 404, "Not found.");
      return;
    }
    file = path.join(root, "assets", "photos", photoName);
    contentType = "image/jpeg";
  } else {
    sendText(response, 404, "Not found.");
    return;
  }

  try {
    const content = await fs.readFile(file);
    response.writeHead(200, {
      "Cache-Control": "public, max-age=3600",
      "Content-Type": contentType,
      "X-Content-Type-Options": "nosniff"
    });
    response.end(content);
  } catch (error) {
    if (error.code === "ENOENT") {
      sendText(response, 404, "Not found.");
      return;
    }
    throw error;
  }
}

async function handleRequest(request, response) {
  const url = new URL(request.url, `http://${request.headers.host || "localhost"}`);

  if (request.method === "GET" && url.pathname === "/api/health") {
    sendJson(response, 200, { ok: true });
    return;
  }

  if (request.method === "GET" && url.pathname === "/api/config") {
    sendJson(response, 200, {
      paymentsEnabled,
      razorpayKeyId: paymentKeyId,
      tawkPropertyId: process.env.TAWK_PROPERTY_ID || "",
      tawkWidgetId: process.env.TAWK_WIDGET_ID || "default"
    });
    return;
  }

  if (request.method === "POST" && url.pathname === "/api/orders") {
    if (!isSameOrigin(request)) {
      sendJson(response, 403, { error: "Checkout requests must come from this website." });
      return;
    }
    if (!paymentsEnabled) {
      sendJson(response, 503, { error: "Online payment is not configured on the server." });
      return;
    }

    const body = await readJsonBody(request);
    if (!body || !validateCustomer(body.customer)) {
      sendJson(response, 400, { error: "Enter a valid name, phone number, and delivery address." });
      return;
    }
    const items = validateItems(body.items);
    if (!items) {
      sendJson(response, 400, { error: "Your cart contains an invalid item or quantity." });
      return;
    }

    const total = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    const providerOrder = await createProviderOrder(total * 100);
    if (!safeOrderId(providerOrder.id) || providerOrder.amount !== total * 100 || providerOrder.currency !== "INR") {
      sendJson(response, 502, { error: "The payment provider returned an invalid order reference." });
      return;
    }

    const pendingOrder = {
      orderId: providerOrder.id,
      amount: total * 100,
      currency: "INR",
      customer: {
        name: body.customer.name.trim(),
        phone: body.customer.phone.trim(),
        address: body.customer.address.trim()
      },
      items,
      createdAt: new Date().toISOString(),
      paymentStatus: "pending"
    };
    await fs.mkdir(pendingRoot, { recursive: true });
    await fs.writeFile(
      path.join(pendingRoot, `${providerOrder.id}.json`),
      JSON.stringify(pendingOrder, null, 2),
      { flag: "wx" }
    );
    sendJson(response, 201, {
      orderId: providerOrder.id,
      amount: providerOrder.amount,
      currency: providerOrder.currency,
      keyId: paymentKeyId
    });
    return;
  }

  if (request.method === "POST" && url.pathname === "/api/orders/verify") {
    if (!isSameOrigin(request)) {
      sendJson(response, 403, { error: "Payment verification requests must come from this website." });
      return;
    }
    if (!paymentsEnabled) {
      sendJson(response, 503, { error: "Online payment is not configured on the server." });
      return;
    }
    const body = await readJsonBody(request);
    if (!body || !safeOrderId(body.orderId) || typeof body.paymentId !== "string" ||
      !/^pay_[A-Za-z0-9]+$/.test(body.paymentId)) {
      sendJson(response, 400, { error: "Payment reference is invalid." });
      return;
    }
    if (!verifySignature(body.orderId, body.paymentId, body.signature)) {
      sendJson(response, 400, { error: "Payment signature could not be verified." });
      return;
    }

    const paidOrderPath = path.join(paidRoot, `${body.orderId}.json`);
    try {
      const alreadyPaid = JSON.parse(await fs.readFile(paidOrderPath, "utf8"));
      if (alreadyPaid.paymentId === body.paymentId) {
        sendJson(response, 200, { ok: true, orderReference: body.orderId });
      } else {
        sendJson(response, 409, { error: "This checkout order was already completed with a different payment." });
      }
      return;
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }

    let pendingOrder;
    try {
      pendingOrder = JSON.parse(await fs.readFile(path.join(pendingRoot, `${body.orderId}.json`), "utf8"));
    } catch (error) {
      if (error.code === "ENOENT") {
        sendJson(response, 404, { error: "This checkout order could not be found. Contact the restaurant before retrying." });
        return;
      }
      throw error;
    }

    if (pendingOrder.orderId !== body.orderId) {
      sendJson(response, 400, { error: "Payment order reference does not match." });
      return;
    }
    const providerPayment = await readProviderPayment(body.paymentId);
    if (providerPayment.order_id !== body.orderId ||
      providerPayment.amount !== pendingOrder.amount ||
      providerPayment.currency !== pendingOrder.currency ||
      providerPayment.status !== "captured") {
      sendJson(response, 409, { error: "Payment is not captured yet. Contact the restaurant if money was deducted." });
      return;
    }

    const paidOrder = {
      ...pendingOrder,
      paymentStatus: "paid",
      paymentId: body.paymentId,
      paidAt: new Date().toISOString()
    };
    await fs.mkdir(paidRoot, { recursive: true });
    await fs.writeFile(path.join(paidRoot, `${body.orderId}.json`), JSON.stringify(paidOrder, null, 2), { flag: "wx" });
    await fs.unlink(path.join(pendingRoot, `${body.orderId}.json`));
    sendJson(response, 200, { ok: true, orderReference: body.orderId });
    return;
  }

  if (request.method === "GET") {
    await serveStatic(url.pathname, response);
    return;
  }

  sendJson(response, 405, { error: "Method not allowed." });
}

const server = http.createServer((request, response) => {
  response.setHeader("X-Content-Type-Options", "nosniff");
  response.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  handleRequest(request, response).catch((error) => {
    console.error("Request failed:", error.message);
    if (!response.headersSent) {
      sendJson(response, error.statusCode || 500, {
        error: error.statusCode ? error.message : "The server could not complete the request."
      });
    } else {
      response.destroy();
    }
  });
});

server.listen(port, host, () => {
  console.log(`Warm Table server listening at http://${host}:${port}`);
  if (!paymentKeyId || !paymentKeySecret) {
    console.warn("Razorpay is disabled. Configure RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env.");
  } else if (paymentKeyId.startsWith("rzp_live_") && !livePaymentsAllowed) {
    console.warn("Live Razorpay payments are blocked. Only enable them after production security and order handling are ready.");
  }
  if (!process.env.TAWK_PROPERTY_ID) {
    console.warn("Tawk.to chat is disabled. Configure TAWK_PROPERTY_ID in .env.");
  }
});
