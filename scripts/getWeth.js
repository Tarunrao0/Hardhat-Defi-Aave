const { getNamedAccounts, ethers } = require("hardhat")

// WETH is ETH in ERC-20 token form also known as wrapped ethereum

const AMOUNT = ethers.utils.parseEther("0.02")

async function getWeth() {
    const { deployer } = await getNamedAccounts()
    // need to call deposit function to get WETH
    // need the abi and contract address 
    // 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2
    const iWeth = await ethers.getContractAt(
        "IWeth",
        "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
        deployer
    )
    const tx = await iWeth.deposit({value: AMOUNT})
    await tx.wait(1)
    const wethBalance = await iWeth.balanceOf(deployer)
    console.log(`Got ${wethBalance.toString()} WETH`)

}

module.exports = {
    getWeth,
    AMOUNT
}