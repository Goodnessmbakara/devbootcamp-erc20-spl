require("dotenv").config();
const { ethers } = require("hardhat");
const web3 = require("@solana/web3.js");
const bs58 = require("bs58");
const {
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction
} = require("@solana/spl-token");
const { config } = require("./TestCallSolana/config");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deployer (EVM)   :", deployer.address);

  // 1) Deploy the mintable token
  const FACTORY = new ethers.Contract(
    "0xF6b17787154C418d5773Ea22Afc87A95CAA3e957",
    ["function createErc20ForSplMintable(string,string,uint8,address) returns (address)"],
    deployer
  );

  const name = "DevBootcampToken" + Date.now();
  const txCreate = await FACTORY.createErc20ForSplMintable(name, "DBT", 9, deployer.address);
  const receipt = await txCreate.wait();
  const tokenAddr = receipt.logs[0].address;
  console.log("Token deployed at:", tokenAddr);

  const Token = await ethers.getContractAt("ERC20ForSplMintable", tokenAddr);

  // 2) Mint 1000 tokens to yourself
  const amount = ethers.parseUnits("1000", 9);
  await (await Token.mint(deployer.address, amount)).wait();
  console.log(`Minted ${amount} tokens`);

  // 3) Deploy your composability helper
  const Helper = await ethers.getContractFactory("TestDevBootcamp");
  const helper = await Helper.deploy(tokenAddr);
  await helper.waitForDeployment();
  console.log("Helper deployed at:", helper.target);

  // 4) On Solana: set up Associated Token Accounts
  const connection = new web3.Connection(config.SOLANA_NODE, "processed");
  const solKeypair = web3.Keypair.fromSecretKey(bs58.decode(process.env.PRIVATE_KEY_SOLANA));
  const randomSolAcc = web3.Keypair.generate();

  const mintPubkey = new web3.PublicKey(ethers.encodeBase58(await Token.tokenMint()));
  const helperSolPK = new web3.PublicKey(await helper.getNeonAddress(helper.target));

  const senderATA = await getAssociatedTokenAddress(mintPubkey, helperSolPK, true);
  const recipientATA = await getAssociatedTokenAddress(mintPubkey, randomSolAcc.publicKey, true);

  const ataTx = new web3.Transaction().add(
    createAssociatedTokenAccountInstruction(solKeypair.publicKey, senderATA, helperSolPK, mintPubkey),
    createAssociatedTokenAccountInstruction(solKeypair.publicKey, recipientATA, randomSolAcc.publicKey, mintPubkey)
  );
  await web3.sendAndConfirmTransaction(connection, ataTx, [solKeypair]);
  console.log("Created ATAs:", senderATA.toBase58(), recipientATA.toBase58());

  // 5) Approve helper to transfer 10 tokens
  const tenTokens = ethers.parseUnits("10", 9);
  await (await Token.approve(helper.target, tenTokens)).wait();
  console.log("Approved helper for 10 tokens");

  // 6) Call the composability transfer (intermediate task)
  const txBridge = await helper.transfer(tenTokens, config.utils.publicKeyToBytes32(randomSolAcc.publicKey.toBase58()));
  const rBridge = await txBridge.wait();
  console.log("Composability transfer sent, tx hash:", rBridge.transactionHash);

  // 7) (Optional) Call your advanced SOL transfer function
  const solLamports = Math.floor(0.01 * web3.LAMPORTS_PER_SOL);
  const txSol = await helper.sendLamportsViaSolana(
    config.utils.publicKeyToBytes32(randomSolAcc.publicKey.toBase58()),
    solLamports
  );
  const rSol = await txSol.wait();
  console.log("Advanced SOL transfer sent, tx hash:", rSol.transactionHash);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
