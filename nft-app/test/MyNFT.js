const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MyNFT", function () {
  it("Should mint and transfer an NFT to someone", async function () {
    const GastonToken = await ethers.getContractFactory("GastonToken");
    const gastonToken = await GastonToken.deploy();
    await gastonToken.deployed();

    const recipient = '0xdD2FD4581271e230360230F9337D5c0430Bf44C0';
    const metadataURI = 'cid/test.png';

    let balance = await gastonToken.balanceOf(recipient);
    console.log(balance)
    expect(balance).to.equal(0);

    const newlyMintedToken = await gastonToken.payToMint(recipient, metadataURI, { value: ethers.utils.parseEther('0.001') });

    // wait until the transaction is mined
    await newlyMintedToken.wait();

    balance = await gastonToken.balanceOf(recipient)
    expect(balance).to.equal(1);

    expect(await gastonToken.isContentOwned(metadataURI)).to.equal(true);
    const newlyMintedToken2 = await gastonToken.payToMint(recipient, 'foo', { value: ethers.utils.parseEther('0.05') });
  });
});
