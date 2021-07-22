import dayjs from 'dayjs';
import RefreshToken from '../../models/RefreshToken';

class RefreshTokenServices {
  async isValid(refreshTokenId: string) {
    const refreshToken = await RefreshToken.findOne({ id: refreshTokenId });

    if (refreshToken) {
      return true;
    }

    return false;
  }

  async generate(userId: string) {
    const expiresIn = dayjs().add(20, 'seconds').unix();

    const newRefreshToken = await RefreshToken.create({ expiresIn, userId });

    return newRefreshToken;
  }
}

export { RefreshTokenServices };
