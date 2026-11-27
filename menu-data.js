const warmTableMenuItems = [
  {
    name: "Mysore Masala Dosa",
    category: "veg",
    label: "FRESH OFF THE TAWA",
    description: "Crisp rice-and-lentil crepe filled with spiced potato, served with coconut chutney and sambar.",
    price: 180,
    image: "assets/photos/masala-dosa-refresh.jpg",
    imageAlt: "Mysore masala dosa with chutney and potato filling served on a banana leaf"
  },
  {
    name: "Idli & Sambar",
    category: "veg",
    label: "BREAKFAST FAVORITE",
    description: "Soft steamed rice cakes with lentil sambar, coconut chutney, and a spoon of podi ghee.",
    price: 120,
    image: "assets/photos/idli-sambar-refresh.jpg",
    imageAlt: "Soft idli served with sambar and coconut chutney on a banana leaf"
  },
  {
    name: "Kerala Appam & Vegetable Stew",
    category: "veg",
    label: "KERALA COMFORT",
    description: "Lacy rice appams paired with a mellow coconut-milk stew of seasonal vegetables.",
    price: 210,
    image: "assets/photos/kerala-appam-refresh.jpg",
    imageAlt: "Appam served with Kerala-style vegetable stew"
  },
  {
    name: "Kerala Sadya",
    category: "veg",
    label: "BANANA-LEAF FEAST",
    description: "A celebratory spread of rice, seasonal vegetable curries, pickles, and a sweet finish.",
    price: 300,
    image: "assets/photos/kerala-sadya-refresh.jpg",
    imageAlt: "Banana-leaf meal with rice, curries, and traditional Kerala sides"
  },
  {
    name: "Chettinad Chicken Curry",
    category: "nonveg",
    label: "TAMIL NADU CLASSIC",
    description: "Slow-cooked chicken in a peppery Chettinad masala, finished with curry leaves.",
    price: 280,
    image: "assets/photos/chettinad-chicken-refresh.jpg",
    imageAlt: "Rich chicken curry topped with cream and fresh herbs"
  },
  {
    name: "Hyderabadi Chicken Biryani",
    category: "nonveg",
    label: "SLOW-COOKED",
    description: "Fragrant basmati layered with spiced chicken, caramelized onions, and fresh mint.",
    price: 300,
    image: "assets/photos/hyderabadi-biryani-refresh.jpg",
    imageAlt: "Fragrant biryani served on a banana leaf with a boiled egg"
  },
  {
    name: "Pal Payasam",
    category: "desserts",
    label: "SWEET FINISH",
    description: "Slow-simmered rice pudding with milk, cardamom, and a toasted nut finish.",
    price: 90,
    image: "assets/photos/pal-payasam-refresh.jpg",
    imageAlt: "Indian milk dessert topped with pistachios and almonds"
  },
  {
    name: "Jaggery Ladoo",
    category: "desserts",
    label: "MADE FOR SHARING",
    description: "Hand-rolled sweet bites with jaggery, ghee, and a hint of cardamom.",
    price: 70,
    image: "assets/photos/jaggery-ladoo-refresh.jpg",
    imageAlt: "Coconut ladoo sweets served in coconut shells"
  },
  {
    name: "Medu Vada",
    category: "veg",
    label: "CRISP & FRESH",
    description: "Crisp lentil fritters served hot with coconut chutney and sambar.",
    price: 100,
    image: "assets/photos/medu-vada-refresh.jpg",
    imageAlt: "Crisp medu vada served with sambar and chutneys on a banana leaf"
  },
  {
    name: "Chicken 65",
    category: "nonveg",
    label: "A LITTLE SPICE",
    description: "Crispy, spice-tossed chicken bites with curry leaves and green chilli.",
    price: 180,
    image: "assets/photos/chicken-65-refresh.jpg",
    imageAlt: "Crispy fried chicken pieces served on a white plate"
  },
  {
    name: "Sweet Pongal",
    category: "desserts",
    label: "FESTIVE FAVORITE",
    description: "Slow-cooked rice and moong dal sweetened with jaggery, ghee, and cardamom.",
    price: 90,
    image: "assets/photos/sweet-pongal-refresh.jpg",
    imageAlt: "Sweet pongal being stirred in a traditional pot"
  },
  {
    name: "Pesarattu with Ginger Chutney",
    category: "veg",
    label: "ANDHRA BREAKFAST",
    description: "A protein-rich green gram crepe served with sharp ginger chutney and a little upma.",
    price: 140,
    image: "assets/photos/pesarattu-refresh.jpg",
    imageAlt: "Masala dosa served on a banana leaf with chutneys"
  },
  {
    name: "Gutti Vankaya Kura",
    category: "veg",
    label: "ANDHRA CLASSIC",
    description: "Baby eggplants stuffed with roasted peanut, sesame, and a bold Andhra spice blend.",
    price: 190,
    image: "assets/photos/gutti-vankaya-refresh.jpg",
    imageAlt: "Stuffed baby eggplants on a plate"
  },
  {
    name: "Andhra Kodi Kura",
    category: "nonveg",
    label: "ANDHRA SPECIAL",
    description: "Tender chicken simmered with red chillies, curry leaves, and a tangy Andhra masala.",
    price: 240,
    image: "assets/photos/andhra-kodi-kura-refresh.jpg",
    imageAlt: "Indian chicken pieces with fresh herbs and vegetables"
  },
  {
    name: "Bisi Bele Bath",
    category: "veg",
    label: "KARNATAKA COMFORT",
    description: "Karnataka's rice-and-lentil one-pot meal with vegetables, tamarind, and house spice.",
    price: 160,
    image: "assets/photos/bisi-bele-bath-refresh.jpg",
    imageAlt: "A traditional Indian meal with rice, lentil stew, and side dishes"
  },
  {
    name: "Mysore Pak",
    category: "desserts",
    label: "MYSURU SWEET",
    description: "A rich Mysuru treat made with ghee, gram flour, and sugar; a small piece goes a long way.",
    price: 80,
    image: "assets/photos/mysore-pak-refresh.jpg",
    imageAlt: "Traditional Indian sweets arranged on festive platters"
  },
  {
    name: "Andhra Pulihora",
    category: "veg",
    label: "ANDHRA CLASSIC",
    description: "Tangy rice tossed with lemon, curry leaves, peanuts, and Andhra spices.",
    price: 100,
    image: "assets/photos/bisi-bele-bath-refresh.jpg",
    imageAlt: "A traditional Indian meal with rice, lentil stew, and side dishes"
  },
  {
    name: "Neer Dosa",
    category: "veg",
    label: "KARNATAKA TIFFIN",
    description: "Soft, lacy rice crepes served with coconut chutney and a light vegetable curry.",
    price: 130,
    image: "assets/photos/masala-dosa-refresh.jpg",
    imageAlt: "Mysore masala dosa with chutney and potato filling served on a banana leaf"
  },
  {
    name: "Rava Idli",
    category: "veg",
    label: "MYSURU FAVORITE",
    description: "Steamed semolina cakes with mustard seeds, curry leaves, and coconut chutney.",
    price: 110,
    image: "assets/photos/idli-sambar-refresh.jpg",
    imageAlt: "Soft idli served with sambar and coconut chutney on a banana leaf"
  },
  {
    name: "Maddur Vada",
    category: "veg",
    label: "KARNATAKA SNACK",
    description: "Crisp onion and rice-flour fritters, served hot with coconut chutney.",
    price: 100,
    image: "assets/photos/medu-vada-refresh.jpg",
    imageAlt: "Crisp medu vada served with sambar and chutneys on a banana leaf"
  },
  {
    name: "Pappu Charu with Rice",
    category: "veg",
    label: "ANDHRA COMFORT",
    description: "A homestyle lentil broth with tamarind and spices, served with steamed rice.",
    price: 140,
    image: "assets/photos/kerala-sadya-refresh.jpg",
    imageAlt: "Banana-leaf meal with rice, curries, and traditional Kerala sides"
  },
  {
    name: "Kodi Vepudu",
    category: "nonveg",
    label: "ANDHRA FRY",
    description: "Chicken stir-fried with red chilli, curry leaves, and roasted spices.",
    price: 250,
    image: "assets/photos/chicken-65-refresh.jpg",
    imageAlt: "Crispy fried chicken pieces served on a white plate"
  },
  {
    name: "Coorgi Chicken Curry",
    category: "nonveg",
    label: "COORG SPECIAL",
    description: "A peppery Coorg-inspired chicken curry simmered with herbs and warm spices.",
    price: 280,
    image: "assets/photos/chettinad-chicken-refresh.jpg",
    imageAlt: "Rich chicken curry topped with cream and fresh herbs"
  },
  {
    name: "Andhra Chepa Vepudu",
    category: "nonveg",
    label: "COASTAL ANDHRA",
    description: "Fish marinated with chilli, turmeric, and tangy spices, then pan-fried.",
    price: 250,
    image: "assets/photos/hero-feast-refresh.jpg",
    imageAlt: "A South Indian rice meal with fish fry and curries served on a banana leaf"
  },
  {
    name: "Dharwad Peda",
    category: "desserts",
    label: "KARNATAKA SWEET",
    description: "A rich Dharwad milk sweet with a gently caramelized finish.",
    price: 70,
    image: "assets/photos/mysore-pak-refresh.jpg",
    imageAlt: "Traditional Indian sweets arranged on festive platters"
  },
  {
    name: "Kesari Bath",
    category: "desserts",
    label: "MYSURU DESSERT",
    description: "A soft semolina sweet with ghee, saffron, and cashews.",
    price: 80,
    image: "assets/photos/sweet-pongal-refresh.jpg",
    imageAlt: "Sweet pongal being stirred in a traditional pot"
  }
];

if (typeof window !== "undefined") {
  window.WARM_TABLE_MENU_ITEMS = warmTableMenuItems;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = warmTableMenuItems;
}
