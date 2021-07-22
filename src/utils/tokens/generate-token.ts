import jwt from 'jsonwebtoken';
import { SECRET } from '../../constants/env';

class TokenServices {
  generate(userId: string) {
    const token = jwt.sign({ id: userId }, SECRET, { expiresIn: '20s' });

    return token;
  }
}

export { TokenServices };
