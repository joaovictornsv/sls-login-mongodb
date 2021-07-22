import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import User from '../models/User';
import { encrypt } from '../utils/encrypt';
import '../database';

export const handler: AzureFunction = async (context: Context, req: HttpRequest) => {
  const userData = req.body;

  if (!userData || !userData.username || !userData.password) {
    return context.res = {
      status: 400,
      headers: {
        'Content-type': 'application-json',
      },
      body: { message: 'Provide the required fields' },
    };
  }

  const userAlreadyExists = await User.findOne({ username: userData.username });

  if (userAlreadyExists) {
    return context.res = {
      status: 400,
      headers: {
        'Content-type': 'application-json',
      },
      body: { message: 'User already exists' },
    };
  }

  const passwordHash = encrypt(userData.password);

  userData.password = passwordHash;

  const user = await User.create(userData);

  return context.res = {
    status: 201,
    headers: {
      'Content-type': 'application-json',
    },
    body: user,
  };
};
