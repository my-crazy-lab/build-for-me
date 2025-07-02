import mongoose from 'mongoose';

const tokenSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  linearToken: {
    accessToken: String,
    refreshToken: String,
    expiresAt: Date,
    scope: String
  },
  gitlabToken: {
    accessToken: String,
    refreshToken: String,
    expiresAt: Date,
    scope: String
  },
  linearUser: {
    id: String,
    name: String,
    email: String
  },
  gitlabUser: {
    id: String,
    username: String,
    name: String,
    email: String
  }
}, {
  timestamps: true
});

// Index for faster lookups
tokenSchema.index({ userId: 1 });

export default mongoose.model('Token', tokenSchema);
