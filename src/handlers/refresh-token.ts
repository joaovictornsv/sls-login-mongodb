import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { connectToDatabase } from '../database';
import RefreshToken from '../models/RefreshToken';
import { response } from '../utils/response/context-response';
import { TokenServices } from '../utils/tokens/generate-token';

async function getRefreshToken(context: Context, req: HttpRequest) {
  const { refresh_token } = req.body;
  if (!refresh_token) {
    throw new Error('Refresh Token not provided');
  }

  const refreshToken = await RefreshToken.findOne({ token: refresh_token });

  if (!refreshToken) {
    throw new Error('Refresh Token invalid');
  }

  const tokenServices = new TokenServices();
  const newToken = tokenServices.generate(refreshToken.userId);

  const refreshTokenIs = { valid: null };
  tokenServices.isValid(refreshToken.token, refreshTokenIs);

  if (!refreshTokenIs.valid) {
    throw new Error('Refresh Token expired! Please login again.');
  }

  return context.res = response(200, { token: newToken });
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
