import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const DECIMALS = 8;
const INITIAL_ANSWER = 2000n * 10n ** 8n;

export default buildModule("FundMeModule", (m) => {

    // Parameter: whether to use mock or not
    const useMock = process.env.USE_MOCK !== "false" ? true : false;

    let priceFeed;

    // If useMock = true → deploy mock
    if (useMock) {
        console.log("Deploying MockV3Aggregator (local)...");
        priceFeed = m.contract("MockV3Aggregator", [
            DECIMALS,
            INITIAL_ANSWER
        ]);
    }

    // If useMock = false → use real feed address
    else {
    priceFeed = m.contractAt("AggregatorV3Interface", process.env.PRICE_FEED!);
}

    const fundMe = m.contract("FundMe", [priceFeed]);

    return { fundMe, priceFeed };
});
