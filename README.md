# FundMe Solidity Project

A simple Ethereum smart contract that allows users to fund the contract in ETH and enables the contract owner to withdraw funds. This project demonstrates Solidity development, testing with Hardhat, and working with Chainlink price feeds.

## Features

- Users can fund the contract with ETH
- Minimum funding requirement enforced in USD using Chainlink price feeds
- Tracks funders and their contributions
- Only the contract owner can withdraw funds
- Two withdrawal methods: `withdraw()` and `cheaperWithdraw()`
- Full test coverage with Hardhat, Mocha, and Chai

## Technologies

- Solidity 0.8.28
- Hardhat
- TypeScript
- Ethers.js
- Chai & Mocha (testing)
- Chainlink AggregatorV3Interface (mocked for local testing)

## Getting Started

1. Clone the repository:
   ```bash
   git clone <https://github.com/Bereketgebeyaw/FundMe.git>
   cd FundMe
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Compile the contracts:
   ```bash
   npm install
   ```
4. Run tests:

   ```bash
   npx hardhat test


   ```
