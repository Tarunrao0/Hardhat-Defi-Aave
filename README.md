
# About this project

A project interacting with the Aave interfaces and creating a script that lets users lend tokens, have collaterals and borrow tokens.

A user can stake lets say 0.1 ETH as his collateral and borrow other tokens like DAI, Avalanche, polygon etc.

The user is also limited with the amount of tokens he can borrow based on the collateral deposited

In case the user fails to repay his debt, his collateral gets liquidated


# What is Aave?

Aave is a decentralized finance (DeFi) protocol that lets people lend and borrow cryptocurrencies and real-world assets (RWAs) without having to go through a centralized intermediary. When they lend, they earn interest; when they borrow, they pay interest.

link🔗: https://aave.com






![aave-coin62631](https://github.com/Tarunrao0/Hardhat-Defi-Aave/assets/122633325/da42c343-1e93-4627-8b39-43152ae14fc3)



# What is DeFi?

DeFi eliminates the fees that banks and other financial companies charge for using their services. Individuals hold money in a secure digital wallet, can transfer funds in minutes, and anyone with an internet connection can use DeFi.


# Interfaces used

Smart contracts like :

IWeth ➡️ Since ETH is not a ERC-20 Token, this interface wraps  ETH as an ERC-20 Token

AggregatorV3Interfaces ➡️ Helps us convert the DAI prices in terms of ETH and vice versa 

ILendingPool ➡️ this contract consists of multiple functions such as deposit, withdraw, borrow and repay

IERC20 ➡️ allows the transaction of the tokens
## Deployment

To deploy this project run

```bash
  yarn hardhat run scripts/aaveBorrow.js
```


## Installation

Install hardhat 

```bash
   yarn add --dev hardhat
```
To create a file 
```bash
   yarn hardhat
```
## 🔗 Socials

[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/tarun-rao-b42995280)
[![twitter](https://img.shields.io/badge/twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/TarunRao00)




