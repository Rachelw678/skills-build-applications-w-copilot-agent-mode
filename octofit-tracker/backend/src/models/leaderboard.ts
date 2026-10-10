import mongoose, { Schema, Types } from 'mongoose';

export interface LeaderboardEntry {
  user: Types.ObjectId;
  points: number;
  rank: number;
  period: string;
}

const leaderboardSchema: Schema<LeaderboardEntry> = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    points: { type: Number, required: true, min: 0, default: 0 },
    rank: { type: Number, required: true, min: 1 },
    period: { type: String, required: true, default: 'all-time' },
  },
  { timestamps: true, collection: 'leaderboard' },
);

leaderboardSchema.index({ user: 1, period: 1 }, { unique: true });

export const LeaderboardModel =
  mongoose.models.LeaderboardEntry ??
  mongoose.model('LeaderboardEntry', leaderboardSchema);
