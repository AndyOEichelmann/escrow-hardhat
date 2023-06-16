require('@nomicfoundation/hardhat-toolbox');
require("dotenv").config();

module.exports = {
  solidity: "0.8.17",
  defaultNetwork: 'localhost',
  networks: {
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
      accounts:[process.env.SEPOLIA_PRIVATE_KEY]
    }
  },
  paths: {
    artifacts: "./app/src/artifacts",
  }
};

// https://university.alchemy.com/course/ethereum/md/639a4cc4033c9b0004051a69
// npx hardhat run scripts/deploy.js --network sepolia