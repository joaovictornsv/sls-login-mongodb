import * as jwt from 'jsonwebtoken';
import { HttpRequest } from '@azure/functions';
import User from '../models/User';
import { SECRET } from '../constants/env';
import { decrypt } from './decrypt';

// Custom JWT authentication middleware
async function verifyRefreshToken(req: HttpRequest) {
  if (req.body) {
    const { token } = req.body;

    if (!token) {
      throw new Error('No token provided');
    }

    return jwt.verify(token, SECRET, async (err: any, decoded: any) => {
      if (err) {
        throw new Error(err);
      }

      const id = decoded.id;

      const user = await User.findById(id);

      if (!user) {
        throw new Error('User not exists');
      }

      return { id };
    });
  }
 throw new Error('No headers provided');
}

async function generateRefreshToken(req: HttpRequest) {
  if (req.headers) {
    const token = req.headers.authorization;

    if (token) {
      return token;
    }

    const { username } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      throw new Error('User not exists');
    }

    const decryptedPassword = decrypt(Buffer.from(user.password,"base64"));
    const passwordIsValid = req.body.password === decryptedPassword

    if (!passwordIsValid) {
      throw new Error('Failed to login, invalid password');
    }

    const { id } = user;

    const newToken = jwt.sign({ id }, SECRET, { expiresIn: '20s' });

    return newToken;
  }
  throw new Error('No headers provided');
}

export { verifyRefreshToken, generateRefreshToken };
