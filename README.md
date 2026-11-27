# Warm Table restaurant site

A South Indian restaurant website made with HTML, CSS, vanilla JavaScript, and a small Node.js backend. It features 26 menu items, including Andhra Pradesh and Karnataka specialties, cart and checkout screens, Razorpay payment verification, and a Tawk.to live-chat launcher. The site uses locally bundled food photography and a deep-teal, coral, and lavender palette.

## Run it

Requires Node.js 20 or later. From this folder, copy `.env.example` to `.env`, add Razorpay test credentials and Tawk.to widget IDs, then run:

```powershell
Copy-Item .env.example .env
npm start
```

Open `http://127.0.0.1:3000`. Checkout remains disabled until both Razorpay keys are configured. Start with Razorpay test keys; never put the secret key in browser code or commit `.env`. Live payments should only be enabled after deployment uses HTTPS and production order storage, webhook reconciliation, and order-handling procedures are configured.

## Files

- `index.html` — page sections, navigation, cart, checkout, chat, and demo contact form
- `styles.css` — colors, layout, and responsive styles
- `menu-data.js` — shared menu catalog used by the browser and payment server
- `script.js` — menu filters, persistent cart, checkout, and Tawk.to launcher
- `server.cjs` — static site server and secure Razorpay order/payment verification endpoints
- `package.json` — Node.js start scripts and runtime requirement
- `.env.example` — environment variable template (copy to `.env`)
- `.gitignore` — excludes environment secrets and local order data
- `assets/photos/` — locally bundled restaurant and menu photos

The restaurant, address, phone number, and menu are fictional sample content. Pexels photos are used under the [Pexels license](https://www.pexels.com/license/); attribution is optional. Photo IDs and source pages are listed below.

| Photo | Pexels image |
| --- | --- |
| Banana-leaf feast | [13243817](https://www.pexels.com/photo/tray-with-rice-and-bowls-of-sauces-13243817/) |
| Coffee brewing | [10226668](https://www.pexels.com/search/filter%20coffee/) |
| Mysore masala dosa | [32229637](https://www.pexels.com/photo/traditional-south-indian-masala-dosa-on-banana-leaf-32229637/) |
| Idli and sambar | [31199041](https://www.pexels.com/photo/traditional-south-indian-idli-with-sambar-and-chutney-31199041/) |
| Kerala appam | [30622221](https://www.pexels.com/photo/delicious-kerala-style-appam-with-stew-on-granite-table-30622221/) |
| Kerala sadya | [14132112](https://www.pexels.com/photo/close-up-shot-of-a-delicious-cuisine-14132112/) |
| Chettinad chicken curry | [37295815](https://www.pexels.com/search/chicken%20curry/) |
| Hyderabadi biryani | [35539329](https://www.pexels.com/photo/traditional-indian-biryani-served-on-banana-leaves-35539329/) |
| Pal payasam | [39596666](https://www.pexels.com/photo/traditional-indian-dessert-with-pistachios-and-almonds-39596666/) |
| Jaggery ladoo | [34153204](https://www.pexels.com/photo/delicious-coconut-ladoo-in-coconut-shells-34153204/) |
| Medu vada | [38201889](https://www.pexels.com/photo/traditional-indian-breakfast-on-banana-leaf-38201889/) |
| Chicken 65 | [9872916](https://www.pexels.com/search/fried%20chicken/) |
| Sweet Pongal | [30519624](https://www.pexels.com/photo/traditional-pongal-festival-ritual-with-pot-30519624/) |
| Pesarattu | [12392915](https://www.pexels.com/search/pesarattu/) |
| Gutti Vankaya | [35287416](https://www.pexels.com/photo/stuffed-indian-eggplants-on-black-plate-35287416/) |
| Andhra chicken curry | [19141541](https://www.pexels.com/search/andhra%20chicken%20curry/) |
| Bisi Bele Bath | [18469775](https://www.pexels.com/photo/meal-in-bowls-and-on-plates-18469775/) |
| Mysore Pak sweets | [5878321](https://www.pexels.com/search/mysore%20sweet%20pak/) |

The cart is saved in the browser. After successful payment verification, customer delivery details and paid order information are saved to `data/orders/`, which is intentionally not served by the site. Protect this personal data and use a secured database instead of local files before public production use. The contact form only shows a local demo confirmation; it does not send or save information.
