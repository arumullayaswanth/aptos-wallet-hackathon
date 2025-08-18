# Research Data Timestamping DApp - React Frontend

A complete React TypeScript frontend for the Research Data Timestamping decentralized application on Aptos blockchain.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or pnpm
- Aptos CLI

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your contract address
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── Header.tsx       # Navigation and wallet connection
│   ├── Dashboard.tsx    # Main dashboard with statistics
│   ├── SubmitResearch.tsx # Research submission form
│   ├── VerifyRecords.tsx  # Record verification interface
│   └── WalletConnection.tsx # Wallet connection UI
├── hooks/              # Custom React hooks
│   ├── useWallet.ts    # Wallet management
│   ├── useContract.ts  # Smart contract interactions
│   └── useResearchData.ts # Research data management
├── utils/              # Utility functions
│   ├── aptos.ts        # Aptos blockchain service
│   ├── crypto.ts       # Cryptographic utilities
│   └── formatting.ts   # Data formatting helpers
└── types/              # TypeScript type definitions
    ├── index.ts        # Common types
    ├── aptos.ts        # Aptos-specific types
    └── research.ts     # Research domain types
```

## 🔧 Features

- **Modern React**: Built with React 18 and TypeScript
- **Aptos Integration**: Full integration with Aptos blockchain
- **Wallet Support**: Multiple Aptos wallet support
- **File Hashing**: Client-side cryptographic hashing
- **Responsive Design**: Mobile-friendly interface
- **Type Safety**: Complete TypeScript coverage

## 📦 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## 🔗 Integration

This frontend works with the Research Timestamping Move smart contract. Make sure to:

1. Deploy the smart contract to Aptos testnet
2. Update `VITE_MODULE_ADDRESS` in your `.env` file
3. Fund your wallet with testnet APT tokens

## 🎨 Customization

The interface uses a professional academic theme with:
- Clean blue and white color scheme
- Responsive grid layouts
- Smooth animations and transitions
- Accessible design patterns

## 🔒 Security

- Private keys never leave the user's wallet
- All transactions require user approval
- Client-side file hashing for privacy
- Secure environment variable handling

## 📚 Learn More

- [Aptos Documentation](https://aptos.dev)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

Built with ❤️ for the academic research community.