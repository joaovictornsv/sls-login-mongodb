import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import '../database';
import { generateJWT } from '../utils/generate-token';

export const handler: AzureFunction = async function (context: Context, req: HttpRequest) {
  try {
    const token = await generateJWT(req);
    return context.res = {
      status: 200,
      headers: {
        'Content-type': 'application-json',
      },
      body: { token: token },
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
