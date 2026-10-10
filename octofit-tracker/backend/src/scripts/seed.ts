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

    const user = UserModel;
    const users = await Promise.all(
      [
        { name: 'Maya Chen', email: 'maya.chen@example.com' },
        { name: 'Leo Martinez', email: 'leo.martinez@example.com' },
        { name: 'Amara Okafor', email: 'amara.okafor@example.com' },
        { name: 'Noah Kim', email: 'noah.kim@example.com' },
      ].map(async (seedUser) => {
        const existing = await user.findOne({ email: seedUser.email }).exec();
        if (existing) {
          existing.name = seedUser.name;
          return existing.save();
        }
        return user.create(seedUser);
      }),
    );
    const [maya, leo, amara, noah] = users;

    const team = TeamModel;
    const teams = await Promise.all(
      [
        {
          name: 'Morning Movers',
          description: 'A friendly crew building a consistent morning routine.',
          members: [maya._id, leo._id],
        },
        {
          name: 'Trail Blazers',
          description: 'Weekend walkers, runners, and outdoor explorers.',
          members: [amara._id, noah._id],
        },
      ].map(async (seedTeam) => {
        const existing = await team.findOne({ name: seedTeam.name }).exec();
        if (existing) {
          existing.set(seedTeam);
          return existing.save();
        }
        return team.create(seedTeam);
      }),
    );
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
    const activity = ActivityModel;
    await Promise.all(
      activities.map(async (seedActivity) => {
        const existing = await activity
          .findOne({
            user: seedActivity.user,
            activityType: seedActivity.activityType,
            occurredAt: seedActivity.occurredAt,
          })
          .exec();
        if (existing) {
          existing.set(seedActivity);
          await existing.save();
          return;
        }
        await activity.create(seedActivity);
      }),
    );

    const leaderboardEntries = [
      { user: maya._id, points: 860, rank: 1, period: 'all-time' },
      { user: amara._id, points: 740, rank: 2, period: 'all-time' },
      { user: leo._id, points: 620, rank: 3, period: 'all-time' },
      { user: noah._id, points: 510, rank: 4, period: 'all-time' },
    ];
    const leaderboard = LeaderboardModel;
    await Promise.all(
      leaderboardEntries.map(async (seedEntry) => {
        const existing = await leaderboard
          .findOne({ user: seedEntry.user, period: seedEntry.period })
          .exec();
        if (existing) {
          existing.set(seedEntry);
          await existing.save();
          return;
        }
        await leaderboard.create(seedEntry);
      }),
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
    const workout = WorkoutModel;
    await Promise.all(
      workouts.map(async (seedWorkout) => {
        const existing = await workout.findOne({ title: seedWorkout.title }).exec();
        if (existing) {
          existing.set(seedWorkout);
          await existing.save();
          return;
        }
        await workout.create(seedWorkout);
      }),
    );

    console.log(
      `Database seeding complete: ${users.length} users, ${teams.length} teams, ${activities.length} activities, ${leaderboardEntries.length} leaderboard entries, and ${workouts.length} workouts.`,
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
