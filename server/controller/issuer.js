const { ethers } = require("ethers");
const { createVerifiableCredentialJwt } = require("did-jwt-vc");
const { EthrDID } = require("ethr-did");
const crypto = require("crypto");
const path = require("path");
const fs = require("fs");
const express = require('express');
const router = express.Router();

const { PRIVATE_KEY, ISSUER_ADDRESS, PROVIDER_URL, CONTRACT_ADDRESS } = process.env;

const provider = new ethers.JsonRpcProvider(PROVIDER_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

const abiPath = path.join(__dirname, "../../web3/artifacts/contracts/GovVCRegistry.sol/GovVCRegistry.json");
const abi = JSON.parse(fs.readFileSync(abiPath)).abi;
const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, wallet);

const issuer = new EthrDID({
  identifier: ISSUER_ADDRESS,
  privateKey: PRIVATE_KEY,
});

router.post("/issue-vc", async (req, res) => {
    try {
      const { fullName, nidNumber, dob, userEthAddress } = req.body;
  
      if (!fullName || !nidNumber || !dob || !userEthAddress) {
        return res.status(400).json({ error: "Missing fields" });
      }
  
      const credentialPayload = {
        sub: `did:ethr:${userEthAddress}`,
        nbf: Math.floor(Date.now() / 1000),
        vc: {
          '@context': ['https://www.w3.org/2018/credentials/v1'],
          type: ['VerifiableCredential', 'GovIDCredential'],
          credentialSubject: { fullName, nidNumber, dob },
        },
      };
  
      const jwt = await createVerifiableCredentialJwt(credentialPayload, issuer);
      const vcHash = crypto.createHash("sha256").update(jwt).digest("hex");
  
      const tx = await contract.issueVC(nidNumber, vcHash);
      await tx.wait();
  
      res.json({
        success: true,
        message: "VC issued and stored on blockchain",
        jwt,
        vcHash,
        txHash: tx.hash,
      });
  
    } catch (err) {
      console.error("Error issuing VC:", err);
      res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router