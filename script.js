const menuItems = window.WARM_TABLE_MENU_ITEMS;
const menuGrid = document.querySelector("#menu-grid");
const filterButtons = document.querySelectorAll(".filter-button");
const cartCount = document.querySelector(".cart-count");
const cartLink = document.querySelector("#open-cart");
const cartDialog = document.querySelector("#cart-dialog");
const cartLines = document.querySelector("#cart-lines");
const cartEmpty = document.querySelector("#cart-empty");
const cartSubtotal = document.querySelector("#cart-subtotal");
const cartStatus = document.querySelector("#cart-status");
const checkoutDialog = document.querySelector("#checkout-dialog");
const checkoutForm = document.querySelector("#checkout-form");
const checkoutTotal = document.querySelector("#checkout-total");
const checkoutStatus = document.querySelector("#checkout-status");
const payButton = document.querySelector("#pay-now");
const paymentSuccessDialog = document.querySelector("#payment-success-dialog");
const chatDialog = document.querySelector("#chat-dialog");
const chatStatus = document.querySelector("#chat-status");
const openLiveChatButton = document.querySelector("#open-live-chat");
const cart = new Map();
const cartStorageKey = "warm-table-cart-v1";
let siteConfig = null;

function itemId(item) {
  return item.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function formatPrice(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(amount);
}

function getItemById(id) {
  return menuItems.find((item) => itemId(item) === id);
}

function saveCart() {
  try {
    localStorage.setItem(cartStorageKey, JSON.stringify([...cart.entries()]));
  } catch (error) {
    console.error("Could not save the cart.", error);
    cartStatus.textContent = "Your cart could not be saved in this browser.";
  }
}

function restoreCart() {
  try {
    const savedCart = JSON.parse(localStorage.getItem(cartStorageKey) || "[]");
    if (!Array.isArray(savedCart)) {
      throw new TypeError("Saved cart data is not a list.");
    }

    savedCart.forEach((entry) => {
      if (!Array.isArray(entry) || entry.length !== 2) return;
      const [id, quantity] = entry;
      if (getItemById(id) && Number.isInteger(quantity) && quantity > 0 && quantity <= 10) {
        cart.set(id, quantity);
      }
    });
  } catch (error) {
    console.error("Could not restore the saved cart.", error);
    cartStatus.textContent = "Your saved cart could not be restored.";
  }
}

function cartQuantity() {
  return [...cart.values()].reduce((total, quantity) => total + quantity, 0);
}

function cartTotal() {
  return [...cart.entries()].reduce((total, [id, quantity]) => {
    const item = getItemById(id);
    return total + (item ? item.price * quantity : 0);
  }, 0);
}

function updateCartBadge() {
  const quantity = cartQuantity();
  cartCount.textContent = quantity;
  cartLink.setAttribute("aria-label", `Your cart, ${quantity} ${quantity === 1 ? "item" : "items"}`);
  cartSubtotal.textContent = formatPrice(cartTotal());
  checkoutTotal.textContent = formatPrice(cartTotal());
  document.querySelector("#continue-checkout").disabled = quantity === 0;
}

function updateQuantity(id, quantity) {
  if (!getItemById(id)) return;
  if (quantity <= 0) {
    cart.delete(id);
  } else if (quantity <= 10) {
    cart.set(id, quantity);
  } else {
    cartStatus.textContent = "You can add up to 10 of each dish.";
    return;
  }
  cartStatus.textContent = "";
  saveCart();
  renderCart();
  updateCartBadge();
}

function createQuantityButton(label, text, action) {
  const button = document.createElement("button");
  button.className = "quantity-button";
  button.type = "button";
  button.textContent = text;
  button.setAttribute("aria-label", label);
  button.addEventListener("click", action);
  return button;
}

function renderCart() {
  cartLines.replaceChildren();
  cartEmpty.hidden = cart.size > 0;

  cart.forEach((quantity, id) => {
    const item = getItemById(id);
    if (!item) return;

    const line = document.createElement("article");
    line.className = "cart-line";

    const details = document.createElement("div");
    const title = document.createElement("h3");
    title.textContent = item.name;
    const price = document.createElement("p");
    price.className = "cart-line-price";
    price.textContent = `${formatPrice(item.price)} each`;
    details.append(title, price);

    const controls = document.createElement("div");
    controls.className = "cart-line-controls";
    controls.append(
      createQuantityButton(`Remove one ${item.name}`, "−", () => updateQuantity(id, quantity - 1))
    );

    const count = document.createElement("span");
    count.className = "cart-quantity";
    count.textContent = quantity;
    controls.append(count);
    controls.append(
      createQuantityButton(`Add one ${item.name}`, "+", () => updateQuantity(id, quantity + 1))
    );

    const remove = document.createElement("button");
    remove.className = "remove-item";
    remove.type = "button";
    remove.textContent = "Remove";
    remove.addEventListener("click", () => updateQuantity(id, 0));
    controls.append(remove);

    line.append(details, controls);
    cartLines.append(line);
  });

  updateCartBadge();
}

function addToCart(item, button) {
  const id = itemId(item);
  const nextQuantity = (cart.get(id) || 0) + 1;
  if (nextQuantity > 10) {
    cartStatus.textContent = "You can add up to 10 of each dish.";
    cartDialog.showModal();
    return;
  }

  cart.set(id, nextQuantity);
  cartStatus.textContent = "";
  saveCart();
  renderCart();
  button.textContent = "Added ✓";
  window.setTimeout(() => {
    button.textContent = "Add to cart +";
  }, 1000);
}

function makeMenuCard(item) {
  const card = document.createElement("article");
  card.className = "menu-card";

  const image = document.createElement("img");
  image.className = "dish-image";
  image.src = item.image;
  image.alt = item.imageAlt;
  image.loading = "lazy";

  const content = document.createElement("div");
  content.className = "dish-content";

  const category = document.createElement("p");
  category.className = "dish-label";
  category.textContent = item.label;

  const title = document.createElement("h3");
  title.textContent = item.name;

  const description = document.createElement("p");
  description.className = "dish-description";
  description.textContent = item.description;

  const footer = document.createElement("div");
  footer.className = "dish-footer";

  const price = document.createElement("p");
  price.className = "dish-price";
  price.textContent = formatPrice(item.price);

  const addButton = document.createElement("button");
  addButton.className = "add-button";
  addButton.type = "button";
  addButton.textContent = "Add to cart +";
  addButton.setAttribute("aria-label", `Add ${item.name} to cart`);
  addButton.addEventListener("click", () => addToCart(item, addButton));

  footer.append(price, addButton);
  content.append(category, title, description, footer);
  card.append(image, content);
  return card;
}

function showMenu(filter) {
  const visibleItems = filter === "all"
    ? menuItems
    : menuItems.filter((item) => item.category === filter);
  menuGrid.replaceChildren(...visibleItems.map(makeMenuCard));
}

async function requestJson(url, options) {
  const response = await fetch(url, options);
  const body = await response.json();
  if (!response.ok) {
    throw new Error(body.error || `Request failed (${response.status}).`);
  }
  return body;
}

function configureTawk(propertyId, widgetId) {
  if (!propertyId || !widgetId) {
    chatStatus.textContent = "Live chat is not configured yet. Add your Tawk.to property and widget IDs to the server environment.";
    return;
  }

  window.Tawk_API = window.Tawk_API || {};
  window.Tawk_API.onLoad = () => {
    chatStatus.textContent = "Our support team is ready to help.";
    openLiveChatButton.hidden = false;
    if (typeof window.Tawk_API.hideWidget === "function") {
      window.Tawk_API.hideWidget();
    }
  };

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://embed.tawk.to/${encodeURIComponent(propertyId)}/${encodeURIComponent(widgetId)}`;
  script.onerror = () => {
    chatStatus.textContent = "Live chat could not connect. Please try again later.";
  };
  document.head.append(script);
}

function openLiveSupport() {
  const api = window.Tawk_API;
  if (!api || typeof api.maximize !== "function") return false;
  if (typeof api.showWidget === "function") api.showWidget();
  api.maximize();
  return true;
}

async function loadSiteConfig() {
  try {
    siteConfig = await requestJson("/api/config", { cache: "no-store" });
    configureTawk(siteConfig.tawkPropertyId, siteConfig.tawkWidgetId);

    if (!siteConfig.paymentsEnabled || !siteConfig.razorpayKeyId) {
      checkoutStatus.textContent = "Online payment is not configured. Add your Razorpay test/live keys to the server environment.";
      payButton.disabled = true;
    } else {
      checkoutStatus.textContent = "Your payment is processed securely by Razorpay.";
      payButton.disabled = false;
    }
  } catch (error) {
    console.error("Could not load checkout configuration.", error);
    checkoutStatus.textContent = "Checkout service is unavailable. Start the website with the Node server and check its configuration.";
    chatStatus.textContent = "Live chat service is unavailable. Start the website with the Node server.";
    payButton.disabled = true;
  }
}

function loadRazorpayCheckout() {
  if (window.Razorpay) return Promise.resolve();

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = resolve;
    script.onerror = () => reject(new Error("Could not load Razorpay Checkout."));
    document.head.append(script);
  });
}

async function verifyPayment(paymentResponse) {
  const result = await requestJson("/api/orders/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      orderId: paymentResponse.razorpay_order_id,
      paymentId: paymentResponse.razorpay_payment_id,
      signature: paymentResponse.razorpay_signature
    })
  });

  cart.clear();
  saveCart();
  renderCart();
  checkoutForm.reset();
  checkoutDialog.close();
  document.querySelector("#payment-order-reference").textContent = result.orderReference;
  paymentSuccessDialog.showModal();
}

checkoutForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  checkoutStatus.textContent = "";
  if (!checkoutForm.reportValidity()) return;

  if (!siteConfig || !siteConfig.paymentsEnabled || cart.size === 0) {
    checkoutStatus.textContent = "Payment is unavailable until the server and cart are configured.";
    return;
  }

  const formData = new FormData(checkoutForm);
  const customer = {
    name: String(formData.get("name")).trim(),
    phone: String(formData.get("phone")).trim(),
    address: String(formData.get("address")).trim()
  };

  payButton.disabled = true;
  payButton.textContent = "Preparing secure checkout…";
  try {
    await loadRazorpayCheckout();
    const order = await requestJson("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer,
        items: [...cart.entries()].map(([id, quantity]) => ({ id, quantity }))
      })
    });

    const checkout = new window.Razorpay({
      key: order.keyId,
      amount: order.amount,
      currency: order.currency,
      name: "Warm Table",
      description: "South Indian restaurant order",
      order_id: order.orderId,
      prefill: { name: customer.name, contact: customer.phone },
      theme: { color: "#1e6161" },
      handler: async (paymentResponse) => {
        checkoutStatus.textContent = "Verifying your payment…";
        try {
          await verifyPayment(paymentResponse);
        } catch (error) {
          console.error("Payment verification failed.", error);
          checkoutStatus.textContent = "Payment verification is pending. Do not retry; contact the restaurant with payment reference " +
            paymentResponse.razorpay_payment_id + ".";
        }
      },
      modal: {
        ondismiss: () => {
          checkoutStatus.textContent = "Checkout closed. Your cart is still saved.";
        }
      }
    });
    checkout.on("payment.failed", (failure) => {
      checkoutStatus.textContent = failure.error.description || "Payment failed. Your cart is still saved.";
    });
    checkout.open();
  } catch (error) {
    console.error("Could not start secure checkout.", error);
    checkoutStatus.textContent = error.message || "Could not start checkout. Please try again.";
  } finally {
    payButton.disabled = false;
    payButton.textContent = "Pay securely";
  }
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((filterButton) => {
      const selected = filterButton === button;
      filterButton.classList.toggle("is-active", selected);
      filterButton.setAttribute("aria-pressed", String(selected));
    });
    showMenu(button.dataset.filter);
  });
});

cartLink.addEventListener("click", () => {
  renderCart();
  cartDialog.showModal();
});

document.querySelector("#continue-checkout").addEventListener("click", () => {
  if (cart.size === 0) return;
  cartDialog.close();
  checkoutTotal.textContent = formatPrice(cartTotal());
  checkoutDialog.showModal();
});

document.querySelectorAll("[data-close-dialog]").forEach((button) => {
  button.addEventListener("click", () => button.closest("dialog").close());
});

document.querySelector("#chat-launcher").addEventListener("click", () => {
  if (!openLiveSupport()) chatDialog.showModal();
});

openLiveChatButton.addEventListener("click", () => {
  chatDialog.close();
  openLiveSupport();
});

document.querySelector("#contact-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const feedback = document.querySelector("#form-feedback");
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }
  feedback.textContent = "Thanks for stopping by! This is a demo confirmation only — nothing was sent or saved.";
  feedback.hidden = false;
  form.reset();
});

document.querySelector("#current-year").textContent = new Date().getFullYear();
restoreCart();
renderCart();
showMenu("all");
loadSiteConfig();
