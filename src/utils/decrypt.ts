import * as crypto from 'crypto';
import { SECRET } from '../constants/env';
import { PRIVATE_KEY } from '../constants/keys';

function decrypt(password: Buffer) {
  const decrypted = crypto.privateDecrypt({ key: PRIVATE_KEY, passphrase: SECRET }, password);

  return decrypted.toString('utf-8');
}

export { decrypt };
