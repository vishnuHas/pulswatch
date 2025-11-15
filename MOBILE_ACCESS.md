# 📱 Mobile Device Access Guide

## 🎯 Quick Setup

### Step 1: Start Backend Server
```bash
npm run server
```

You'll see output like:
```
╔════════════════════════════════════════════════════════════╗
║              🔵 PulseWatch Server Running                 ║
║                                                            ║
║  Local:      http://localhost:5000                        ║
║  Network:    http://10.235.3.186:5000                     ║ ← Use this!
║  WebSocket:  ws://10.235.3.186:5000                       ║
║  Health:     http://10.235.3.186:5000/api/health          ║
║                                                            ║
║  📱 Mobile Access: Use Network URL above                  ║
╚════════════════════════════════════════════════════════════╝
```

### Step 2: Update Vercel Environment Variable

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your **pulswatch** project
3. Go to **Settings** → **Environment Variables**
4. Update `NEXT_PUBLIC_API_URL` to your **Network URL**:
   ```
   NEXT_PUBLIC_API_URL = http://10.235.3.186:5000
   ```
5. Click **Save**
6. Go to **Deployments** → **Redeploy**

### Step 3: Access from Mobile

**Make sure:**
- ✅ Mobile is on the **same Wi-Fi** as your computer
- ✅ Backend server is **running**
- ✅ Vercel has been **redeployed** with new URL

**Then visit:**
- https://pulswatch.vercel.app

---

## 🔧 Alternative: Run Frontend Locally on Mobile

### Option A: Access via IP
```bash
# On your computer
cd client
npm run dev -- -H 0.0.0.0
```

Then on mobile, visit:
```
http://10.235.3.186:3000
```

### Option B: Use ngrok (Best for external access)
```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - ngrok for backend
ngrok http 5000

# Terminal 3 - ngrok for frontend (optional)
cd client
npm run dev
# In another terminal:
ngrok http 3000
```

---

## ⚠️ Important Notes

### Your Computer's IP May Change
- IP address changes when you reconnect to Wi-Fi
- Check the server output for current IP
- Update Vercel when IP changes

### Firewall Settings
If mobile can't connect:

**Windows Firewall:**
1. Open Windows Defender Firewall
2. Click "Allow an app through firewall"
3. Find Node.js
4. Check both Private and Public
5. Click OK

**Or temporarily disable:**
```powershell
# Run as Administrator
netsh advfirewall set allprofiles state off
```

---

## 🎯 Quick Troubleshooting

### Mobile shows "Network Error"
- ✅ Check: Same Wi-Fi network?
- ✅ Check: Server running?
- ✅ Check: Correct IP in Vercel?
- ✅ Check: Firewall allows Node.js?

### IP Address Changed
1. Restart server
2. Note new IP from console
3. Update Vercel environment variable
4. Redeploy

### Still Not Working?
Use ngrok (always works):
```bash
npm run server
ngrok http 5000
# Update Vercel with ngrok URL
```

---

## 📊 Network URLs by Device

| Device | URL |
|--------|-----|
| Your PC | http://localhost:5000 |
| Same Network | http://10.235.3.186:5000 |
| External (ngrok) | https://abc123.ngrok.io |

---

## 🚀 Best Practice

**For Development:**
- Use local IP (10.235.3.186:5000)
- Fast and free

**For Sharing/Demo:**
- Use ngrok
- Works from anywhere
- Stable HTTPS URL

**For Production:**
- Deploy backend to cloud
- Always available
- No IP changes
