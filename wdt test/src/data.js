// ═══════════════════════════════════════════════════
//  🛍️ ZUCCHINI MALL v2 — Data & Constants
// ═══════════════════════════════════════════════════

// ── MAP CONFIG ────────────────────────────────────
export const MAP_W = 900;
export const MAP_H = 700;
export const SW  = 110;       // store block width
export const SH  = 95;        // store block height
export const LR  = 24;        // logo radius
export const CR  = 9;         // character radius
export const SPD = 3;         // movement speed per frame
export const TRIG = LR + CR + 32; // proximity trigger distance

// ── CORRIDOR CONSTANTS (cross-shaped layout) ──────
export const VX1 = 380;   // vertical corridor left edge
export const VX2 = 520;   // vertical corridor right edge
export const HY1 = 280;   // horizontal corridor top edge
export const HY2 = 420;   // horizontal corridor bottom edge

// No blocking walls — cross corridors are fully walkable
export const WALLS = [];

// ── CATEGORIES ────────────────────────────────────
export const CATEGORIES = [
  { id: "all",     label: "All Stores",  icon: "🏬" },
  { id: "fashion", label: "Fashion",     icon: "👗", color: "#FF4B6E" },
  { id: "tech",    label: "Tech",        icon: "📱", color: "#0DCFB4" },
  { id: "food",    label: "Food & Café", icon: "🍔", color: "#F0A500" },
  { id: "beauty",  label: "Beauty",      icon: "💄", color: "#A855F7" },
  { id: "sports",  label: "Sports",      icon: "⚽", color: "#22C55E" },
  { id: "home",    label: "Lifestyle",   icon: "🛋️", color: "#3B82F6" },
];

// ── 10 STORES ─────────────────────────────────────
export const STORES = [
  {
    id: 1, name: "Nike", emoji: "👟", color: "#EF4444", cat: "sports",
    side: "west", x: 30, y: 100,
    url: "https://www.nike.com",
    products: [
      { id: 101, name: "Air Max 270",     price: 120, emoji: "👟", desc: "Premium cushioning sneaker" },
      { id: 102, name: "Dri-FIT T-Shirt", price: 35,  emoji: "👕", desc: "Moisture-wicking training tee" },
      { id: 103, name: "Training Shorts", price: 45,  emoji: "🩳", desc: "Lightweight training shorts" },
      { id: 104, name: "Sports Cap",      price: 28,  emoji: "🧢", desc: "Adjustable performance cap" },
    ],
  },
  {
    id: 2, name: "Zara", emoji: "👗", color: "#6B7280", cat: "fashion",
    side: "north", x: 200, y: 20,
    url: "https://www.zara.com",
    products: [
      { id: 201, name: "Linen Blazer",      price: 89, emoji: "🧥", desc: "Relaxed-fit summer blazer" },
      { id: 202, name: "Wide-Leg Pants",    price: 59, emoji: "👖", desc: "High-waist wide trousers" },
      { id: 203, name: "Floral Midi Dress", price: 69, emoji: "👗", desc: "Wrap floral dress" },
      { id: 204, name: "Canvas Tote",       price: 29, emoji: "👜", desc: "Structured canvas tote" },
    ],
  },
  {
    id: 3, name: "H&M", emoji: "🛍️", color: "#EC4899", cat: "fashion",
    side: "north", x: 700, y: 20,
    url: "https://www.hm.com",
    products: [
      { id: 301, name: "Cotton Hoodie",   price: 35, emoji: "👕", desc: "Cotton-blend pullover hoodie" },
      { id: 302, name: "Mom Jeans",       price: 40, emoji: "👖", desc: "High-waist mom jeans" },
      { id: 303, name: "Slip Midi Dress", price: 25, emoji: "👗", desc: "Satin slip dress" },
      { id: 304, name: "Canvas Sneakers", price: 30, emoji: "👟", desc: "Classic canvas lace-ups" },
    ],
  },
  {
    id: 4, name: "Starbucks", emoji: "☕", color: "#16A34A", cat: "food",
    side: "east", x: 760, y: 100,
    url: "https://www.starbucks.com",
    products: [
      { id: 401, name: "Caramel Frappuccino", price: 7, emoji: "🧋", desc: "Blended caramel iced coffee" },
      { id: 402, name: "Matcha Latte",        price: 6, emoji: "🍵", desc: "Ceremonial grade matcha" },
      { id: 403, name: "Cold Brew",           price: 5, emoji: "☕", desc: "Slow-steeped cold brew" },
      { id: 404, name: "Vanilla Cake Pop",    price: 4, emoji: "🍡", desc: "Vanilla cake on a stick" },
    ],
  },
  {
    id: 5, name: "McDonald's", emoji: "🍔", color: "#FBBF24", cat: "food",
    side: "west", x: 30, y: 300,
    url: "https://www.mcdonalds.com",
    products: [
      { id: 501, name: "Big Mac",        price: 6, emoji: "🍔", desc: "Two patties, special sauce" },
      { id: 502, name: "McFlurry",       price: 4, emoji: "🍦", desc: "Soft-serve with toppings" },
      { id: 503, name: "Crispy McWrap",  price: 5, emoji: "🌯", desc: "Crispy chicken wrap" },
      { id: 504, name: "Large Fries",    price: 3, emoji: "🍟", desc: "Golden crispy fries" },
    ],
  },
  {
    id: 6, name: "Adidas", emoji: "🏃", color: "#3B82F6", cat: "sports",
    side: "east", x: 760, y: 300,
    url: "https://www.adidas.com",
    products: [
      { id: 601, name: "Ultraboost 23",     price: 180, emoji: "👟", desc: "Energy-return running shoe" },
      { id: 602, name: "Tiro Track Jacket", price: 70,  emoji: "🧥", desc: "Slim-fit training jacket" },
      { id: 603, name: "Samba OG",          price: 100, emoji: "👟", desc: "Classic street sneaker" },
      { id: 604, name: "Training Bag",      price: 45,  emoji: "🎒", desc: "Sports duffel bag" },
    ],
  },
  {
    id: 7, name: "Apple", emoji: "🍎", color: "#4B5563", cat: "tech",
    side: "west", x: 30, y: 550,
    url: "https://www.apple.com",
    products: [
      { id: 701, name: "iPhone 16",        price: 999, emoji: "📱", desc: "6.1\" Super Retina XDR" },
      { id: 702, name: "AirPods Pro",      price: 249, emoji: "🎧", desc: "Active noise cancellation" },
      { id: 703, name: "Apple Watch S10",  price: 399, emoji: "⌚", desc: "Health + fitness tracking" },
      { id: 704, name: "MagSafe Charger",  price: 39,  emoji: "🔌", desc: "15W wireless charging" },
    ],
  },
  {
    id: 8, name: "Samsung", emoji: "📱", color: "#2563EB", cat: "tech",
    side: "east", x: 760, y: 550,
    url: "https://www.samsung.com",
    products: [
      { id: 801, name: "Galaxy S25 Ultra", price: 1299, emoji: "📱", desc: "200MP camera powerhouse" },
      { id: 802, name: "Galaxy Buds 3",    price: 179,  emoji: "🎧", desc: "360° audio with ANC" },
      { id: 803, name: "Galaxy Watch 7",   price: 299,  emoji: "⌚", desc: "Advanced health sensors" },
      { id: 804, name: "65\" QLED TV",     price: 799,  emoji: "📺", desc: "4K Quantum Dot display" },
    ],
  },
  {
    id: 9, name: "Sephora", emoji: "💄", color: "#7C3AED", cat: "beauty",
    side: "south", x: 150, y: 600,
    url: "https://www.sephora.com",
    products: [
      { id: 901, name: "Charlotte Foundation", price: 52,  emoji: "💄", desc: "24hr coverage SPF 20" },
      { id: 902, name: "NARS Concealer",       price: 36,  emoji: "✨", desc: "Full-coverage concealer" },
      { id: 903, name: "YSL Perfume",          price: 110, emoji: "🌸", desc: "Mon Paris EDP" },
      { id: 904, name: "Laneige Lip Mask",     price: 24,  emoji: "💋", desc: "Overnight lip hydration" },
    ],
  },
  {
    id: 10, name: "IKEA", emoji: "🛋️", color: "#2563EB", cat: "home",
    side: "south", x: 740, y: 600,
    url: "https://www.ikea.com",
    products: [
      { id: 1001, name: "KALLAX Shelf",     price: 79,  emoji: "🗄️", desc: "4-cube shelving unit" },
      { id: 1002, name: "POÄNG Armchair",   price: 189, emoji: "🪑", desc: "Birch frame + cushion" },
      { id: 1003, name: "LACK Side Table",  price: 15,  emoji: "🪞", desc: "Minimalist side table" },
      { id: 1004, name: "VARDAGEN Pot Set", price: 35,  emoji: "🍳", desc: "Carbon steel cookware" },
    ],
  },
];

// ── PUZZLE LEVELS ─────────────────────────────────
export const PUZZLE_LEVELS = [
  { id: "easy",   label: "Easy",   discount: 5,  color: "#22C55E", memPairs: 4, quizCount: 5,  quizTime: 20, quizPass: 3  },
  { id: "normal", label: "Normal", discount: 10, color: "#F59E0B", memPairs: 6, quizCount: 8,  quizTime: 15, quizPass: 5  },
  { id: "hard",   label: "Hard",   discount: 15, color: "#EF4444", memPairs: 8, quizCount: 12, quizTime: 10, quizPass: 9  },
];

// ── MEMORY GAME EMOJIS ────────────────────────────
export const MEM_EMOJIS = ["🛍️","🏷️","💳","🛒","🎁","🧾","💰","🏬"];

// ── QUIZ QUESTIONS ────────────────────────────────
export const QUIZ_QUESTIONS = [
  { q: "What does 'BOGO' stand for in retail?",             opts: ["Buy One Get One","Best Online Good Offer","Bonus On Gift Order","Buy Off Get Off"],       ans: 0 },
  { q: "A $100 item with 20% off costs:",                   opts: ["$80","$75","$85","$90"],                                                                  ans: 0 },
  { q: "Which is NOT typically a payment method in stores?",opts: ["Credit Card","Gift Card","Library Card","Cash"],                                          ans: 2 },
  { q: "A 'clearance sale' is when a store:",               opts: ["Sells old stock at lower prices","Opens a new branch","Celebrates its anniversary","Launches a new product"], ans: 0 },
  { q: "Loyalty programs mainly help customers:",           opts: ["Earn rewards on purchases","Get free shipping always","Skip checkout lines","Pay in installments"],         ans: 0 },
  { q: "Black Friday sales happen the day after:",          opts: ["Christmas","Thanksgiving","Halloween","New Year's"],                                      ans: 1 },
  { q: "A 'flash sale' is typically characterized by:",     opts: ["Short duration with big discounts","Long seasonal discounts","Exclusive member prices","Bulk deals"],       ans: 0 },
  { q: "VAT stands for:",                                   opts: ["Value Added Tax","Variable Amount Tariff","Vendor Account Total","Volume Adjusted Trade"], ans: 0 },
  { q: "An 'anchor price' is:",                             opts: ["Original price shown next to sale price","Minimum legal price","Cost before markup","Competitor's price"],  ans: 0 },
  { q: "Cyber Monday is mainly associated with:",           opts: ["Online shopping deals","In-store flash sales","Grocery discounts","Travel deals"],         ans: 0 },
  { q: "A store's 'footfall' means:",                       opts: ["Number of customer visits","Store floor area","Inventory count","Daily sales total"],      ans: 0 },
  { q: "Pricing an item at $9.99 instead of $10 is called:",opts: ["Charm pricing","Bundle pricing","Anchor pricing","Premium pricing"],                      ans: 0 },
  { q: "RFID tags in retail are used for:",                 opts: ["Inventory tracking","Customer ID","Price display","Security cameras"],                    ans: 0 },
  { q: "In retail, 'shrinkage' refers to:",                 opts: ["Inventory loss from theft/damage","Store size reduction","Product downsizing","Staff cuts"],               ans: 0 },
  { q: "POS in retail stands for:",                         opts: ["Point of Sale","Proof of Stock","Payment on Shipment","Purchase Order System"],            ans: 0 },
  { q: "Selling a higher-priced product to a customer is:", opts: ["Upselling","Cross-selling","Downselling","Bundling"],                                      ans: 0 },
  { q: "A 'loss leader' is:",                               opts: ["A product priced below cost to attract shoppers","A failing product","A discounted loyalty item","A bulk deal"], ans: 0 },
  { q: "SKU stands for:",                                   opts: ["Stock Keeping Unit","Sales Knowledge Update","Standard Kit Upgrade","Store Key Utility"],  ans: 0 },
  { q: "A planogram is:",                                   opts: ["A visual guide for shelf arrangement","A store floor plan","A sales forecast","An inventory tool"],         ans: 0 },
  { q: "Dead stock refers to:",                             opts: ["Unsold inventory that can't be returned","Broken goods","Expired food","Items pending QC"], ans: 0 },
];

// ── HELPERS ───────────────────────────────────────
export function storeCenter(s) {
  // Store centers based on STORE_POSITIONS in MapView
  // Approximate corridor entry points per side
  switch (s.side) {
    case "north": return [s.x + SW / 2, HY1 + LR + 5];
    case "south": return [s.x + SW / 2, HY2 - LR - 5];
    case "west":  return [VX1 + LR + 5, s.y + SH / 2];
    case "east":  return [VX2 - LR - 5, s.y + SH / 2];
    default:      return [s.x + SW / 2, s.y + SH / 2];
  }
}

export function isBlocked(nx, ny) {
  if (nx < CR || nx > MAP_W - CR || ny < CR || ny > MAP_H - CR) return true;
  for (const w of WALLS) {
    const bx = Math.max(w.x, Math.min(nx, w.x + w.w));
    const by = Math.max(w.y, Math.min(ny, w.y + w.h));
    if ((nx - bx) ** 2 + (ny - by) ** 2 < CR * CR) return true;
  }
  return false;
}

export function fmt(n) {
  return "$" + Number(n).toFixed(2);
}

export function genOrderId() {
  return "ORD-" + Math.random().toString(36).substring(2, 9).toUpperCase();
}
