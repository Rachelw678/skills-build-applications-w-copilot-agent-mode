import mongoose, { Schema } from 'mongoose';

export interface Workout {
  title: string;
  description: string;
  activityType: 'running' | 'walking' | 'cycling' | 'strength' | 'other';
  durationMinutes: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  instructions: string[];
}

const workoutSchema = new Schema<Workout>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    activityType: {
      type: String,
      enum: ['running', 'walking', 'cycling', 'strength', 'other'],
      required: true,
    },
    durationMinutes: { type: Number, required: true, min: 1 },
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      required: true,
    },
    instructions: { type: [String], default: [] },
  },
  { timestamps: true, collection: 'workouts' },
);

export const WorkoutModel =
  mongoose.models.Workout ?? mongoose.model<Workout>('Workout', workoutSchema);
