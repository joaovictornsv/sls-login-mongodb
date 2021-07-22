import * as mongoose from 'mongoose';

const RefreshToken = new mongoose.Schema({
  expiresIn: { type: Number, required: true },
  userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
},
{
  timestamps: { createdAt: 'created_at' },
});

export default mongoose.models.Refresh_Token || mongoose.model('Refresh_Token', RefreshToken);
