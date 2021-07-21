const fs = require('fs');
const { generateKeyPair } = require('crypto');

const senha = 'e211cb42-0c67-4f7e-a186-997a36882716'

generateKeyPair('rsa', {
  modulusLength: 4096,
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem'
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem',
    cipher: 'aes-256-cbc',
    passphrase: senha
  }
}, (erro, chavePublica, chavePrivada) => {
    fs.writeFileSync('public.pem', chavePublica);
    fs.writeFileSync('private.key', chavePrivada);
    }
);