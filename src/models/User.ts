import * as mongoose from 'mongoose';

const User = new mongoose.Schema({
  username: { type: String, trim: true, required: true },
  password: { type: String, trim: true, required: true },
  refresh_token: { type: mongoose.Types.ObjectId, ref: 'Refresh_Token', default: null },
},
{
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});

export default mongoose.models.User || mongoose.model('User', User);
