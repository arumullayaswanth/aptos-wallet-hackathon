

# 🐸aptos-wallet
_A complete DeFi application that generates meme coins on the Aptos blockchain with automated tokenomics, one-click smart contract deployment, and a modern web interface._

![Hero Image – Meme Coin Generator UI](./docs/hero.png)

<p align="center">
  <a href="https://aptos.dev">Aptos</a> •
  <a href="https://move-language.github.io/move/">Move</a> •
  <a href="https://react.dev/">React</a> •
  <a href="https://www.typescriptlang.org/">TypeScript</a> •
  <a href="https://tailwindcss.com/">Tailwind</a>
</p>

<p align="center">
  <img alt="license" src="https://img.shields.io/badge/License-MIT-success">
  <img alt="status" src="https://img.shields.io/badge/Status-Active-brightgreen">
  <img alt="network" src="https://img.shields.io/badge/Network-Devnet-blue">
</p>

---

## ✨ Features
- **🎯 Meme Coin Generation:** Enter a name/symbol and get a ready-to-deploy meme coin.
- **📊 Automated Tokenomics:** Balanced defaults for supply & allocations with safe caps.
- **🔐 Secure Smart Contracts:** Built in **Move** and vetted for common pitfalls.
- **🎨 Modern UI/UX:** Beautiful **React + Tailwind** frontend with animations.
- **⚡ Fast & Scalable:** Leverages **Aptos** performance and parallel execution.
- **🔗 Wallet Integration:** Connect with Aptos wallets (Petra, Fewcha, etc.).
- **🧰 Scripts:** Deploy, verify, mint, and airdrop helpers.

---

## 🔗 Contract
- **Contract Address:** `0x7f5b3e16e8e3cea1f9c712abfcd321a0f5678146762054b5cb29961dc187d284`  
- **Transaction Hash:** `0xf79fb93cffa79d9f89debbce59671610f215d1779912ac1316c6a57adf20e49b`  
- **Network:** Devnet  
- **Gas Used:** 4,132 Octas  
- **Status:** ✅ Successfully executed  
- **Explorer:** https://explorer.aptoslabs.com/txn/0xf79fb93cffa79d9f89debbce59671610f215d1779912ac1316c6a57adf20e49b?network=devnet

> ℹ️ Devnet resets periodically. If the explorer link is stale, re-deploy and update this section.


## 🏗️ Architecture
**Backend:** Move smart contracts on Aptos  
**Frontend:** React + TypeScript + Tailwind CSS  
**Blockchain:** Aptos (Devnet/Testnet/Mainnet)  
**Tooling:** Aptos CLI • Move package manager • Node.js scripts

```text
┌───────────────┐         tx/scripts         ┌──────────────────┐
│   Frontend    │  ───────────────────────▶  │  Aptos Fullnode  │
│ React+Tailwind│  ◀───────────────────────  │   (Dev/Test/Main)│
└───────┬───────┘     account/resources      └────────┬─────────┘
        │                                            events
        │ wallet API
        ▼
┌─────────────────────┐
│  Wallet Adapter     │
└─────────┬───────────┘
          │ sign/submit
          ▼
┌─────────────────────┐
│   Move Contracts    │
│ MemeCoinGenerator   │
│ MemeCoin            │
│ Tokenomics          │
└─────────────────────┘
````

---

## 🚀 Quick Start

### Prerequisites

* Node.js **18+**
* **Aptos CLI**
* Move toolchain (installed with Aptos CLI)

### Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo>
   cd apt-full
   ```

2. **Install dependencies**

   ```bash
   # Frontend
   cd frontend
   npm install

   # Backend (Move contracts)
   cd ../move
   aptos init
   ```

3. **Configure Aptos**

   ```bash
   aptos init --profile default --network devnet
   ```

4. **Deploy contracts**

   ```bash
   cd move
   aptos move publish --named-addresses meme_coin_generator=default
   ```

5. **Start frontend**

   ```bash
   cd ../frontend
   npm run dev
   ```

---

## 📁 Project Structure

```text
apt-full/
├── move/                    # Move smart contracts
│   ├── sources/            # Contract source files
│   ├── Move.toml           # Package configuration
│   └── tests/              # Contract tests
├── frontend/               # React frontend
│   ├── src/                # Source code
│   ├── public/             # Static assets
│   └── package.json        # Dependencies
├── scripts/                # Deployment/ops scripts
└── README.md               # This file
```

---

## 🔧 Smart Contracts

### Core Modules

* **`MemeCoinGenerator`** – Orchestrates coin creation, metadata, ownership.
* **`MemeCoin`** – Template/implementation for generated meme coins (supply, mint).
* **`Tokenomics`** – Calculates distributions (treasury, team, liquidity, airdrop).

### Key Entry Functions

* `generate_meme_coin(name, symbol, description)`
* `set_tokenomics(total_supply, distribution)`
* `mint_initial_tokens(recipient)`

> ✅ All state-changing functions are `entry` and gated to authorized signers; read-only via `view`.

---

## 🎨 Frontend Features

* **Responsive** design (mobile → desktop)
* **Wallet connection** with Aptos wallet adapters
* **Real-time updates** via on-chain polling
* **Notifications & error states** for failed txs
* **Modern design** with Tailwind & subtle motion

---

## 🧪 Testing

**Contracts**

```bash
cd move
aptos move test
```

**Frontend**

```bash
cd frontend
npm test
```

---

## 🚢 Deployment

**Devnet/Testnet**

```bash
aptos move publish --named-addresses meme_coin_generator=default --network devnet
aptos move publish --named-addresses meme_coin_generator=default --network testnet
```

**Mainnet**

```bash
aptos move publish --named-addresses meme_coin_generator=default --network mainnet
```

> After publishing, update **Contract** section (address, hash, network, status).

---

## ⚙️ Environment

Create `frontend/.env`:

```ini
VITE_APTOS_NODE_URL=https://fullnode.devnet.aptoslabs.com/v1
VITE_APTOS_FAUCET_URL=https://faucet.devnet.aptoslabs.com
VITE_MODULE_ADDRESS=0x7f5b3e16e8e3cea1f9c712abfcd321a0f5678146762054b5cb29961dc187d284
```

Optional script env (`scripts/.env`):

```ini
APTOS_PROFILE=default
NETWORK=devnet
```

---

## 🛡️ Security Notes

* Use **named addresses** and avoid hard-coding operator keys.
* Prefer **capability** patterns for mint/burn.
* Enforce **supply caps** and **reentrancy guards** where relevant.
* Run `aptos move test` with property tests before mainnet.
* Consider external review for tokenomics math.

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch
3. Commit with conventional messages
4. Push & open a PR

---

## 📚 Documentation

* **Aptos Move Book** – language & stdlib concepts
* **Aptos SDK** – JS/TS client & wallet integration
* **Move Language** – specs, modules, best practices

---

## 🧰 Scripts (suggested)

* `scripts/deploy.ts` – publish package
* `scripts/mint.ts` – mint initial supply
* `scripts/airdrop.ts` – batch transfer to recipients
* `scripts/verify.ts` – helper to verify modules on explorer (where supported)

---

## 🆘 Support

* Open an **issue** for bugs/requests
* Join our **Discord** community
* Check the docs/FAQ in `/docs`

---

## 📄 License

MIT License — see `LICENSE` for details.

---

## 📈 Repo Stats

* **Stars:** 0
* **Watchers:** 0
* **Forks:** 0
* **Releases:** none
* **Packages:** none
* **Languages:** Move (96.8%), TypeScript (2.8%), Other (0.4%)

---

## 🧾 Footer

© 2025 GitHub — Built with ❤️ on the Aptos Blockchain

```
```
