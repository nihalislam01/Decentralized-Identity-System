const { EthrDID } = require('ethr-did');
const { createVerifiableCredentialJwt } = require('did-jwt-vc');
const { Resolver } = require('did-resolver');
const { getResolver } = require('ethr-did-resolver');

const issuer = new EthrDID({
  identifier: 'did:ethr:0xGOV_ADDRESS',
  privateKey: '0xGOV_PRIVATE_KEY',
});

async function issueVC() {
  const credentialPayload = {
    sub: 'did:ethr:0xUSER_ADDRESS',
    nbf: Math.floor(Date.now() / 1000),
    vc: {
      '@context': ['https://www.w3.org/2018/credentials/v1'],
      type: ['VerifiableCredential', 'GovIDCredential'],
      credentialSubject: {
        fullName: 'Nihal Ahmed',
        nidNumber: '1234567890',
        dob: '2001-01-01',
      },
    },
  };

  const jwt = await createVerifiableCredentialJwt(credentialPayload, issuer);
  console.log('VC JWT:', jwt);
  return jwt;
}

issueVC();