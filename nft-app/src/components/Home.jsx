import WalletBalance from './WalletBalance';
import { useEffect, useState } from 'react';
import reactLogo from '../assets/react.svg'

import { ethers } from 'ethers';
import GastonToken from '../artifacts/contracts/MyNFT.sol/GastonToken.json';

const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

const provider = new ethers.providers.Web3Provider(window.ethereum);

// get the end user
const signer = provider.getSigner();

// get the smart contract
const contract = new ethers.Contract(contractAddress, GastonToken.abi, signer);


function Home() {

  const [totalMinted, setTotalMinted] = useState(0);

    console.log(contract)

  useEffect(() => {
    getCount();
  }, []);

  const getCount = async () => {
    const count = await contract.count();
    console.log(parseInt(count));
    setTotalMinted(parseInt(count));
  };

  return (
    <div>
        <WalletBalance />

        <div style={{display: 'flex'}}>
            {Array(totalMinted + 1)
            .fill(0)
            .map((_, i) => (
                <div key={i} style={{ marginRight: '10px'}}>
                <NFTImage tokenId={i} getCount={getCount} />
                </div>
            ))}
        </div>
    </div>
  );
}

function NFTImage({ tokenId, getCount }) {
    const contentId = 'QmRh8g3THLL2qXEfDGsbeUQPb14q7nXWR2EUP3EDN6pNrm';
    const metadataURI = `${contentId}/${tokenId}.json`;
    const imageURI = `https://gateway.pinata.cloud/ipfs/${contentId}/${tokenId}.svg`;
    // const previewImageURI = `img/${tokenId}.svg`;
    const previewImageURI = 'img/placeholder.png';

    const [isMinted, setIsMinted] = useState(false);
    useEffect(() => {
      getMintedStatus();
    }, [isMinted]);

    const getMintedStatus = async () => {
      const result = await contract.isContentOwned(metadataURI);
      console.log(result)
      setIsMinted(result);
    };

    const mintToken = async () => {
      const connection = contract.connect(signer);
      const addr = connection.address;
      const result = await contract.payToMint(addr, metadataURI, {
        value: ethers.utils.parseEther('0.001'),
      });

      await result.wait();
      getMintedStatus();
      getCount();
    };

    async function getURI() {
      const uri = await contract.tokenURI(tokenId);
      alert(uri);
    }
    return (
      <div>
        <img src={isMinted ? imageURI : previewImageURI}></img>
          <h5>ID #{tokenId}</h5>
          {!isMinted ? (
            <button onClick={mintToken}>
              Mint
            </button>
          ) : (
            <button onClick={getURI}>
              Taken! Show URI
            </button>
          )}
      </div>
    );
  }

  export default Home;
