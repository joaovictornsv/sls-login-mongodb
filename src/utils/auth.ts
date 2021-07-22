import * as jwt from 'jsonwebtoken';
import { HttpRequest } from '@azure/functions';
import User from '../models/User';
import { SECRET } from '../constants/env';
import { decrypt } from './decrypt';
import { generateRefreshToken } from './generate-refresh-token';
import { generateToken } from './generate-token';
import RefreshToken from '../models/RefreshToken';

// Custom JWT authentication middleware
async function AuthRoute(req: HttpRequest) {
  if (req.headers) {
    const token = req.headers.authorization;

    if (!token) {
      throw new Error('No token provided');
    }

    return jwt.verify(token, SECRET, async (err: any, decoded: any) => {
      if (err) {
        throw new Error(err);
      }

      const { id } = decoded;

      console.log(id);

      const user = await User.findById(id);

      if (!user) {
        throw new Error('User not exists');
      }

      return { id };
    });
  }
  throw new Error('No headers provided');
}

async function AuthLogin(req: HttpRequest) {
  const { username } = req.body;

  const user = await User.findOne({ username });

  if (!user) {
    throw new Error('User not exists');
  }

  const decryptedPassword = decrypt(Buffer.from(user.password, 'base64'));
  const passwordIsValid = req.body.password === decryptedPassword;

  if (!passwordIsValid) {
    throw new Error('Failed to login, invalid password');
  }

  const { id } = user;

  const token = generateToken(id);

  await RefreshToken.deleteMany({ userId: id });

  const refreshToken = await generateRefreshToken(id);

  return { token, refreshToken };
}

export { AuthRoute, AuthLogin };
