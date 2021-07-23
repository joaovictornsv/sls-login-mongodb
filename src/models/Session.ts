import * as mongoose from 'mongoose';

const Session = new mongoose.Schema({
  refresh_token: { type: mongoose.Types.ObjectId, ref: 'Refresh_Token' },
  access_token: { type: String, trim: true, required: true },
  count_access_get_users: { type: Number, default: 0 },
  expires_in: { type: String, default: '20s' },
},
{
  timestamps: { createdAt: 'created_at' },
});

Session.index({ created_at: 1 }, { expireAfterSeconds: 180 });

export default mongoose.models.Session || mongoose.model('Session', Session);
