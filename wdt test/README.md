# 🛍️ Zucchini Mall v2

A virtual interactive shopping mall with a live map, mini-games, and a full shopping cart.

---

## ✨ Features

| Feature | Details |
|---|---|
| 🗺️ Interactive Map | WASD / Arrow-key movement, thought-bubble proximity popups |
| 🎮 3 Mini-Games | Memory Flip (fixed), Sudoku, Quiz — all with 3 difficulty levels |
| 🎟️ Coupon System | Easy 5% · Normal 10% · Hard 15% applied at checkout |
| 🛍️ 10 Stores | Fashion, Tech, Food, Beauty, Sports, Lifestyle |
| 🛒 Cart & Checkout | Full cart, quantity controls, discount applied, order confirmation |
| 👤 Login Page | Styled full-page login matching the mall UI |
| 🧑 Replaceable Player | Swap the stickman with any image (see below) |

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Open in browser
http://localhost:5173
```

Requires **Node.js 18+**.

---

## 🧑 Replacing the Stickman

Open **`src/data.js`** and change `PLAYER_IMAGE`:

```js
// Default – SVG stickman
export const PLAYER_IMAGE = null;

// Custom image – put your file in /public
export const PLAYER_IMAGE = "/avatar.png";
export const PLAYER_IMAGE = "/myface.jpg";
```

The image is displayed as a circle-clipped sprite on the map with a teal glow.

---

## 🎮 Map Controls

| Action | Keyboard | Mobile |
|---|---|---|
| Move | WASD or Arrow Keys | On-screen D-Pad |
| Enter Store | E | Tap "Enter" in thought bubble |

---

## 🎟️ Discount Levels

| Level | Discount | Memory Pairs | Quiz Qs | Quiz Pass |
|---|---|---|---|---|
| Easy | 5% | 4 pairs | 5 Qs | 3/5 |
| Normal | 10% | 6 pairs | 8 Qs | 5/8 |
| Hard | 15% | 8 pairs | 12 Qs | 9/12 |

The discount applies to your **entire cart** at checkout.

---

## 📁 Project Structure

```
ZucchiniMall/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx          — React entry point
    ├── data.js           — Stores, quiz questions, constants
    ├── App.jsx           — Global state & routing
    └── components/
        ├── NavBar.jsx
        ├── LoginPage.jsx
        ├── HomePage.jsx
        ├── MapView.jsx
        ├── PuzzleView.jsx
        ├── StoreModal.jsx
        └── CartDrawer.jsx  — Cart + Checkout + Order Success
```

---

## 🛠️ Build for Production

```bash
npm run build
npm run preview
```
