# 🌐 Network Setup Guide - Static IP Configuration

## 🎯 Problem Solved

Your IP address changes when you switch networks. This guide helps you:
- ✅ Set a static IP in configuration
- ✅ Easily update IP when network changes
- ✅ Keep mobile access working

---

## 📁 Configuration File

**File**: `server-config.json`

```json
{
  "host": "0.0.0.0",
  "port": 5000,
  "staticIP": "10.235.3.186",
  "note": "Update when network changes"
}
```

---

## 🚀 Quick Update (When Network Changes)

### Method 1: Automatic (Recommended)

**Double-click**: `update-ip.bat`

This will:
1. Detect your current IP
2. Update `server-config.json`
3. Show you the new IP
4. Remind you to update Vercel

### Method 2: Manual

1. **Find your IP:**
```bash
ipconfig
```

Look for "IPv4 Address" under your Wi-Fi adapter

2. **Edit `server-config.json`:**
```json
{
  "staticIP": "YOUR_NEW_IP_HERE"
}
```

3. **Restart server:**
```bash
npm run server
```

---

## 📱 Complete Mobile Setup

### Step 1: Update IP (when network changes)
```bash
# Run this script
update-ip.bat
```

### Step 2: Start Server
```bash
npm run server
```

You'll see:
```
╔════════════════════════════════════════════════════════════╗
║              🔵 PulseWatch Server Running                 ║
║                                                            ║
║  Network:    http://10.235.3.186:5000                     ║
║  ⚙️  Using static IP from server-config.json             ║
║  💡 To update IP: Edit server-config.json                 ║
╚════════════════════════════════════════════════════════════╝
```

### Step 3: Update Vercel

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select **pulswatch** project
3. **Settings** → **Environment Variables**
4. Update `NEXT_PUBLIC_API_URL`:
   ```
   http://10.235.3.186:5000
   ```
5. **Redeploy**

### Step 4: Access from Mobile

Visit: https://pulswatch.vercel.app

---

## ⚠️ IP Change Detection

The server will warn you if your IP changed:

```
⚠️  Network IP changed! Detected: 192.168.1.100
   Update server-config.json with new IP
```

When you see this:
1. Run `update-ip.bat`
2. Restart server
3. Update Vercel

---

## 🔧 Different Network Scenarios

### Home Wi-Fi
```json
{
  "staticIP": "192.168.1.100"
}
```

### Office Wi-Fi
```json
{
  "staticIP": "10.0.0.50"
}
```

### Mobile Hotspot
```json
{
  "staticIP": "192.168.43.1"
}
```

**Tip**: Keep a note of IPs for different networks!

---

## 💡 Pro Tips

### 1. Multiple Network Profiles

Create different config files:
- `server-config-home.json`
- `server-config-office.json`
- `server-config-mobile.json`

Copy the one you need to `server-config.json`

### 2. Quick Switch Script

Create `switch-network.bat`:
```batch
@echo off
echo Select Network:
echo 1. Home
echo 2. Office
echo 3. Mobile Hotspot
set /p choice="Enter choice: "

if "%choice%"=="1" copy server-config-home.json server-config.json
if "%choice%"=="2" copy server-config-office.json server-config.json
if "%choice%"=="3" copy server-config-mobile.json server-config.json

echo Network switched! Restart server.
pause
```

### 3. Vercel Environment Variables

Keep multiple environment variables in Vercel:
- `NEXT_PUBLIC_API_URL_HOME`
- `NEXT_PUBLIC_API_URL_OFFICE`
- `NEXT_PUBLIC_API_URL`

Switch the main one when needed.

---

## 🎯 Workflow Summary

```
Network Changed
    ↓
Run update-ip.bat
    ↓
Restart Server
    ↓
Update Vercel
    ↓
Redeploy
    ↓
Mobile Access Works! ✅
```

---

## 📊 Comparison

| Method | Pros | Cons |
|--------|------|------|
| **Static IP Config** | ✅ Easy to update<br>✅ One file to edit<br>✅ Works offline | ⚠️ Manual update needed<br>⚠️ Must update Vercel |
| **Auto-detect** | ✅ Automatic<br>✅ No config needed | ⚠️ Changes frequently<br>⚠️ Unreliable |
| **ngrok** | ✅ Always works<br>✅ No IP changes | ⚠️ URL changes<br>⚠️ Free tier limits |

---

## 🆘 Troubleshooting

### Server shows wrong IP
```bash
# Run update script
update-ip.bat
```

### Mobile can't connect
1. Check: Same Wi-Fi network?
2. Check: Correct IP in Vercel?
3. Check: Server running?
4. Check: Firewall allows Node.js?

### Forgot to update Vercel
Mobile will show "Network Error"
→ Update Vercel environment variable
→ Redeploy

---

## 🚀 Best Practice

**Daily Workflow:**
1. Start server: `npm run server`
2. Check IP in console
3. If changed: Run `update-ip.bat`
4. Update Vercel (if needed)

**Keep handy:**
- `update-ip.bat` on desktop
- Vercel dashboard bookmarked
- This guide open

---

## 📝 Quick Reference

```bash
# Find IP
ipconfig

# Update IP
update-ip.bat

# Start server
npm run server

# Vercel URL
https://vercel.com/dashboard
```

**Mobile URL**: https://pulswatch.vercel.app
**Backend URL**: http://[YOUR-IP]:5000
