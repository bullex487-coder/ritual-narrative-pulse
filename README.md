# 🟢 Narrative Pulse

> AI-powered crypto market sentiment oracle for the Ritual ecosystem.

A Bloomberg terminal-style intelligence dashboard that analyzes crypto token narratives, sentiment scores, hype probability, and risk levels using an AI reasoning engine.

---

## ✨ Features

| Feature | Status |
|---|---|
| Token analysis input with quick-select | ✅ |
| AI sentiment scoring (0–100) | ✅ |
| Narrative strength index | ✅ |
| Hype probability classification | ✅ |
| Risk level assessment | ✅ |
| AI reasoning summary (typewriter) | ✅ |
| 24h sentiment timeline chart | ✅ |
| Signal radar chart | ✅ |
| Live market pulse ticker | ✅ |
| Terminal-style loading animation | ✅ |
| Save analysis to localStorage | ✅ |
| Sidebar history | ✅ |
| Responsive mobile design | ✅ |
| Ritual blockchain integration | 🔜 Placeholder |
| OpenAI live API | 🔜 Placeholder |

---

## 🗂 Project Structure

```
narrative-pulse/
├── app/
│   ├── api/
│   │   └── analyze/
│   │       └── route.ts          # POST /api/analyze
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                  # Main dashboard
├── components/
│   ├── AIInsight.tsx             # AI reasoning display
│   ├── AnalysisCard.tsx          # Metric score card
│   ├── EmptyState.tsx            # Empty dashboard state
│   ├── LoadingState.tsx          # Terminal loading animation
│   ├── MarketPulseTicker.tsx     # Live market ticker bar
│   ├── Navbar.tsx                # Top navigation
│   ├── Sidebar.tsx               # Saved history sidebar
│   ├── SentimentChart.tsx        # Area + Radar charts
│   └── TokenInput.tsx            # Token search input
├── hooks/
│   ├── useAnalysis.ts            # Analysis state management
│   └── useMarketPulse.ts         # Live market pulse
├── lib/
│   ├── helpers.ts                # Utility functions
│   └── mockData.ts               # Mock data generator
├── services/
│   └── api.ts                    # API service layer
├── types/
│   └── index.ts                  # TypeScript interfaces
├── .env.local.example
├── next.config.mjs
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 2. Set up environment variables

```bash
cp .env.local.example .env.local
# Fill in your keys
```

### 3. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## 🔌 Integrations (Placeholders)

### OpenAI

Replace mock analysis in `app/api/analyze/route.ts`:

```ts
// Uncomment and fill in the OpenAI call block
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const completion = await openai.chat.completions.create({ ... });
```

### Ritual Network

Replace placeholder in `services/api.ts`:

```ts
// submitToRitual()
const provider = new ethers.JsonRpcProvider(process.env.RITUAL_RPC_URL);
const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
const tx = await contract.submitAnalysis(analysisId);
```

---

## 🎨 Design System

- **Font**: JetBrains Mono (terminal aesthetic)
- **Theme**: Black + Zinc + Emerald accent
- **Style**: Institutional finance terminal × AI intelligence dashboard

---

## 📦 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Animation**: Framer Motion
- **Charts**: Recharts
- **Icons**: Lucide React
- **Blockchain**: ethers.js (placeholder)
- **AI**: OpenAI API (placeholder)

---

## 🔐 License

MIT — free for personal and commercial use.
