import * as dayjs from 'dayjs';
import RefreshToken from '../models/RefreshToken';

// Custom JWT authentication middleware
async function refreshTokenIsValid(refreshTokenId: string) {
  const refreshToken = await RefreshToken.findOne({ id: refreshTokenId });

  if (refreshToken) {
    return true;
  }

  return false;
}

async function generateRefreshToken(userId: string) {
  const expiresIn = dayjs().add(20, 'seconds').unix();

  const newRefreshToken = await RefreshToken.create({ expiresIn, userId });

  return newRefreshToken;
}

export { refreshTokenIsValid, generateRefreshToken };
