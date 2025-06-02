const { ethers } = require("hardhat");
const web3 = require("@solana/web3.js");
const bs58 = require("bs58");
const {
    getAssociatedTokenAddress,
    createAssociatedTokenAccountInstruction,
    SystemProgram,
    LAMPORTS_PER_SOL
} = require('@solana/web3.js');
const {
    getAssociatedTokenAddress: getTokenATA,
    createAssociatedTokenAccountInstruction: createTokenATAInstruction
} = require('@solana/spl-token');
const { config } = require('./config');

async function main() {
    const SOLANA_NODE = config.SOLANA_NODE;
    const DEVNET_ERC20ForSPL_FACTORY = "0xF6b17787154C418d5773Ea22Afc87A95CAA3e957";
    let solanaTx;
    let tx;

    const connection = new web3.Connection(SOLANA_NODE, "processed");
    const keypair = web3.Keypair.fromSecretKey(
        bs58.decode(process.env.PRIVATE_KEY_SOLANA)
    );
    const [user1] = await ethers.getSigners();

    const ERC20ForSplFactoryContract = await ethers.getContractFactory("ERC20ForSplFactory");
    const ERC20ForSplMintableContract = await ethers.getContractFactory("ERC20ForSplMintable");
    const ERC20ForSplFactory = ERC20ForSplFactoryContract.attach(DEVNET_ERC20ForSPL_FACTORY);

    // Deploy ERC20ForSplMintable contract
    tx = await ERC20ForSplFactory.createErc20ForSplMintable(
        "devBOOTCAMP TOKEN " + Date.now().toString(),
        "DBT",
        9,
        user1.address
    );
    await tx.wait(1);

    const ERC20ForSPLMintableAddress = await ERC20ForSplFactory.allErc20ForSpl(
        parseInt((await ERC20ForSplFactory.allErc20ForSplLength()).toString()) - 1
    );
    const ERC20ForSplMintable = ERC20ForSplMintableContract.attach(ERC20ForSPLMintableAddress);
    console.log(ERC20ForSplMintable.target, 'ERC20ForSPLMintableAddress');
    const tokenMint = await ERC20ForSplMintable.tokenMint();
    console.log(tokenMint, 'tokenMint');

    // mint 1000 tokens to user
    tx = await ERC20ForSplMintable.mint(user1.address, 1000 * 10 ** 9);
    await tx.wait(1);

    // deploy TestDevBootcamp contract
    const TestDevBootcamp = await ethers.deployContract("TestDevBootcamp", [ERC20ForSplMintable.target]);
    await TestDevBootcamp.waitForDeployment();
    console.log(`TestDevBootcamp deployed to ${TestDevBootcamp.target}`);

    const contractPublicKey = ethers.encodeBase58(await TestDevBootcamp.getNeonAddress(TestDevBootcamp.target));
    console.log(contractPublicKey, 'contractPublicKey');

    // setup sender & receiver ATA's with solana web3
    const randomSolanaAccount = web3.Keypair.generate();

    const senderATA = await getTokenATA(
        new web3.PublicKey(ethers.encodeBase58(tokenMint)),
        new web3.PublicKey(contractPublicKey),
        true
    );
    console.log(senderATA, 'senderATA');

    const recipientATA = await getTokenATA(
        new web3.PublicKey(ethers.encodeBase58(tokenMint)),
        new web3.PublicKey(randomSolanaAccount.publicKey.toBase58()),
        true
    );
    console.log(recipientATA, 'recipientATA');

    solanaTx = new web3.Transaction();
    solanaTx.add(
        createTokenATAInstruction(
            keypair.publicKey,
            senderATA,
            new web3.PublicKey(contractPublicKey),
            new web3.PublicKey(ethers.encodeBase58(tokenMint))
        ),
        createTokenATAInstruction(
            keypair.publicKey,
            recipientATA,
            new web3.PublicKey(randomSolanaAccount.publicKey.toBase58()),
            new web3.PublicKey(ethers.encodeBase58(tokenMint))
        )
    );
    const signature = await web3.sendAndConfirmTransaction(
        connection,
        solanaTx,
        [keypair]
    );
    console.log(signature, 'transaction sender & recipient ATA\'s creation');

    // make the token approval so the contract can handle the user's token deposit
    const amount = 10 * 10 ** 9; // 10 tokens
    tx = await ERC20ForSplMintable.approve(TestDevBootcamp.target, amount);
    await tx.wait(1);
    console.log(tx, 'erc20forspl approve');

    // perform the deposit with the transfer through a composability request
    tx = await TestDevBootcamp.transfer(
        amount,
        config.utils.publicKeyToBytes32(randomSolanaAccount.publicKey.toBase58())
    );
    await tx.wait(1);
    console.log(tx, 'TestDevBootcamp transfer');

    // ADVANCED TASK: Custom Solana composability via ICallSolana - Transfer 0.01 SOL
    const solanaRecipient = randomSolanaAccount.publicKey;
    const lamports = 0.01 * LAMPORTS_PER_SOL;
    const solRecipientBytes32 = config.utils.publicKeyToBytes32(solanaRecipient.toBase58());

    tx = await TestDevBootcamp.sendLamportsViaSolana(
        solRecipientBytes32,
        lamports.toString()
    );
    await tx.wait(1);
    console.log('Advanced composability: Sent 0.01 SOL to Solana address via Neon');
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
