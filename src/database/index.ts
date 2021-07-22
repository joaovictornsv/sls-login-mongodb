/* eslint-disable no-empty-function */
/* eslint-disable no-useless-constructor */
import * as mongoose from 'mongoose';
import { DATABASE_URL } from '../constants/env';

function connectToDatabase() {
  mongoose.set('useFindAndModify', false);
  return mongoose
    .connect(
      DATABASE_URL,
      { useNewUrlParser: true, useUnifiedTopology: true },
    )
    .then(() => console.log('Connected!'));

  // const db = mongoose.connection;

  // db.on('error', console.error.bind(console, 'connection error:'));

  // db.once('open', () => {
  //   console.log('Connected!');
  // });
}

export { connectToDatabase };
