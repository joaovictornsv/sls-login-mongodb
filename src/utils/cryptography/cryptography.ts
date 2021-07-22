import crypto from 'crypto';
import { SECRET } from '../../constants/env';
import { PRIVATE_KEY, PUBLIC_KEY } from '../../constants/keys';

class Cryptography {
  decrypt(password: Buffer) {
    const decrypted = crypto.privateDecrypt({ key: PRIVATE_KEY, passphrase: SECRET }, password);

    return decrypted.toString('utf-8');
  }

  encrypt(password: string) {
    const buffer = Buffer.from(password, 'utf-8');
    const encrypted = crypto.publicEncrypt(PUBLIC_KEY, buffer);

    return encrypted.toString('base64');
  }
}

export { Cryptography };
