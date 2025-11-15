# 🚀 Quick Start Guide

## PulseWatch - 100% Local AI, Zero Configuration

### ✨ What Makes This Special

- ✅ **No API Keys** - Zero configuration needed
- ✅ **100% Free** - No costs, ever
- ✅ **No Rate Limits** - Process unlimited mentions
- ✅ **Complete Privacy** - All data stays on your machine
- ✅ **Offline Capable** - Works without internet (after initial setup)

### 📦 Installation

1. **Install dependencies:**
   ```bash
   npm install
   cd client
   npm install
   cd ..
   ```

2. **That's it!** No API keys, no configuration files needed.

### 🏃 Running the App

**Start everything:**
```bash
npm run dev
```

This starts:
- Backend server on http://localhost:5000
- Frontend on http://localhost:3000

**Or run separately:**
```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend
cd client
npm run dev
```

### 🎯 First Run

On first run, AI models will download automatically (~330MB):

```
🤖 Loading local sentiment analysis model...
✅ Sentiment model loaded
🤖 Loading local embedding model...
✅ Embedding model loaded
```

**This happens once.** After that, everything runs instantly offline.

### 🌐 Access the App

Open your browser to:
- **Dashboard**: http://localhost:3000
- **API**: http://localhost:5000/api/health

### 🔍 Try It Out

1. Search for a brand (e.g., "OpenAI", "Tesla", "Apple")
2. Watch as mentions are fetched from Reddit, Hacker News, and Google News
3. See real-time sentiment analysis using local AI
4. View topic clusters and insights
5. All processing happens on your machine!

### 🤖 AI Features (All Local)

**Sentiment Analysis:**
- Model: DistilBERT (state-of-the-art)
- Accuracy: ~90%
- Speed: ~50-100ms per text
- No API calls

**Embeddings:**
- Model: all-MiniLM-L6-v2
- Dimensions: 384
- Used for topic clustering
- No API calls

**Insights:**
- Rule-based analysis
- Instant generation
- No LLM needed

### 📊 What You Get

✅ Real-time brand mention tracking  
✅ AI sentiment analysis (Positive/Neutral/Negative)  
✅ Topic clustering (automatic grouping)  
✅ Spike detection (positive/negative trends)  
✅ AI-generated insights  
✅ Live dashboard with charts  
✅ WebSocket real-time updates  
✅ PDF export  
✅ Brand comparison  

### 💾 Storage Requirements

- **Models**: ~330MB (one-time download)
- **Cache**: ~50MB
- **Total**: ~380MB

### 🔧 Troubleshooting

**Models not downloading?**
- Check internet connection (needed for first run only)
- Verify ~500MB free disk space
- Check firewall settings

**Slow first run?**
- Normal! Models are downloading
- Subsequent runs are instant

**Port already in use?**
```bash
# Kill existing Node processes
Get-Process -Name node | Stop-Process -Force
```

### 📚 Learn More

- **Local AI Guide**: See `LOCAL_AI_GUIDE.md` for detailed AI documentation
- **README**: See `README.md` for full project documentation

### 🎉 That's It!

No API keys, no configuration, no costs. Just install and run!

```bash
npm run dev
```

Open http://localhost:3000 and start tracking brands! 🚀
