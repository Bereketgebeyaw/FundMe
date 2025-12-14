import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.connect();

describe("FundMe", function () {
  let fundMe: any;
  let mockV3Aggregator: any;
  let deployer: any;

  beforeEach(async function () {
    [deployer] = await ethers.getSigners();

    const MockV3Aggregator = await ethers.getContractFactory("MockV3Aggregator");
    mockV3Aggregator = await MockV3Aggregator.deploy(
      8,
      2000n * 10n ** 8n
    );

    const FundMe = await ethers.getContractFactory("FundMe");
    fundMe = await FundMe.deploy(mockV3Aggregator.target);
  });

  describe("constructor", function () {
    it("Should set the deployer as the owner", async function () {
      const owner = await fundMe.i_owner();
      expect(owner).to.equal(deployer.address);
    });

    it("Should set the price feed address correctly", async function () {
      const priceFeedAddress = await fundMe.s_priceFeed();
      expect(priceFeedAddress).to.equal(mockV3Aggregator.target);
    });


    describe("fund function", function () {
    it("Should fail if not enough ETH is sent", async function () {
      // Trying to fund less than the MINIMUM_USD
      await expect(fundMe.fund({ value: ethers.parseEther("0.01") }))
        .to.be.revertedWith("You need to spend more ETH!");
    });

    it("Should update amount funded mapping when fund is enough", async function () {
      const sendValue = ethers.parseEther("0.03"); // enough ETH according to mock price
      await fundMe.fund({ value: sendValue });

      const amountFunded = await fundMe.getAddressToAmountFunded(deployer.address);
      expect(amountFunded).to.equal(sendValue);
    });

    it("Should add funder to funders array", async function () {
      const sendValue = ethers.parseEther("0.03");
      await fundMe.fund({ value: sendValue });

      const funder = await fundMe.getFunder(0);
      expect(funder).to.equal(deployer.address);
    });
  });

  describe("withdraw function", function () {
  let sendValue: bigint;

  beforeEach(async function () {
    sendValue = ethers.parseEther("0.03"); // Fund with some ETH
    // Fund the contract
    await fundMe.fund({ value: sendValue });
  });

  it("Should allow only owner to withdraw", async function () {
    const [_, attacker] = await ethers.getSigners();

    await expect(fundMe.connect(attacker).withdraw()).to.be.revertedWithCustomError(
        fundMe,
      "FundMe__NotOwner"
    );
  });

  it("Should withdraw funds correctly to owner", async function () {
    const startingOwnerBalance = await ethers.provider.getBalance(deployer.address);

    const startingContractBalance = await ethers.provider.getBalance(fundMe.target);

    // Withdraw
    const txResponse = await fundMe.withdraw();
    const txReceipt = await txResponse.wait();

   const endingOwnerBalance = await ethers.provider.getBalance(deployer.address);

    const endingContractBalance = await ethers.provider.getBalance(fundMe.target);

    // Contract balance should be 0
    expect(endingContractBalance).to.equal(0n);

    // Owner balance should increase by contract balance minus gas
    expect(endingOwnerBalance).to.be.above(startingOwnerBalance);
  });

  it("Should reset funders mapping and array", async function () {
    await fundMe.withdraw();

    // Funders array should be empty
    await expect(fundMe.getFunder(0)).to.be.revertedWithPanic(0x32);

    // Funded amount should be 0
    const fundedAmount = await fundMe.getAddressToAmountFunded(deployer.address);
    expect(fundedAmount).to.equal(0n);
  });
});

  });
});
