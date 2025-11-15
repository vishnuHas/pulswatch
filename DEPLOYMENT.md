# PulseWatch Deployment Guide

## 🚀 Quick Deploy (Recommended)

### Frontend: Vercel (Free)
1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import repository
4. Set root directory: `client`
5. Deploy!

**Environment Variables:**
```
NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
```

### Backend: Railway (Free $5/month credit)
1. Go to [railway.app](https://railway.app)
2. New Project → Deploy from GitHub
3. Select your repository
4. Railway will auto-detect Node.js
5. Add environment variables from `.env.example`

**Note:** AI models (~250MB) may require paid plan for better performance.

---

## 🔧 Alternative: Local Backend + Vercel Frontend

### 1. Deploy Frontend to Vercel
```bash
cd client
vercel
```

### 2. Run Backend Locally
```bash
npm run server
```

### 3. Expose Backend with ngrok
```bash
ngrok http 5000
```

### 4. Update Frontend API URL
Use the ngrok URL in your Vercel environment variables.

---

## 📦 What Gets Deployed

### Frontend (Vercel)
- ✅ Next.js app
- ✅ React components
- ✅ Static assets
- ✅ Automatic SSL
- ✅ Global CDN

### Backend (Railway/Local)
- ✅ Express server
- ✅ WebSocket server
- ✅ AI models (DistilBERT)
- ✅ Reddit/HN/News APIs
- ✅ Sentiment analysis
- ✅ Topic clustering

---

## ⚠️ Free Tier Limitations

### Vercel (Frontend)
- ✅ Unlimited bandwidth
- ✅ Unlimited deployments
- ✅ 100GB bandwidth/month
- ✅ Automatic HTTPS

### Railway (Backend)
- ⚠️ $5 free credit/month
- ⚠️ ~500 hours runtime
- ⚠️ 512MB RAM (may be tight for AI)
- ⚠️ 1GB storage

### Recommended for Production
- Consider upgrading Railway for better AI performance
- Or use local backend for development

---

## 🎯 Deployment Commands

### Vercel CLI
```bash
npm install -g vercel
cd client
vercel login
vercel
```

### Railway CLI
```bash
npm install -g @railway/cli
railway login
railway init
railway up
```

---

## 🔗 Post-Deployment

1. **Update API URLs** in frontend
2. **Test all features**:
   - Brand search
   - Sentiment analysis
   - Topic clustering
   - Live updates
3. **Monitor performance**
4. **Check logs** for errors

---

## 💡 Tips

- Use **Vercel** for frontend (best Next.js support)
- Use **Railway** for backend (easiest full-stack)
- Keep **AI models** in backend (too large for edge)
- Use **environment variables** for API keys
- Enable **caching** for better performance

---

## 🆘 Troubleshooting

### Build Fails
- Check Node version (16+)
- Verify all dependencies installed
- Check build logs

### Backend Timeout
- AI models take time to load
- Increase timeout in Railway settings
- Consider caching model results

### Out of Memory
- AI models use ~500MB RAM
- Upgrade Railway plan
- Or use smaller models

---

## 📊 Cost Estimate

### Free Tier (Good for Demo)
- Vercel: $0
- Railway: $0 (with $5 credit)
- **Total: FREE**

### Production (Recommended)
- Vercel: $0 (hobby)
- Railway: $5-10/month
- **Total: $5-10/month**

---

## 🎉 You're Ready!

Your PulseWatch dashboard is now live and accessible worldwide! 🌍

**Frontend URL**: https://your-app.vercel.app
**Backend URL**: https://your-app.railway.app

Share it with the world! 🚀
