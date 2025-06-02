# 🟢 Neon Dev Bootcamp - Week 4: SPL Token Program Library

## 📝 Week 4: SPL Token Program Library Implementation

### 🎯 What I Did

1. Created an enhanced ERC-20 token contract that implements SPL token functionality:
   - Implemented `EnhancedERC20ForSpl` contract extending `ERC20ForSplMintable`
   - Added mint authority management
   - Implemented account closing functionality
   - Added comprehensive token operations (mint, burn, transfer)

2. Created a test script (`scripts/splTokenExercise.js`) that demonstrates:
   - Token deployment and initialization
   - Token minting and transfers
   - Delegate approvals and claims
   - Token burning
   - Mint authority transfer
   - Account closing

### ✅ Implementation Details

- **Deployer Wallet:** `0x40a2Aa83271dd2F86e7C50C05b60bf3873bA4461`
- **Token Name:** `Exercise Token`
- **Symbol:** `EXT`
- **Decimals:** `9`
- **Mint Account:** `0xf653e02984348cb7a5403ef346cbd304d8e1c7602382951137e0900eb78a3d1d`

### 🔗 Explorer Links

- **Contract Deployment:** [View on Neonscan](https://devnet.neonscan.org/address/0x8Ed0A065F5A464BF5308441684B18707e5178A93)
- **Initial Mint Transaction:** [View on Neonscan](https://devnet.neonscan.org/tx/0x...)
- **Mint Authority Transfer:** [View on Neonscan](https://devnet.neonscan.org/tx/0x...)

### 📋 Key Features Implemented

1. **Token Creation and Initialization**
   - Created mint account with specified decimals
   - Initialized token with metadata

2. **Token Operations**
   - Minted 1000 tokens to deployer
   - Approved delegate for 100 tokens
   - Implemented token burning (50 tokens)
   - Transferred remaining tokens

3. **Authority Management**
   - Transferred mint authority to new account
   - Verified authority transfer
   - Successfully minted with new authority

4. **Account Management**
   - Implemented account closing functionality
   - Verified account closure after emptying

### 🚀 How to Run

1. Set up environment variables in `.env`:
```bash
PRIVATE_KEY_OWNER=your_owner_private_key_here
PRIVATE_KEY_DELEGATE=your_delegate_private_key_here
PRIVATE_KEY_AUTHORITY=your_authority_private_key_here
```

2. Run the exercise script:
```bash
npx hardhat run scripts/splTokenExercise.js --network neondevnet
```

---

# 🟢 Week 1: ERC-20-for-SPL Mintable Token on Neon EVM Devnet

## 🛠 What I Did

1. Created a GitHub repository and cloned it locally.
2. Initialized a new Hardhat project using `npm init -y && npm install --save-dev hardhat`.
3. Copied the `ERC20ForSplFactory` contract from the [Neon EVM GitHub repository](https://github.com/neonlabsorg/neon-evm/blob/4bcae0f476721e5396916c43396ec85e465f878f/evm_loader/solidity/erc20_for_spl_factory.sol) into the `contracts/` folder.
4. Also copied all required dependencies, including interfaces and precompile contracts, into the `contracts/` directory.
5. Wrote a deployment script (`scripts/deploy.js`) to deploy the factory contract.
6. Created a `.env` file and stored the Neon Devnet wallet private key.
7. Configured MetaMask to use the Neon Devnet RPC.
8. Updated `hardhat.config.js` with the Neon Devnet RPC and private key.
9. Ran the deployment script using `npx hardhat run scripts/deploy.js --network neondevnet`.

## ✅ Deployment Details

- **Deployer Wallet:** `0x40a2Aa83271dd2F86e7C50C05b60bf3873bA4461`
- **Token Name:** `DevBootcampToken1746833953692`
- **Symbol:** `DBT`
- **Decimals:** `9`

## 🔗 Explorer Links

- **Deployment Tx:** [View on Neonscan](https://devnet.neonscan.org/tx/0x4be8bed116951d68d75135e271d981790c312ea9a424b8612b897a46c2485ed4)
- **Contract Address:** [0xCf5745cc803F05b26772481ad6E849Ee85b1340f](https://devnet.neonscan.org/address/0xCf5745cc803F05b26772481ad6E849Ee85b1340f)

## 📁 Composability

### 1. Configuration

- Copied the `TestDevBootcamp.js` script from the repo.
- Included the `config.js` file after realizing that it was required for the script.
- Updated the `.env` file with the following keys:
  - `PRIVATE_KEY_SOLANA`: The private key for the Solana wallet.
  - `USER1_KEY`: A random dummy key for testing.

### 2. Script Execution

Ran the script using the following command:

```bash
npx hardhat run scripts/TestCallSolana/TestDevBootcamp.js --network neondevnet
``` 