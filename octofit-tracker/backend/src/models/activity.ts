import mongoose, { Schema, Types } from 'mongoose';

export interface Activity {
  user: Types.ObjectId;
  activityType: 'running' | 'walking' | 'cycling' | 'strength' | 'other';
  durationMinutes: number;
  distanceKm?: number;
  calories?: number;
  occurredAt: Date;
}

const activitySchema: Schema<Activity> = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    activityType: {
      type: String,
      enum: ['running', 'walking', 'cycling', 'strength', 'other'],
      required: true,
    },
    durationMinutes: { type: Number, required: true, min: 1 },
    distanceKm: { type: Number, min: 0 },
    calories: { type: Number, min: 0 },
    occurredAt: { type: Date, required: true, default: Date.now },
  },
  { timestamps: true, collection: 'activities' },
);

export const ActivityModel =
  mongoose.models.Activity ?? mongoose.model('Activity', activitySchema);
