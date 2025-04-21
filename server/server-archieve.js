const express = require('express');
const { verifyCredential } = require('did-jwt-vc');
const { Resolver } = require('did-resolver');
const { getResolver } = require('ethr-did-resolver');

const app = express();
app.use(express.json());

const resolver = new Resolver(getResolver({ infuraProjectId: 'YOUR_INFURA_ID' }));

app.post('/verify-login', async (req, res) => {
  try {
    const { jwt } = req.body;

    const verifiedVC = await verifyCredential(jwt, resolver);

    if (verifiedVC.verifiableCredential) {
      const userInfo = verifiedVC.verifiableCredential.credentialSubject;
      console.log('Verified user:', userInfo);
      return res.status(200).json({ success: true, user: userInfo });
    }

    res.status(400).json({ success: false, msg: 'Invalid VC' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: 'Verification error' });
  }
});

app.listen(3000, () => {
  console.log('Verifier running on port 3000');
});