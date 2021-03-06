import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import User from '../models/User';
import { connectToDatabase } from '../database';
import { AuthenticateUser } from '../utils/authentication/authenticate-user';
import { response } from '../utils/response/context-response';
import Session from '../models/Session';

async function getUsers(context: Context, req: HttpRequest) {
  const authenticateUser = new AuthenticateUser();
  await authenticateUser.AuthRoute(req);

  const token = req.headers.authorization;
  await Session.updateOne(
    { access_token: token }, { $inc: { count_access_get_users: 1 } },
  );

  const users = await User.find();

  return context.res = response(200, { message: `Hello ${req.body.user.username}!`, data: users });
}

export const handler:
AzureFunction = async (
  context: Context,
  req: HttpRequest,
) => connectToDatabase()
  .then(async () => {
    await getUsers(context, req);
  })
  .catch((err) => context.res = response(400, { message: err.message }));
