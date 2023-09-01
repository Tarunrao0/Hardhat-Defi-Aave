const { getNamedAccounts, ethers } = require("hardhat")
const { getWeth, AMOUNT } = require("../scripts/getWeth")

async function main () {
    await getWeth()
    const { deployer } = await getNamedAccounts()
    const lendingPool = await getLendingPool(deployer)
    console.log(`Lending Pool address ${lendingPool.address}`)
    //deposit!
    const wethTokenAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
    //approve
    /**
     * Need to approve lending pool to pull the WETH from our account
     */
    await approveErc20(wethTokenAddress, lendingPool.address, AMOUNT, deployer )
    console.log("Depositing...")
    await lendingPool.deposit(wethTokenAddress, AMOUNT, deployer, 0)
    console.log("Deposited!")

    //UserData

    let { availableBorrowsETH, totalDebtETH } = await getBorrowUserData(lendingPool, deployer)

    //Price conversion DAI/ETH
    const daiPrice = await getDaiPrice()

    //Amount of DAI deployer can borrow
    const amountDaiToBorrow = availableBorrowsETH.toString() * 0.95 * (1/daiPrice.toNumber()) 
    //getting 95% of the amount we can borrow so that we dont hit the limit !!
    console.log(`You can borrow ${amountDaiToBorrow} DAI`)
    const amountDaiToBorrowWei = ethers.utils.parseEther(amountDaiToBorrow.toString())

    //Borrow
    const daiTokenAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F"
    await borrowDai(
        daiTokenAddress, 
        lendingPool,
        amountDaiToBorrowWei, 
        deployer
    )
    //Update user data
    await getBorrowUserData(lendingPool, deployer)

    //Repay
    await repay(amountDaiToBorrowWei, daiTokenAddress, lendingPool, deployer)
    await getBorrowUserData(lendingPool, deployer)
}
/** 
 * abi, contract address
 * To get the Lending Pool contract address from aave we need to
 * interact with the Lending Pool Address Provider contract  
 * Lending Pool contract address : 0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5
 */

//LendingPool

async function getLendingPool(account) {
    const LendingPoolAddressesProvider = await ethers.getContractAt(
        "ILendingPoolAddressesProvider", 
        "0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5",
        account 
    )
    const lendingPoolAddress = await LendingPoolAddressesProvider.getLendingPool()
    const lendingPool = await ethers.getContractAt(
        "ILendingPool",
        lendingPoolAddress,
        account
    )
    return lendingPool
}

//Approve

async function approveErc20(erc20Address, spenderAddress, amountToSpend, account){
    const erc20Token = await ethers.getContractAt(
        "IERC20",
        erc20Address,
        account
    )
    const tx = await erc20Token.approve(spenderAddress, amountToSpend)
    await tx.wait(1)
    console.log("Approved!")
}

//Borrow data

async function getBorrowUserData(lendingPool, account) {
    const {
        totalCollateralETH,
        totalDebtETH,
        availableBorrowsETH
    } = await lendingPool.getUserAccountData(account)
    console.log(`You have ${totalCollateralETH} worth of ETH deposited.`)
    console.log(`You have ${totalDebtETH} worth of ETH borrowed.`)
    console.log(`You can borrow ${availableBorrowsETH} worth of ETH.`)
    return { availableBorrowsETH, totalDebtETH }
}

//Conversion 

async function getDaiPrice() {
    const daiPriceFeed = await ethers.getContractAt(
        "AggregatorV3Interface",
        "0x773616E4d11A78F511299002da57A0a94577F1f4", //DAI/ETH price conversion     
    )
    const price = (await daiPriceFeed.latestRoundData())[1]
    console.log(`The DAI/ETH price is ${ price.toString() }`)
    return price 

}

//Borrow

async function borrowDai(
    daiAddress,
    lendingPool,
    amountDaiToBorrow,
    account

){
    const borrowTx = await lendingPool.borrow(
        daiAddress,
        amountDaiToBorrow,
        1,
        0,
        account
    )
    await borrowTx.wait(1)
    console.log(`You've borrowed!`)
}

//Repay

async function repay(
    amount,
    daiAddress,
    lendingPool,
    account
) {
    await approveErc20(daiAddress, lendingPool.address, amount, account)
    const repayTx = await lendingPool(daiAddress, amount, 1, account)
    await repayTx.wait(1)
    console.log("Repaid!")
}


main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })