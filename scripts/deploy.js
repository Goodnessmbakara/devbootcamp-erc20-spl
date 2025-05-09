const { ethers } = require("hardhat");

const FACTORY_ADDRESS = "0xF6b17787154C418d5773Ea22Afc87A95CAA3e957"; // Neon devnet factory

const FACTORY_ABI = [
  "function createErc20ForSplMintable(string,string,uint8,address) returns (address)"
];

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying from:", deployer.address);

  const factory = new ethers.Contract(FACTORY_ADDRESS, FACTORY_ABI, deployer);

  const name = "DevBootcampToken" + Date.now(); // ensure uniqueness
  const symbol = "DBT";
  const decimals = 9;
  const mintAuthority = deployer.address;

  console.log("Creating ERC20-for-SPL-Mintable with:", name, symbol, decimals, mintAuthority);

  const tx = await factory.createErc20ForSplMintable(name, symbol, decimals, mintAuthority);
  const receipt = await tx.wait();

  console.log("Deployment successful!");
  console.log("Tx Hash:", tx.hash);
  console.log("Contract address:", receipt.logs[0].address);
}

main().catch((error) => {
  console.error("Error during deployment:", error);
  process.exit(1);
});
