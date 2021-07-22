import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import User from '../models/User';
import '../database';
import { AuthRoute } from '../utils/auth';

export const handler: AzureFunction = async function (context: Context, req: HttpRequest) {
  try {
    await AuthRoute(req);
    const users = await User.find();

    return context.res = {
      headers: {
        'Content-type': 'application-json',
      },
      body: users,
    }

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
