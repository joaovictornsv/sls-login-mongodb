/* eslint-disable no-param-reassign */
import jwt from 'jsonwebtoken';
import { SECRET } from '../../constants/env';
import { PRIVATE_KEY, PUBLIC_KEY } from '../../constants/keys';

class TokenServices {
  generate(userId: string, expiresIn: string = '60s') {
    const token = jwt.sign({ id: userId }, { key: PRIVATE_KEY, passphrase: SECRET }, { expiresIn, algorithm: 'RS256' });

    return token;
  }

  isValid(token: string, obj: { valid: boolean }) {
    return jwt.verify(token, PUBLIC_KEY, { algorithms: ['RS256'] }, async (err: any) => {
      if (err) {
        return obj.valid = false;
      }

      return obj.valid = true;
    });
  }
}

export { TokenServices };
