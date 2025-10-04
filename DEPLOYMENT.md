# Mosaic100 - Deployment Guide

## 🚀 Deploy to Vercel

### Prerequisites
- GitHub account
- Vercel account (free tier works)
- Your WLD wallet address

### Steps

#### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit - Mosaic100 MVP"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/mosaic100.git
git push -u origin main
```

#### 2. Import to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New Project"**
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (leave as is)
   - **Build Command**: `npm run build` (auto)
   - **Output Directory**: `.next` (auto)

#### 3. Add Environment Variables

In the Vercel dashboard, before deploying:

1. Go to **Settings** → **Environment Variables**
2. Add:
   ```
   Key: NEXT_PUBLIC_MOSAIC100_WALLET
   Value: 0xYourActualWalletAddress
   ```
3. Select all environments (Production, Preview, Development)
4. Click **Save**

#### 4. Deploy

Click **Deploy** and wait ~2-3 minutes.

#### 5. Configure World App

1. Get your Vercel URL: `https://mosaic100-xxx.vercel.app`
2. Go to [World App Developer Portal](https://developer.worldcoin.org)
3. Create/update your mini-app:
   - **Name**: Mosaic100
   - **Description**: "100 text-only ad spots. From 0.1 WLD/day."
   - **URL**: Your Vercel URL
   - **Category**: Marketplace / Advertising
4. Submit for review (if needed)

---

## 🔄 Redeploy / Updates

Vercel auto-deploys on every push to `main`:

```bash
# Make changes
git add .
git commit -m "Update: description of changes"
git push
```

Vercel will build and deploy automatically in ~2-3 minutes.

---

## 🧪 Testing in World App

1. Open World App
2. Navigate to your mini-app (from Developer mode or public listing)
3. Test:
   - Grid renders correctly
   - Tap tiles (empty/occupied)
   - Purchase flow (World App Pay deeplink)
   - Confirm purchase
   - Verify ad appears
   - Wait for expiration (or change device time)
   - Verify auto-expiration works

---

## 🐛 Troubleshooting

### Build Fails on Vercel

**Error**: `NEXT_PUBLIC_MOSAIC100_WALLET is not defined`
- **Fix**: Add environment variable in Vercel dashboard

**Error**: `Module not found: @worldcoin/minikit-js`
- **Fix**: Ensure `package.json` has all dependencies
- Run locally: `npm install`

### World App Pay Not Working

**Error**: "deeplink not opening"
- **Fix**: Ensure you're testing **inside World App**, not mobile browser
- Verify wallet address is correct (no typos)

### Tiles Not Persisting

**Error**: "Ads disappear on reload"
- **Check**: localStorage is enabled
- **Check**: Browser is not in Private/Incognito mode
- **Note**: localStorage is per-device (no backend in MVP)

### Grid Layout Broken

**Error**: "Tiles overlapping"
- **Check**: seed.ts logic for Large/Medium placement
- **Check**: CSS Grid is supported (very old browsers)

---

## 📊 Analytics (Optional)

Add Vercel Analytics for free:

```bash
npm install @vercel/analytics
```

In `app/layout.tsx`:
```tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

---

## 🔐 Environment Variables Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `NEXT_PUBLIC_MOSAIC100_WALLET` | Yes | WLD receiving wallet | `0xABC...123` |

---

## 📝 Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Vercel project created
- [ ] Environment variable added (`NEXT_PUBLIC_MOSAIC100_WALLET`)
- [ ] Build succeeds on Vercel
- [ ] Vercel URL obtained
- [ ] World App Developer Portal configured
- [ ] Tested in World App
- [ ] Purchase flow works
- [ ] Ads persist correctly
- [ ] Auto-expiration works

---

## 🎯 Production Readiness

### ✅ What's Production-Ready (MVP)
- Mobile-first UI
- World App Pay integration
- Grid layout with 100 spots
- Text validation
- Auto-expiration
- localStorage persistence

### 🔮 What's Missing (Future)
- Backend database (tiles reset per device)
- Real leaderboard (global, not local)
- Analytics dashboard
- Refunds / disputes
- Admin panel
- User authentication (persistent wallet)

---

## 🆘 Support

For issues:
1. Check [Next.js docs](https://nextjs.org/docs)
2. Check [MiniKit docs](https://docs.worldcoin.org/minikit)
3. Open GitHub issue

---

**You're ready to ship!** 🚀

