import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import '../database';
import { AuthLogin } from '../utils/auth';

export const handler: AzureFunction = async function (context: Context, req: HttpRequest) {
  try {
    const { token, refreshToken } = await AuthLogin(req);
    return context.res = {
      status: 200,
      headers: {
        'Content-type': 'application-json',
      },
      body: { token, refreshToken },
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
