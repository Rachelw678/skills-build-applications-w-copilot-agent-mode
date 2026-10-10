import mongoose, { Schema, Types } from 'mongoose';

export interface User {
  name: string;
  email: string;
  team?: Types.ObjectId | null;
}

const userSchema: Schema<User> = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    team: { type: Schema.Types.ObjectId, ref: 'Team', default: null },
  },
  { timestamps: true, collection: 'users' },
);

export const UserModel =
  mongoose.models.User ?? mongoose.model('User', userSchema);
