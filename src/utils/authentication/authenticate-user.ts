import jwt from 'jsonwebtoken';
import { HttpRequest } from '@azure/functions';
import User from '../../models/User';
import { Cryptography } from '../cryptography/cryptography';
import { RefreshTokenServices } from '../tokens/generate-refresh-token';
import { TokenServices } from '../tokens/generate-token';
import RefreshToken from '../../models/RefreshToken';
import { PUBLIC_KEY } from '../../constants/keys';

// Custom JWT authentication middleware
class AuthenticateUser {
  async AuthRoute(req: HttpRequest) {
    if (req.headers) {
      const token = req.headers.authorization;

      if (!token) {
        throw new Error('No token provided');
      }

      return jwt.verify(token, PUBLIC_KEY, { algorithms: ['RS256'] }, async (err: any, decoded: any) => {
        if (err) {
          throw new Error(err);
        }

        const { id } = decoded;

        const user = await User.findById(id);

        if (!user) {
          throw new Error('User not exists');
        }

        req.body = { user };
      });
    }
    throw new Error('No headers provided');
  }

  async AuthLogin(req: HttpRequest) {
    const { username } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      throw new Error('User not exists');
    }

    const cryptography = new Cryptography();

    const decryptedPassword = cryptography.decrypt(Buffer.from(user.password, 'base64'));
    const passwordIsValid = req.body.password === decryptedPassword;

    if (!passwordIsValid) {
      throw new Error('Failed to login, invalid password');
    }

    const { id } = user;

    const tokenServices = new TokenServices();
    const token = tokenServices.generate(id);

    await RefreshToken.deleteMany({ userId: id });

    const refreshTokenServices = new RefreshTokenServices();
    const refreshToken = await refreshTokenServices.generate(id);

    return { token, refreshToken };
  }
}
export { AuthenticateUser };
