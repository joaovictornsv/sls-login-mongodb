import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { connectToDatabase } from '../database';
import Session from '../models/Session';
import { AuthenticateUser } from '../utils/authentication/authenticate-user';
import { response } from '../utils/response/context-response';

async function login(context: Context, req: HttpRequest) {
  const authenticateUser = new AuthenticateUser();
  const { token, refreshToken } = await authenticateUser.AuthLogin(req);

  const session = await Session.create({ refresh_token: refreshToken.id, access_token: token });

  return context.res = response(200,
    { session_id: session.id, token, refreshToken });
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
