import * as jwt from 'jsonwebtoken';
import { SECRET } from '../constants/env';

function generateToken(userId: string) {


  const token = jwt.sign({ id: userId }, SECRET, { expiresIn: '20s' });


  return token;
}

export { generateToken }