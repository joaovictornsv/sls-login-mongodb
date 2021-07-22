import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { connectToDatabase } from '../database';
import { AuthenticateUser } from '../utils/authentication/authenticate-user';
import { response } from '../utils/response/context-response';

async function login(context: Context, req: HttpRequest) {
  const authenticateUser = new AuthenticateUser();
  const { token, refreshToken } = await authenticateUser.AuthLogin(req);
  return context.res = response(200, { token, refreshToken });
}

export const handler:
AzureFunction = async (
  context: Context,
  req: HttpRequest,
) => connectToDatabase()
  .then(async () => {
    await login(context, req);
  })
  .catch((err) => context.res = response(400, { message: err.message }));
