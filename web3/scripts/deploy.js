const hre = require("hardhat");

async function main() {
  const Registry = await hre.ethers.getContractFactory("GovVCRegistry");
  const registry = await Registry.deploy();
  await registry.waitForDeployment();

  const deployedAddress = await registry.getAddress()
  console.log("GovVCRegistry deployed to:", deployedAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
