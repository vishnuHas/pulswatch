# PulseWatch - AI-Powered Brand Mention & Reputation Tracker

> **🤖 100% Local AI - Zero Cost, Zero API Keys, Zero Limits!**
> All AI features run offline using Hugging Face Transformers.js

## 🚀 Features
- Real-time brand mention tracking from Reddit, Hacker News, and Google News
- **Local AI-powered sentiment analysis** (DistilBERT - runs offline!)
- **Local embeddings** for topic clustering (all-MiniLM-L6-v2)
- **Rule-based insights** generation (no LLM needed)
- Spike detection for positive/negative trends
- Real-time WebSocket updates
- localStorage caching for instant loads
- Modern white-themed dashboard with animations
- Brand comparison tool
- PDF export
- **100% free - no API costs, no rate limits**

## 📦 Installation

1. Install root dependencies:
```bash
npm install
```

2. Install client dependencies:
```bash
cd client
npm install
cd ..
```

Or use the helper script:
```bash
npm run install-all
```

3. Create `.env` file (optional - no API keys needed!):
```bash
cp .env.example .env
```

**That's it!** No API keys, no configuration. Just run the app.

## 🏃 Running the Application

Development mode (runs both backend and frontend):
```bash
npm run dev
```

Backend only:
```bash
npm run server
```

Frontend only:
```bash
npm run client
```

Production build:
```bash
npm run build
npm start
```

## 🌐 Access

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- WebSocket: ws://localhost:5000

## 📁 Project Structure

```
pulsewatch/
├── server/
│   ├── index.js              # Main server file
│   ├── routes/               # API routes
│   ├── services/             # Data fetchers & AI logic
│   │   ├── reddit.js
│   │   ├── hackernews.js
│   │   ├── googlenews.js
│   │   ├── sentiment.js
│   │   ├── embeddings.js
│   │   ├── clustering.js
│   │   ├── spikes.js
│   │   └── insights.js
│   └── websocket/            # WebSocket handlers
├── client/                   # Next.js frontend
│   ├── pages/
│   ├── components/
│   └── utils/
└── package.json
```

## 🎯 API Endpoints

- `GET /api/fetchAll?brand=NAME` - Fetch all mentions
- `GET /api/sentiment?brand=NAME` - Get sentiment analysis
- `GET /api/clusters?brand=NAME` - Get topic clusters
- `GET /api/timeline?brand=NAME` - Get mention timeline
- `GET /api/insights?brand=NAME` - Get AI insights
- `GET /api/compare?brandA=X&brandB=Y` - Compare brands
- `WS /api/live` - WebSocket for real-time updates

## 🛠️ Technologies

**Backend:**
- Node.js + Express
- WebSockets (ws)
- **Transformers.js for local AI** (sentiment + embeddings)
- **DistilBERT** for sentiment analysis (offline)
- **all-MiniLM-L6-v2** for embeddings (offline)
- Natural.js for NLP
- ml-kmeans for clustering
- **Zero external AI APIs**

**Frontend:**
- Next.js 14
- React 18
- Tailwind CSS
- Framer Motion
- Chart.js / Recharts
- localStorage caching

## 📄 License

MIT
