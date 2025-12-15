import { network } from "hardhat";

const {ethers} =await network.connect()
const FUND_ME_ADDRESS = "0xE2c17d6F12c9016E9317d7E052a005C844B90f94";

async function main() {
    const fundMe =await ethers.getContractAt("FundMe",FUND_ME_ADDRESS)
    const tx = await fundMe.withdraw();
    await tx.wait();
    console.log("Withdraw successful");
}
main().catch(console.error);