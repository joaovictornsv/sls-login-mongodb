import * as mongoose from 'mongoose';
import { DATABASE_URL } from '../constants/env';

let isConnected: boolean
// class ConnectionDB {
//   private isConnected: boolean = false;

//   constructor() {
//     console.log(this.isConnected);
//   }

//   public connectToDatabase = () => {
  
//     if (!this.isConnected) {
//       mongoose.connect(DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true });
//       mongoose.set('useFindAndModify', false);
  
//       const db = mongoose.connection;
  
//       db.on('error', console.error.bind(console, 'connection error:'));
  
//       db.once('open', () => {
//         console.log('Connected!');
//         this.isConnected = true;
//       });
//     }
//   }
// }

// const connectionDB = new ConnectionDB();

function connectToDatabase() {
  
  if (!isConnected) {
    mongoose.connect(DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true });
    mongoose.set('useFindAndModify', false);

    const db = mongoose.connection;

    db.on('error', console.error.bind(console, 'connection error:'));

    db.once('open', () => {
      console.log('Connected!');
      isConnected = true;
    });
  }
}

export default connectToDatabase();