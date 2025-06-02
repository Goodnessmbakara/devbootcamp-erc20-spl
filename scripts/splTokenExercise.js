const hre = require("hardhat");
const { ethers } = require("hardhat");

async function main() {
    // Get the network
    const network = await ethers.provider.getNetwork();
    console.log("Network:", network.name);

    // Get signers
    const [deployer] = await ethers.getSigners();
    if (!deployer) {
        throw new Error("No deployer account found. Please check your network configuration and private key.");
    }
    console.log("Deployer address:", deployer.address);

    // Create additional signers for testing
    const delegate = new ethers.Wallet(process.env.PRIVATE_KEY_DELEGATE || deployer.privateKey, ethers.provider);
    const newAuthority = new ethers.Wallet(process.env.PRIVATE_KEY_AUTHORITY || deployer.privateKey, ethers.provider);
    
    console.log("Delegate address:", delegate.address);
    console.log("New authority address:", newAuthority.address);

    // Deploy the enhanced token contract
    console.log("Deploying EnhancedERC20ForSpl contract...");
    const EnhancedERC20ForSpl = await ethers.getContractFactory("EnhancedERC20ForSpl");
    const token = await EnhancedERC20ForSpl.deploy(
        "Exercise Token",  // name
        "EXT",            // symbol
        9,                // decimals
        deployer.address  // mint authority
    );
    
    // Wait for deployment to complete
    await token.waitForDeployment();
    const tokenAddress = await token.getAddress();
    console.log("Token deployed to:", tokenAddress);

    // Get the mint account address
    const mintAccount = await token.findMintAccount();
    console.log("Mint account:", mintAccount);

    // Mint some tokens to the deployer
    const mintAmount = ethers.parseUnits("1000", 9); // 1000 tokens
    console.log("Minting", mintAmount.toString(), "tokens to deployer");
    const mintTx = await token.mint(deployer.address, mintAmount);
    await mintTx.wait();
    console.log("Mint transaction confirmed");

    // Check deployer's balance
    const deployerBalance = await token.balanceOf(deployer.address);
    console.log("Deployer balance:", ethers.formatUnits(deployerBalance, 9));

    // Approve delegate to spend tokens
    const approveAmount = ethers.parseUnits("100", 9); // 100 tokens
    console.log("Approving delegate to spend", approveAmount.toString(), "tokens");
    const approveTx = await token.approve(delegate.address, approveAmount);
    await approveTx.wait();
    console.log("Approve transaction confirmed");

    // Delegate claims tokens
    console.log("Delegate claiming tokens");
    const transferFromTx = await token.connect(delegate).transferFrom(deployer.address, delegate.address, approveAmount);
    await transferFromTx.wait();
    console.log("TransferFrom transaction confirmed");

    // Check delegate's balance
    const delegateBalance = await token.balanceOf(delegate.address);
    console.log("Delegate balance:", ethers.formatUnits(delegateBalance, 9));

    // Burn some tokens from delegate
    const burnAmount = ethers.parseUnits("50", 9); // 50 tokens
    console.log("Burning", burnAmount.toString(), "tokens from delegate");
    const burnTx = await token.connect(delegate).burn(burnAmount);
    await burnTx.wait();
    console.log("Burn transaction confirmed");

    // Check delegate's balance after burn
    const delegateBalanceAfterBurn = await token.balanceOf(delegate.address);
    console.log("Delegate balance after burn:", ethers.formatUnits(delegateBalanceAfterBurn, 9));

    // Transfer remaining tokens back to deployer
    const remainingAmount = delegateBalanceAfterBurn;
    console.log("Transferring remaining", ethers.formatUnits(remainingAmount, 9), "tokens back to deployer");
    const transferTx = await token.connect(delegate).transfer(deployer.address, remainingAmount);
    await transferTx.wait();
    console.log("Transfer transaction confirmed");

    // Check final balances
    const finalDeployerBalance = await token.balanceOf(deployer.address);
    const finalDelegateBalance = await token.balanceOf(delegate.address);
    console.log("Final deployer balance:", ethers.formatUnits(finalDeployerBalance, 9));
    console.log("Final delegate balance:", ethers.formatUnits(finalDelegateBalance, 9));

    // Transfer mint authority to new authority
    console.log("Transferring mint authority to new authority");
    const transferAuthorityTx = await token.transferMintAuthority(newAuthority.address);
    await transferAuthorityTx.wait();
    console.log("Mint authority transfer confirmed");
    
    // Verify mint authority transfer
    const currentMintAuthority = await token.mintAuthority();
    console.log("Current mint authority:", currentMintAuthority);
    console.log("Expected mint authority:", newAuthority.address);

    // Try to mint with new authority
    console.log("Attempting to mint with new authority");
    const newMintTx = await token.connect(newAuthority).mint(deployer.address, ethers.parseUnits("100", 9));
    await newMintTx.wait();
    console.log("Mint with new authority successful");

    // Close delegate's account (after ensuring it's empty)
    console.log("Closing delegate's account");
    const closeAccountTx = await token.connect(delegate).closeAccount();
    await closeAccountTx.wait();
    console.log("Delegate's account closed successfully");

    console.log("Exercise completed successfully!");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    }); 