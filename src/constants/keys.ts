import * as fs  from 'fs';
import * as path from 'path';

export const PUBLIC_KEY = fs.readFileSync(path.resolve(__dirname, '..', '..', '..','..', 'public.pem'), 'utf-8')
export const PRIVATE_KEY = fs.readFileSync(path.resolve(__dirname, '..', '..','..','..', 'private.key'), 'utf-8')