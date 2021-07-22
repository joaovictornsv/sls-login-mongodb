import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import * as dayjs from 'dayjs';
import '../database';
import RefreshToken from '../models/RefreshToken';
import { generateRefreshToken } from '../utils/generate-refresh-token';
import { generateToken } from '../utils/generate-token';

export const handler: AzureFunction = async function (context: Context, req: HttpRequest) {
  try {
    const { refresh_token } = req.body;
    if (!refresh_token) {
      throw new Error('Refresh Token not provided');
    }

    const refreshToken = await RefreshToken.findById(refresh_token);

    if (!refreshToken) {
      throw new Error('Refresh Token invalid');
    }
    
    const token = generateToken(refreshToken.userId);
    if (dayjs().isAfter(dayjs.unix(refreshToken.expiresIn))) {
      await RefreshToken.deleteMany({ userId: refreshToken.userId });

      const newRefreshToken = await generateRefreshToken(refreshToken.userId);

      return context.res = {
        status: 200,
        headers: {
          'Content-type': 'application-json',
        },
        body: { token, newRefreshToken },
      };
    }

    return context.res = {
      status: 200,
      headers: {
        'Content-type': 'application-json',
      },
      body: { token },
    };

  } catch(err) {
    return context.res = {
      status: 400,
      headers: {
        'Content-type': 'application-json',
      },
      body: { message: err.message },
    };
  }
}
