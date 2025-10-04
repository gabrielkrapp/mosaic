# Mosaic100 - World App Advertising Grid

A mobile-first Next.js mini-app for advertising spots on World App.

## 🎯 Features

- **44 Strategic Ad Spots**
  - 4 Large banners (200px height, full-width)
  - 8 Medium banners (140px height, half-width)
  - 32 Small banners (100px height, quarter-width)
- **Affordable Pricing**
  - Small: **0.05 WLD/day**
  - Medium: **0.1 WLD/day**
  - Large: **0.5 WLD/day**
- **Duration**: 1-7 days per spot
- **World App Pay Integration**: MiniKit SDK for payments
- **Auto-Expiration**: Tiles revert to empty when time expires
- **No Backend**: All state in `localStorage`
- **Zero Empty Spaces**: Every row is 100% filled with banners

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- World App (for testing payments)

### Installation

```bash
npm install
```

### ⚠️ IMPORTANTE: Configurar Carteira WLD

Antes de deployar, você **DEVE** configurar sua carteira que receberá os pagamentos:

1. Crie o arquivo `.env.local` na raiz do projeto (se não existir)
2. Adicione sua carteira:

```env
NEXT_PUBLIC_MOSAIC100_WALLET=0xSuaCarteiraWLDAqui
```

**Exemplo:**
```env
NEXT_PUBLIC_MOSAIC100_WALLET=0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1
```

⚠️ **Sem isso, os pagamentos NÃO funcionarão!**

### Development

```bash
npm run dev
```

Abra no World App para testar o fluxo completo de pagamento.

### Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
/app
  /page.tsx          # Main grid view
  /layout.tsx        # Root layout with MiniKitProvider
  /globals.css       # Global styles
/components
  /Header.tsx        # App header
  /Tile.tsx          # Individual tile component
  /Grid.tsx          # Grid layout (zero gaps)
  /TileSheet.tsx     # Modal (purchase/view)
  /Toast.tsx         # Notifications
  /MiniKitProvider.tsx # MiniKit SDK wrapper
/lib
  /price.ts          # Pricing logic
  /time.ts           # Date/expiry helpers
  /storage.ts        # localStorage persistence
  /seed.ts           # Grid generation (44 banners)
  /worldpay.ts       # World App Pay integration
  /format.ts         # Text formatting utilities
/types
  /tile.ts           # TypeScript types
```

## 💰 Pricing

| Size   | Dimensions | Price/Day | Max Text | Total per Week |
|--------|------------|-----------|----------|----------------|
| Small  | 100px      | 0.05 WLD  | 8 chars  | 0.35 WLD       |
| Medium | 140px      | 0.1 WLD   | 14 chars | 0.7 WLD        |
| Large  | 200px      | 0.5 WLD   | 20 chars | 3.5 WLD        |

Total price = `base price × days`

## 🎨 Design

- **Clean & Modern**: Minimalist black & white design
- **Mobile-First**: Optimized for 360-430px width
- **Zero Gaps**: Every pixel filled with banners
- **Bordered**: Clear separation between tiles
- **Modal-Based**: Purchase and view in centered modals

## 🔧 Technical Details

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **Storage**: localStorage (no backend)
- **World App**: MiniKit SDK (`@worldcoin/minikit-js`)
- **Payment**: MiniKit Pay command with WLD tokens
- **Grid**: 4-column base, strategic layout for zero gaps

## 📊 Grid Layout (44 banners total)

```
┌─────────────────────────┐
│   [Large Banner 1]      │  ← Full width (4 cols)
├─────────────────────────┤
│[S]│[S]│[S]│[S]          │  ← 4 Small (1 col each)
├─────────────────────────┤
│ [Medium 1] │ [Medium 2] │  ← 2 Medium (2 cols each)
├─────────────────────────┤
│[S]│[S]│[S]│[S]          │
├─────────────────────────┤
│   [Large Banner 2]      │
├─────────────────────────┤
│ [Medium 3] │ [Medium 4] │
├─────────────────────────┤
│[S]│[S]│[S]│[S]          │
├─────────────────────────┤
│ [Medium 5] │ [Medium 6] │
├─────────────────────────┤
│[S]│[S]│[S]│[S]          │
├─────────────────────────┤
│   [Large Banner 3]      │
├─────────────────────────┤
│[S]│[S]│[S]│[S]          │
├─────────────────────────┤
│ [Medium 7] │ [Medium 8] │
├─────────────────────────┤
│[S]│[S]│[S]│[S]          │
├─────────────────────────┤
│   [Large Banner 4]      │
└─────────────────────────┘
```

Every row is **100% filled** - no empty spaces!

## 📝 Validation Rules

- Text length: S ≤ 8, M ≤ 14, L ≤ 20 characters
- Link format: Must start with `https://` or `worldapp://`
- Days: Integer 1-7
- Auto-trim whitespace

## 🚢 Deployment to Vercel

1. **Configure Wallet** (IMPORTANT!)
   ```bash
   # Create .env.local with your wallet
   NEXT_PUBLIC_MOSAIC100_WALLET=0xYourWallet
   ```

2. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Mosaic100 ready"
   git push
   ```

3. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import repository
   - Add environment variable:
     - Key: `NEXT_PUBLIC_MOSAIC100_WALLET`
     - Value: `0xYourWalletAddress`
   - Deploy!

## ⚠️ Important Notes

- **Wallet Configuration**: MUST set `NEXT_PUBLIC_MOSAIC100_WALLET` before deploying
- **World App Only**: Payment flow only works inside World App
- **localStorage**: Data is device-specific (no backend in MVP)
- **Auto-Expiration**: Runs client-side every 60 seconds

## 📄 License

MIT

---

Built with ❤️ for World App

**Need help?** Open an issue on GitHub
