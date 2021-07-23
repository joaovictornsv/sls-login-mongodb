import RefreshToken from '../../models/RefreshToken';
import User from '../../models/User';
import { TokenServices } from './generate-token';

class RefreshTokenServices {
  async isValid(refreshTokenId: string) {
    const refreshToken = await RefreshToken.findOne({ id: refreshTokenId });
    if (refreshToken) {
      return true;
    }

    return false;
  }

  async generate(userId: string) {
    const tokenServices = new TokenServices();
    const token = tokenServices.generate(userId, '60s');

    const newRefreshToken = await RefreshToken.create({ token, userId });

    await User.updateOne({ _id: userId }, { $set: { refresh_token: newRefreshToken.id } });

    return newRefreshToken;
  }
}

export { RefreshTokenServices };
