import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import dayjs from 'dayjs';
import { connectToDatabase } from '../database';
import RefreshToken from '../models/RefreshToken';
import { response } from '../utils/response/context-response';
import { RefreshTokenServices } from '../utils/tokens/generate-refresh-token';
import { TokenServices } from '../utils/tokens/generate-token';

async function getRefreshToken(context: Context, req: HttpRequest) {
  const { refresh_token } = req.body;
  if (!refresh_token) {
    throw new Error('Refresh Token not provided');
  }

  const refreshToken = await RefreshToken.findById(refresh_token);

  if (!refreshToken) {
    throw new Error('Refresh Token invalid');
  }

  const tokenServices = new TokenServices();
  const token = tokenServices.generate(refreshToken.userId);

  const refreshTokenExpired = dayjs().isAfter(dayjs.unix(refreshToken.expiresIn));

  if (refreshTokenExpired) {
    await RefreshToken.deleteMany({ userId: refreshToken.userId });

    const refreshTokenServices = new RefreshTokenServices();
    const newRefreshToken = await refreshTokenServices.generate(refreshToken.userId);

    return context.res = response(200, { token, newRefreshToken });
  }

  return context.res = response(200, { token });
}

export const handler:
AzureFunction = async (
  context: Context,
  req: HttpRequest,
) => connectToDatabase()
  .then(async () => {
    await getRefreshToken(context, req);
  })
  .catch((err) => context.res = response(400, { message: err.message }));
