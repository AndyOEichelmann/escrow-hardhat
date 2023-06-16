const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('Escrow', function () {
  let contract;
  let depositor;
  let beneficiary;
  let arbiter;
  const deposit = ethers.utils.parseEther('1');
  beforeEach(async () => {
    depositor = ethers.provider.getSigner(0);
    beneficiary = ethers.provider.getSigner(1);
    arbiter = ethers.provider.getSigner(2);

    // deply the escrow traker address
    const EscrowTraker = await ethers.getContractFactory('EscrowTraker');
    escrowTraker = await EscrowTraker.deploy();
    await escrowTraker.deployed();

    // deply an escrow address
    const Escrow = await ethers.getContractFactory('Escrow');
    contract = await Escrow.deploy(
      arbiter.getAddress(),
      beneficiary.getAddress(),
      escrowTraker.address,
      {
        value: deposit,
      }
    );
    await contract.deployed();
  });
  
  describe('escro traker tests', () => {
    it('should not exist address', async function() {
      const address = await ethers.provider.getSigner(3).getAddress();
      const addressArr = await escrowTraker.viewEscrow(address);
      expect(addressArr.length).to.equal(0);
    });

    it('should exist in depositor address', async function() {
      const depositorAdd = await escrowTraker.viewEscrow(await depositor.getAddress());
      expect(depositorAdd[0]).to.eq(contract.address);
    });

    it('should exist in beneficiary address', async function() {
      const beneficiaryAdd = await escrowTraker.viewEscrow(await beneficiary.getAddress());
      expect(beneficiaryAdd[0]).to.eq(contract.address);
    });

    it('should exist in arbiter address', async function() {
      const arbiterAdd = await escrowTraker.viewEscrow(await beneficiary.getAddress());
      expect(arbiterAdd[0]).to.eq(contract.address);
    });
  });

  it('should be funded initially', async function () {
    let balance = await ethers.provider.getBalance(contract.address);
    expect(balance).to.eq(deposit);
  });

  describe('after approval from address other than the arbiter', () => {
    it('should revert', async () => {
      await expect(contract.connect(beneficiary).approve()).to.be.reverted;
    });
  });

  describe('after approval from the arbiter', () => {
    it('should transfer balance to beneficiary', async () => {
      const before = await ethers.provider.getBalance(beneficiary.getAddress());
      const approveTxn = await contract.connect(arbiter).approve();
      await approveTxn.wait();
      const after = await ethers.provider.getBalance(beneficiary.getAddress());
      expect(after.sub(before)).to.eq(deposit);
    });
  });

  describe('after contract information', () => {
    it('should return contract data', async () => {
      const _depositor = await depositor.getAddress();
      const values = await contract.viewContract();
      expect(values.depositor).to.eq(_depositor);
    });
  });
});
