import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDatabase } from '../config/database.js';
import { ActivityModel } from '../models/activity.js';
import { LeaderboardModel } from '../models/leaderboard.js';
import { TeamModel } from '../models/team.js';
import { UserModel } from '../models/user.js';
import { WorkoutModel } from '../models/workout.js';

dotenv.config();

/**
 * Seed the octofit_db database with test data
 */
async function seedDatabase() {
  try {
    await connectDatabase();

    const users = await Promise.all([
      UserModel.findOneAndUpdate(
        { email: 'maya.chen@example.com' },
        { $set: { name: 'Maya Chen' } },
        { new: true, upsert: true, runValidators: true },
      ).exec(),
      UserModel.findOneAndUpdate(
        { email: 'leo.martinez@example.com' },
        { $set: { name: 'Leo Martinez' } },
        { new: true, upsert: true, runValidators: true },
      ).exec(),
      UserModel.findOneAndUpdate(
        { email: 'amara.okafor@example.com' },
        { $set: { name: 'Amara Okafor' } },
        { new: true, upsert: true, runValidators: true },
      ).exec(),
      UserModel.findOneAndUpdate(
        { email: 'noah.kim@example.com' },
        { $set: { name: 'Noah Kim' } },
        { new: true, upsert: true, runValidators: true },
      ).exec(),
    ]);
    const [maya, leo, amara, noah] = users;

    const teams = await Promise.all([
      TeamModel.findOneAndUpdate(
        { name: 'Morning Movers' },
        {
          $set: {
            description: 'A friendly crew building a consistent morning routine.',
            members: [maya._id, leo._id],
          },
        },
        { new: true, upsert: true, runValidators: true },
      ).exec(),
      TeamModel.findOneAndUpdate(
        { name: 'Trail Blazers' },
        {
          $set: {
            description: 'Weekend walkers, runners, and outdoor explorers.',
            members: [amara._id, noah._id],
          },
        },
        { new: true, upsert: true, runValidators: true },
      ).exec(),
    ]);
    const [morningMovers, trailBlazers] = teams;

    await Promise.all([
      UserModel.updateOne({ _id: maya._id }, { $set: { team: morningMovers._id } }).exec(),
      UserModel.updateOne({ _id: leo._id }, { $set: { team: morningMovers._id } }).exec(),
      UserModel.updateOne({ _id: amara._id }, { $set: { team: trailBlazers._id } }).exec(),
      UserModel.updateOne({ _id: noah._id }, { $set: { team: trailBlazers._id } }).exec(),
    ]);

    const activities = [
      {
        user: maya._id,
        activityType: 'running' as const,
        durationMinutes: 32,
        distanceKm: 4.8,
        calories: 310,
        occurredAt: new Date('2026-10-09T07:15:00.000Z'),
      },
      {
        user: leo._id,
        activityType: 'cycling' as const,
        durationMinutes: 45,
        distanceKm: 14.2,
        calories: 420,
        occurredAt: new Date('2026-10-09T07:30:00.000Z'),
      },
      {
        user: amara._id,
        activityType: 'walking' as const,
        durationMinutes: 38,
        distanceKm: 3.1,
        calories: 185,
        occurredAt: new Date('2026-10-08T16:20:00.000Z'),
      },
      {
        user: noah._id,
        activityType: 'strength' as const,
        durationMinutes: 40,
        calories: 260,
        occurredAt: new Date('2026-10-08T18:00:00.000Z'),
      },
    ];
    await Promise.all(
      activities.map(({ user, activityType, occurredAt, ...activity }) =>
        ActivityModel.updateOne(
          { user, activityType, occurredAt },
          { $set: { user, activityType, occurredAt, ...activity } },
          { upsert: true, runValidators: true },
        ).exec(),
      ),
    );

    const leaderboard = [
      { user: maya._id, points: 860, rank: 1, period: 'all-time' },
      { user: amara._id, points: 740, rank: 2, period: 'all-time' },
      { user: leo._id, points: 620, rank: 3, period: 'all-time' },
      { user: noah._id, points: 510, rank: 4, period: 'all-time' },
    ];
    await Promise.all(
      leaderboard.map(({ user, ...entry }) =>
        LeaderboardModel.updateOne(
          { user, period: entry.period },
          { $set: { user, ...entry } },
          { upsert: true, runValidators: true },
        ).exec(),
      ),
    );

    const workouts = [
      {
        title: 'Easy 5K Builder',
        description: 'A conversational-pace session to build comfortable running endurance.',
        activityType: 'running' as const,
        durationMinutes: 30,
        difficulty: 'beginner' as const,
        instructions: ['Warm up with a brisk 5-minute walk.', 'Jog easily for 20 minutes.', 'Cool down with a 5-minute walk.'],
      },
      {
        title: 'Bodyweight Strength Circuit',
        description: 'A balanced full-body circuit using simple bodyweight movements.',
        activityType: 'strength' as const,
        durationMinutes: 25,
        difficulty: 'intermediate' as const,
        instructions: ['Complete 3 rounds of squats, push-ups, and reverse lunges.', 'Work for 40 seconds and rest for 20 seconds between movements.', 'Finish with gentle stretching.'],
      },
      {
        title: 'Recovery Walk',
        description: 'A relaxed walk to support recovery and add easy movement to your day.',
        activityType: 'walking' as const,
        durationMinutes: 20,
        difficulty: 'beginner' as const,
        instructions: ['Walk at a comfortable pace.', 'Keep your posture tall and shoulders relaxed.', 'Slow down for the final 3 minutes.'],
      },
    ];
    await Promise.all(
      workouts.map(({ title, ...workout }) =>
        WorkoutModel.updateOne(
          { title },
          { $set: { title, ...workout } },
          { upsert: true, runValidators: true },
        ).exec(),
      ),
    );

    console.log(
      `Database seeding complete: ${users.length} users, ${teams.length} teams, ${activities.length} activities, ${leaderboard.length} leaderboard entries, and ${workouts.length} workouts.`,
    );
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exitCode = 1;
  } finally {
    try {
      await mongoose.disconnect();
    } catch (error) {
      console.error('Error disconnecting from the database:', error);
      process.exitCode = 1;
    }
  }
}

seedDatabase();
