import * as dotenv from "dotenv";
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

// Plugins
import "@nomiclabs/hardhat-solhint";
import 'hardhat-test-utils'
import 'hardhat-abi-exporter'
import 'hardhat-log-remover'



dotenv.config();

const config: HardhatUserConfig = {
    solidity: {
        version: "0.8.14",
        settings: {
            optimizer: {
                enabled: true,
                runs: 200
            }
        }
    },
    networks: {
        localhost: {
            chainId: 31337,
            accounts: [process.env.HARDHAT_PRIVATE_KEY!]
        },
        goerli: {
            url: process.env.GOERLI_URL || "",
            accounts: [process.env.DEPLOY_PRIVATE_KEY!],
        },
        mumbai: {
            url: process.env.MUMBAI_URL || "",
            accounts: [process.env.DEPLOY_PRIVATE_KEY!]
        }
    },
    gasReporter: {
        enabled: process.env.REPORT_GAS !== undefined,
        currency: "USD",
    },
    etherscan: {
        apiKey: process.env.ETHERSCAN_API_KEY,
        // apiKey: process.env.POLYGONSCAN_API_KEY,
    },
    abiExporter: [
        {
            path: './abi/json',
            format: "json",
            pretty: true,
        },
        {
            path: './abi/minimal',
            format: "minimal",
            pretty: true,
        },
        {
            path: './abi/fullName',
            format: "fullName",
            pretty: true,
        },
    ]
};

export default config;
