const contractName = "EscrowTraker";

async function main() {
  const EscrowTraker = await hre.ethers.getContractFactory(contractName);
  const escrowTraker = await EscrowTraker.deploy();
  console.log(`${contractName} deployed to address: ${escrowTraker.address}`);
}

main()
 .then(() => process.exit(0))
 .catch(error => {
   console.error(error);
   process.exit(1);
 });