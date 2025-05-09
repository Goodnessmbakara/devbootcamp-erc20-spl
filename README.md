# 🟢 ERC-20-for-SPL Mintable Token on Neon EVM Devnet

## 🛠 What I Did

1. Created a GitHub repository and cloned it locally.
2. Initialized a new Hardhat project using `npm init -y && npm install --save-dev hardhat`.
3. Copied the `ERC20ForSplFactory` contract from the [Neon EVM GitHub repository](https://github.com/neonlabsorg/neon-evm) into the `contracts/` folder.
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

## 📁 Project Structure

