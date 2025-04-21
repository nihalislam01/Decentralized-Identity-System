const express = require('express');
const { ethers, keccak256, toUtf8Bytes } = require('ethers');
const path = require('path');
const fs = require('fs');
const router = express.Router();

const {PROVIDER_URL, CONTRACT_ADDRESS} = process.env;

const abiPath = path.join(__dirname, '../../web3/artifacts/contracts/GovVCRegistry.sol/GovVCRegistry.json');
const abi = JSON.parse(fs.readFileSync(abiPath)).abi;

const provider = new ethers.JsonRpcProvider(PROVIDER_URL);
const contractAddress = CONTRACT_ADDRESS;
const contract = new ethers.Contract(contractAddress, abi, provider);

router.post('/verify', async (req, res) => {
  try {
    const { jwt, nidNumber } = req.body;
    if (!jwt || !nidNumber) {
      return res.status(400).json({ error: 'Missing jwt or nidNumber' });
    }

    const submittedHash = keccak256(toUtf8Bytes(jwt));

    const vcRecord = await contract.getVC(nidNumber);

    if (!vcRecord || !vcRecord.vcHash) {
      return res.status(404).json({ message: 'VC not found for this NID' });
    }

    if (vcRecord.vcHash === submittedHash) {
      return res.status(200).json({
        message: 'VC is valid and matches blockchain record',
        holder: vcRecord.holder,
        nid: nidNumber,
        submittedHash,
        storedHash: vcRecord.vcHash
      });
    } else {
      return res.status(401).json({
        message: 'VC hash does not match blockchain record',
        submittedHash,
        storedHash: vcRecord.vcHash
      });
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error verifying credential' });
  }
});

module.exports = router;
