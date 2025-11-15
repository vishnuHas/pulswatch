# Using Localhost Backend with Vercel Frontend

## 🏠 Setup Guide

### Your Current Configuration:
- **Frontend**: https://pulswatch.vercel.app (Vercel - Public)
- **Backend**: http://localhost:5000 (Your Computer - Private)

---

## ⚠️ Important Note:

**Vercel (cloud) CANNOT connect to localhost (your computer)**

You have 3 options:

---

## Option 1: Use ngrok (Recommended for Demos)

### What is ngrok?
- Creates a secure tunnel from internet to your localhost
- Gives you a public URL that forwards to localhost:5000
- Free tier available

### Steps:

1. **Install ngrok:**
```bash
npm install -g ngrok
```

2. **Start your backend:**
```bash
cd c:\p2\pulsewatch
npm run server
```

3. **In another terminal, expose it:**
```bash
ngrok http 5000
```

4. **Copy the ngrok URL** (looks like: `https://abc123.ngrok.io`)

5. **Update Vercel:**
   - Go to Vercel Dashboard → Settings → Environment Variables
   - Set `NEXT_PUBLIC_API_URL` = `https://abc123.ngrok.io`
   - Redeploy

### Pros:
- ✅ Free
- ✅ Easy to use
- ✅ Secure HTTPS
- ✅ Backend stays on your computer

### Cons:
- ⚠️ URL changes each time you restart ngrok (unless paid plan)
- ⚠️ Your computer must be running
- ⚠️ Need to update Vercel each time URL changes

---

## Option 2: Run Everything Locally (Development)

### Steps:

1. **Start backend:**
```bash
npm run server
```

2. **Start frontend:**
```bash
cd client
npm run dev
```

3. **Visit:** http://localhost:3000

### Pros:
- ✅ Completely private
- ✅ No external services needed
- ✅ Fast development

### Cons:
- ⚠️ Not accessible from internet
- ⚠️ Can't share with others

---

## Option 3: Deploy Backend Later (Current Setup)

### Current State:
- Frontend is live: https://pulswatch.vercel.app
- Backend is local: http://localhost:5000
- **They can't communicate** (cloud can't reach localhost)

### What Users See:
- ✅ Beautiful UI loads
- ❌ No data (API calls fail)
- ❌ Brand searches don't work

### Use Case:
- Good for showing UI/design
- Good for portfolio (visual only)
- Not functional for actual use

---

## 🎯 Recommended Approach:

### For Development:
**Use Option 2** - Run everything locally

### For Demos/Sharing:
**Use Option 1** - ngrok tunnel

### For Production:
**Deploy backend** to Render/Railway/Fly.io

---

## 🔧 Quick Commands:

### Local Development:
```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend
cd client
npm run dev

# Visit: http://localhost:3000
```

### With ngrok (for sharing):
```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - ngrok
ngrok http 5000

# Terminal 3 - Update Vercel with ngrok URL
# Then visit: https://pulswatch.vercel.app
```

---

## 📊 Comparison:

| Feature | Local Only | ngrok | Cloud Backend |
|---------|-----------|-------|---------------|
| Cost | Free | Free | $0-10/month |
| Speed | Fast | Medium | Fast |
| Sharing | No | Yes | Yes |
| Always On | No | No | Yes |
| Setup | Easy | Medium | Medium |

---

## 💡 My Recommendation:

**For your use case (portfolio/demo):**

1. Keep frontend on Vercel (free, always on)
2. Use ngrok when you want to demo
3. Run locally for development

**Commands:**
```bash
# When developing:
npm run server
cd client && npm run dev

# When demoing:
npm run server
ngrok http 5000
# Update Vercel with ngrok URL
```

This way:
- ✅ No monthly costs
- ✅ Backend stays private on your computer
- ✅ Can demo when needed
- ✅ Frontend always looks good
