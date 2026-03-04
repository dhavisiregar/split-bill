# SplitIt 🧾

A smart bill-splitting web app. Upload a receipt photo and AI automatically extracts items, tax, and service charge — then split the bill with your friends and share the result via WhatsApp.

![SplitIt](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react) ![Tailwind](https://img.shields.io/badge/Tailwind-v4-38BDF8?style=flat&logo=tailwindcss) ![Groq](https://img.shields.io/badge/Groq-LLaMA4-F55036?style=flat) ![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=flat&logo=vite)

---

## Features

- 📸 **AI Receipt Scanning** — upload a photo of any receipt and Groq's LLaMA 4 Scout vision model automatically extracts items, prices, quantities, tax %, service charge %, and restaurant name
- ✏️ **Manual Entry** — add or edit items manually at any time
- 👥 **Participants** — add everyone who's splitting the bill
- ⚡ **Smart Splitting** — assign each item to whoever ordered it, with per-person share calculated instantly
- 💸 **WhatsApp Share** — generates a formatted message with each person's total, ready to share
- 🔌 **Works without a backend** — all calculation and state is handled client-side

---

## Tech Stack

| Layer            | Technology               |
| ---------------- | ------------------------ |
| UI Framework     | React 18                 |
| Styling          | Tailwind CSS v4          |
| State Management | Zustand                  |
| Build Tool       | Vite 7                   |
| Icons            | Lucide React             |
| AI Vision        | Groq API (LLaMA 4 Scout) |

---

## Project Structure

```
src/
├── api/
│   └── receiptAI.js        # Groq vision API — receipt extraction
├── components/
│   ├── ui/
│   │   └── index.jsx       # Reusable primitives: Input, Button, Card, Toast, Avatar, etc.
│   ├── steps/
│   │   ├── BillStep.jsx    # Step 1: title, tax, service charge, image upload, items
│   │   ├── PeopleStep.jsx  # Step 2: add/remove participants
│   │   ├── SplitStep.jsx   # Step 3: assign items to people
│   │   └── SummaryStep.jsx # Step 4: per-person totals + WhatsApp share
│   └── StepNav.jsx         # Progress bar navigation
├── hooks/
│   └── useToast.js         # Toast notification hook
├── store/
│   └── billStore.js        # Zustand global state
├── types/
│   └── index.js            # JSDoc type definitions
├── utils/
│   └── calculation.js      # Pure functions: calculate(), buildWhatsAppLink(), formatIDR()
├── App.jsx                 # Root component — step orchestration
├── main.jsx
└── index.css               # Tailwind v4 + custom base styles
```

---

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/yourusername/split-bill-fe.git
cd split-bill-fe
npm install
```

### 2. Set up environment variables

Create a `.env` file in the project root:

```env
VITE_GROQ_API_KEY=your_groq_api_key_here
```

Get your free API key at [console.groq.com/keys](https://console.groq.com/keys).

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:5174](http://localhost:5174).

---

## How It Works

### The 4-step flow

```
[1. Bill] → [2. People] → [3. Split] → [4. Summary]
```

**Step 1 — Bill**
Upload a receipt photo and click **"Extract Items, Tax & Service with AI"**. The app sends the image to Groq's LLaMA 4 Scout vision model, which returns a structured JSON with all line items, tax percentage, service charge percentage, and the merchant name — all auto-filled into the form. You can still add or remove items manually.

**Step 2 — People**
Add the names of everyone splitting the bill.

**Step 3 — Split**
For each item, select who had it. Use "Select all" for shared items. The per-person share is shown in real time.

**Step 4 — Summary**
See each person's total with tax and service charge applied. Share directly to WhatsApp with one tap.

### AI extraction example

Given a receipt with:

- Subtotal: Rp 201,000
- SC: Rp 14,070
- PB1: Rp 21,507

The AI returns:

```json
{
  "items": [
    { "name": "Tori Aka Ramen", "price": 83000, "qty": 1 },
    { "name": "Tori Karaagemen (R)", "price": 69000, "qty": 1 },
    { "name": "Yaki Tori Gyoza", "price": 35000, "qty": 1 },
    { "name": "Ice Ocha", "price": 14000, "qty": 1 }
  ],
  "tax": 10.7,
  "serviceCharge": 7.0,
  "title": "Ikkudo Ichi"
}
```

### Calculation logic

```
per-person amount = sum of their assigned item shares × (1 + tax% + serviceCharge%)
```

This mirrors the Go backend's `CalculationService` so results are consistent whether using the backend or local calculation.

---

## Deployment

Since the app is fully client-side, deploy as a static site:

```bash
npm run build   # outputs to /dist
```

Then deploy `/dist` to **Vercel**, **Netlify**, or any static host. Remember to set `VITE_GROQ_API_KEY` as an environment variable in your hosting platform's settings.

---

## License

MIT
