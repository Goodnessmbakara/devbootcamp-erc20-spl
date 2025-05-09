require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: "0.8.26",
    defaultNetwork: "neondevnet",
    etherscan: {
        apiKey: {
            neonevm: "test"
        },
        customChains: [
            {
                network: "neonevm",
                chainId: 245022926,
                urls: {
                    apiURL: "https://devnet-api.neonscan.org/hardhat/verify",
                    browserURL: "https://devnet.neonscan.org"
                }
            },
            {
                network: "neonevm",
                chainId: 245022934,
                urls: {
                    apiURL: "https://api.neonscan.org/hardhat/verify",
                    browserURL: "https://neonscan.org"
                }
            }
        ]
    },
    networks: {
        neondevnet: {
            url: "https://devnet.neonevm.org",
            accounts: [process.env.PRIVATE_KEY_OWNER],
            chainId: 245022926
        },
        neonmainnet: {
            url: "https://neon-proxy-mainnet.solana.p2p.org",
            accounts: [process.env.PRIVATE_KEY_OWNER],
            chainId: 245022934
        }
    },
    gasReporter: {
      enabled: true
    }
};