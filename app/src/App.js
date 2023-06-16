import { ethers } from 'ethers';
import { useEffect, useState } from 'react';

import deploy from './deploy';
import Escrow from './Escrow';
import EscrowTraker from './artifacts/contracts/EscrowTraker.sol/EscrowTraker';
import EscrowABI from './artifacts/contracts/Escrow.sol/Escrow';

const provider = new ethers.providers.Web3Provider(window.ethereum);

// localTrakerAddr = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
const trakerAddr = '0x5d1e79d58c84dde4CC3E6999dadc71f54Ec0e2E0';
const trakerAbi = EscrowTraker.abi;

const escrowAbi = EscrowABI.abi;

export async function approve(escrowContract, signer) {
  const approveTxn = await escrowContract.connect(signer).approve();
  await approveTxn.wait();
}

function App() {
  const [escrows, setEscrows] = useState([]);
  const [account, setAccount] = useState();
  const [signer, setSigner] = useState();

  useEffect(() => {
    async function getAccounts() {
      const accounts = await provider.send('eth_requestAccounts', []);

      setAccount(accounts[0]);
      setSigner(provider.getSigner());
    }

    getAccounts();
    getEscrows();
  }, [account]);

  /* 
    These function retreves and saves the data of the escrow contracts that arle linked
    to the retreved address.
  */
  async function getEscrows() {
    // intercat with traker contract, create a instance of the contract
    const contact = new ethers.Contract(trakerAddr, trakerAbi, provider);
    // ask for the list ascoiated to de address - returns a list of escrw contracts address
    const escrowsAddr = await contact.viewEscrow(account);

    // creates an array of escrow structures maping info from each address that was retived
    const escrowsArr = await Promise.all(escrowsAddr.map(async (addr) =>{
      // intercat with the corresponding escrw contract, create a instance of the contract
      const escrowContract = await new ethers.Contract(addr, escrowAbi, provider);
      // retive the data of the contract
      const values = await escrowContract.viewContract();

      const escrow = {
        address: escrowContract.address,
        arbiter: values.arbiter,
        beneficiary: values.beneficiary,
        value: ethers.utils.formatEther(values.balance).toString(),
        status: values.isApproved,
        handleApprove: async () => {
            escrowContract.on('Approved', () => {
              document.getElementById(escrowContract.address).className =
                'complete';
              document.getElementById(escrowContract.address).innerText =
                "✓ It's been approved!";
            });
            
            await approve(escrowContract, signer);
        },
        activeAcount: account,
      };
      return escrow;
    }));
      
    // set the inicial value of the escrow contacts list
    setEscrows(escrowsArr);
  }

  async function newContract() {
    const beneficiary = document.getElementById('beneficiary').value;
    const arbiter = document.getElementById('arbiter').value;
    
    const value = ethers.BigNumber.from(ethers.utils.parseEther(document.getElementById('wei').value));
    const escrowContract = await deploy(signer, arbiter, beneficiary, trakerAddr, value);

    const escrow = {
      address: escrowContract.address,
      arbiter,
      beneficiary,
      value: ethers.utils.formatEther(value).toString(),
      status: false,
      handleApprove: async () => {
        escrowContract.on('Approved', () => {
          document.getElementById(escrowContract.address).className =
            'complete';
          document.getElementById(escrowContract.address).innerText =
            "✓ It's been approved!";
        });

        await approve(escrowContract, signer);
      },
      activeAcount: account,
    };

    setEscrows([...escrows, escrow]);
  }

  return (
    <>
      <div className="contract">
        <h1> New Contract </h1>
        <label>
          <h2>Arbiter Address</h2>
          <input type="text" id="arbiter" />
        </label>

        <label>
          <h2>Beneficiary Address</h2>
          <input type="text" id="beneficiary" />
        </label>

        <label>
          <h2>Deposit Amount (in Ether)</h2>
          <input type="text" id="wei" />
        </label>

        <div
          className="button"
          id="deploy"
          onClick={(e) => {
            e.preventDefault();

            newContract();
          }}
        >
          Deploy
        </div>
      </div>

      <div className="existing-contracts">
        <h1> Your Escrow Contracts </h1>

        <div id="container">
          {escrows.map((escrow) => {
            return <Escrow key={escrow.address} {...escrow} />;
          })}
        </div>
      </div>
      <footer>
        IMPORTANT: ' Theese app neads to conect to MetaMask and use Sepolia test network '
        <br />
        ' It only shows the contracts that your acount is linked with '
        <br />
        ' If you change address reload the page tu update the informatio ' 
      </footer>
    </>
  );
}

export default App;
