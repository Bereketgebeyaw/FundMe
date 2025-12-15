import { network } from "hardhat";

const { ethers } = await network.connect();

const FUND_ME_ADDRESS = "0xE2c17d6F12c9016E9317d7E052a005C844B90f94";
async function main() {


  const fundMe = await ethers.getContractAt("FundMe",FUND_ME_ADDRESS);

  const tx = await fundMe.fund({
    value: ethers.parseEther("0.01"),
  });

  await tx.wait();
  console.log("Funded FundMe with 0.1 ETH");
}

main().catch(console.error);
