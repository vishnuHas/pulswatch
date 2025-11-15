# 🌐 ngrok Setup Guide (Recommended)

## 🎯 Why ngrok?

### ✅ Advantages:
- **Works from anywhere** - Not limited to same Wi-Fi
- **No IP changes** - Stable during session
- **HTTPS included** - Secure connection
- **No firewall issues** - Tunnel through everything
- **Easy setup** - One command
- **Mobile friendly** - Works on any device, any network

### ❌ Only Limitation:
- Free tier: URL changes when you restart ngrok
- Solution: Paid plan ($8/month) for permanent URL

---

## 🚀 Quick Start

### Method 1: One-Click (Easiest)

**Double-click**: `start-with-ngrok.bat`

This will:
1. Start your backend server
2. Start ngrok tunnel
3. Show you the public URL

### Method 2: Manual

**Terminal 1 - Backend:**
```bash
npm run server
```

**Terminal 2 - ngrok:**
```bash
ngrok http 5000
```

---

## 📋 Step-by-Step Setup

### 1. Install ngrok

```bash
npm install -g ngrok
```

Or download from: https://ngrok.com/download

### 2. Sign up (Optional but Recommended)

1. Go to https://ngrok.com/signup
2. Sign up (free)
3. Get your auth token
4. Run:
```bash
ngrok config add-authtoken YOUR_TOKEN_HERE
```

**Benefits of signing up:**
- Longer session times
- More connections
- Better performance

### 3. Start Everything

**Option A: Use the script**
```bash
start-with-ngrok.bat
```

**Option B: Manual**
```bash
# Terminal 1
npm run server

# Terminal 2
ngrok http 5000
```

### 4. Copy ngrok URL

You'll see:
```
ngrok

Session Status                online
Account                       your@email.com (Plan: Free)
Version                       3.x.x
Region                        United States (us)
Latency                       -
Web Interface                 http://127.0.0.1:4040
Forwarding                    https://abc123.ngrok.io -> http://localhost:5000

Connections                   ttl     opn     rt1     rt5     p50     p90
                              0       0       0.00    0.00    0.00    0.00
```

**Copy this URL**: `https://abc123.ngrok.io`

### 5. Update Vercel

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select **pulswatch** project
3. **Settings** → **Environment Variables**
4. Update `NEXT_PUBLIC_API_URL`:
   ```
   https://abc123.ngrok.io
   ```
5. Click **Save**
6. **Deployments** → **Redeploy**

### 6. Access Your App

**From anywhere:**
- https://pulswatch.vercel.app

**Works on:**
- ✅ Your laptop
- ✅ Your phone (any network)
- ✅ Friend's phone
- ✅ Anywhere in the world!

---

## 🎯 Daily Workflow

### Every Time You Start:

1. **Run**: `start-with-ngrok.bat`
2. **Copy** the ngrok URL
3. **Update** Vercel (if URL changed)
4. **Done!**

### If URL Changed:
- Update Vercel environment variable
- Redeploy
- Takes 2 minutes

---

## 💡 Pro Tips

### 1. Keep ngrok Running

Don't close the ngrok window! Keep it running while:
- Developing
- Demoing
- Testing on mobile

### 2. ngrok Web Interface

Visit: http://localhost:4040

See:
- All requests
- Response times
- Errors
- Traffic

### 3. Custom Subdomain (Paid)

With paid plan ($8/month):
```bash
ngrok http 5000 --subdomain=pulsewatch
```

URL becomes: `https://pulsewatch.ngrok.io` (never changes!)

### 4. Multiple Tunnels

Start multiple services:
```bash
# Backend
ngrok http 5000

# Frontend (if needed)
ngrok http 3000
```

---

## 🆚 Comparison

| Feature | Static IP | ngrok Free | ngrok Paid |
|---------|-----------|------------|------------|
| **Cost** | Free | Free | $8/month |
| **Setup** | Complex | Easy | Easy |
| **URL Changes** | Every network | Every restart | Never |
| **Works Anywhere** | ❌ | ✅ | ✅ |
| **HTTPS** | ❌ | ✅ | ✅ |
| **Firewall Issues** | ⚠️ | ✅ | ✅ |
| **Update Vercel** | Every network | Every restart | Once |

---

## 🔧 Troubleshooting

### ngrok command not found
```bash
npm install -g ngrok
```

### Tunnel not working
1. Check backend is running
2. Check port 5000 is correct
3. Restart ngrok

### Vercel shows old data
1. Clear browser cache
2. Check Vercel environment variable
3. Redeploy Vercel

### Mobile can't connect
1. Check ngrok is running
2. Check Vercel has correct URL
3. Check Vercel was redeployed

---

## 📊 Free vs Paid

### Free Plan (Good for Development):
- ✅ Unlimited tunnels
- ✅ HTTPS
- ✅ 40 connections/minute
- ⚠️ URL changes on restart
- ⚠️ Session timeout after 2 hours

### Paid Plan ($8/month):
- ✅ Everything in free
- ✅ **Custom subdomain** (URL never changes!)
- ✅ No session timeout
- ✅ More connections
- ✅ Better performance

**Recommendation**: Start with free, upgrade if you use it daily

---

## 🎯 Best Practice

### For Development:
**Use ngrok free** - Perfect for testing

### For Demo/Portfolio:
**Use ngrok paid** - Professional, stable URL

### For Production:
**Deploy backend** to Render/Railway - Always available

---

## 🚀 Quick Commands

```bash
# Install
npm install -g ngrok

# Start backend
npm run server

# Start ngrok
ngrok http 5000

# With auth token
ngrok config add-authtoken YOUR_TOKEN

# Custom subdomain (paid)
ngrok http 5000 --subdomain=pulsewatch
```

---

## 📱 Mobile Access Flow

```
1. Start: start-with-ngrok.bat
   ↓
2. Copy: https://abc123.ngrok.io
   ↓
3. Update Vercel environment variable
   ↓
4. Redeploy Vercel
   ↓
5. Visit: https://pulswatch.vercel.app
   ↓
6. Works on any device! ✅
```

---

## 💰 Cost Analysis

### Free Setup:
- Vercel: $0
- ngrok: $0
- **Total: FREE**

### Professional Setup:
- Vercel: $0 (hobby)
- ngrok: $8/month
- **Total: $8/month**

### Full Production:
- Vercel: $0
- Backend (Render): $7/month
- **Total: $7/month**

---

## ✅ Recommendation

**For your use case (portfolio + mobile access):**

1. **Use ngrok free** for now
2. **Upgrade to paid** if you demo frequently
3. **Deploy backend** when ready for production

**Why ngrok is better than static IP:**
- ✅ No network change issues
- ✅ Works from anywhere
- ✅ Professional HTTPS
- ✅ Easy to use
- ✅ No firewall problems

---

## 🎉 You're Ready!

**Start now:**
```bash
start-with-ngrok.bat
```

**Your app will be accessible worldwide!** 🌍✨
