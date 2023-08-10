import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-etherscan';
import '@nomiclabs/hardhat-waffle';
import '@openzeppelin/hardhat-upgrades';
import '@typechain/hardhat';
import { config as dotenvConfig } from 'dotenv';
import 'hardhat-tracer';
import { extendEnvironment, HardhatUserConfig, task } from 'hardhat/config';
import { resolve } from 'path';
import 'solidity-coverage';
import 'hardhat-interface-generator';
import 'hardhat-deploy';
import 'hardhat-deploy-ethers';
import 'hardhat-dependency-compiler';
import { lyraContractPaths } from '@lyrafinance/protocol/dist/test/utils/package/index-paths';
import './tasks';

dotenvConfig({ path: resolve(__dirname, './deployments/.env.private') });
const etherscanApiKey = process.env.ETHERSCAN_KEY || '';

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: '0.8.19',
        settings: {
          optimizer: {
            enabled: true,
            runs: 1000,
          },
        },
      },
      {
        version: "0.8.9",
        settings: {
          optimizer: {
            enabled: true,
            runs: 1000,
          }
        }
      },
      {
        version: "0.7.0",
      }
    ],
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
  networks: {
    hardhat: {
      allowUnlimitedContractSize: true,
    },
    local: {
      url: 'http://127.0.0.1:8545',
      accounts: {
        mnemonic: 'test test test test test test test test test test test junk',
      },
    }
  },
  dependencyCompiler: {
    paths: lyraContractPaths,
  }

};

extendEnvironment(hre => {
  (hre as any).f = {
    c: undefined,
    deploySnap: undefined,
    boardId: undefined,
    market: undefined,
    seedSnap: undefined,
  };
});

export default config;
