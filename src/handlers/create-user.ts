import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import User from '../models/User';
import { Cryptography } from '../utils/cryptography/cryptography';
import { connectToDatabase } from '../database';
import { response } from '../utils/response/context-response';

async function createUser(context: Context, req: HttpRequest) {
  const userData = req.body;

  if (!userData || !userData.username || !userData.password) {
    return context.res = response(400, { message: 'Provide the required fields' });
  }

  const userAlreadyExists = await User.findOne({ username: userData.username });

  if (userAlreadyExists) {
    return context.res = response(400, { message: 'User already exists' });
  }

  const cryptography = new Cryptography();
  const passwordHash = cryptography.encrypt(userData.password);

  userData.password = passwordHash;

  const user = await User.create(userData);

  return context.res = response(201, user);
}

export const handler:
AzureFunction = async (
  context: Context,
  req: HttpRequest,
) => connectToDatabase()
  .then(async () => {
    await createUser(context, req);
  })
  .catch((err) => context.res = response(400, { message: err.message }));
