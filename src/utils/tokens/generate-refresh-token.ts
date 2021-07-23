import RefreshToken from '../../models/RefreshToken';
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
    const token = tokenServices.generate(userId);

    const newRefreshToken = await RefreshToken.create({ token, userId });

    return newRefreshToken;
  }
}

export { RefreshTokenServices };
