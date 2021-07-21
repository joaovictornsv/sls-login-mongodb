import * as crypto from 'crypto';
import { PUBLIC_KEY } from '../constants/keys';

function encrypt(password: string) {
  const buffer = Buffer.from(password, 'utf-8');
  const encrypted = crypto.publicEncrypt(PUBLIC_KEY, buffer)

  return encrypted.toString('base64')
}

export { encrypt }