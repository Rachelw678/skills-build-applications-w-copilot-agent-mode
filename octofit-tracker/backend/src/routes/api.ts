import { Router } from 'express';
import { ActivityModel } from '../models/activity.js';
import { LeaderboardModel } from '../models/leaderboard.js';
import { TeamModel } from '../models/team.js';
import { UserModel } from '../models/user.js';
import { WorkoutModel } from '../models/workout.js';

export const router = Router();

router.get('/api/users/', async (_request, response) => {
  const users = await UserModel.find().sort({ name: 1 }).lean().exec();
  response.json(users);
});

router.get('/api/teams/', async (_request, response) => {
  const teams = await TeamModel.find().sort({ name: 1 }).lean().exec();
  response.json(teams);
});

router.get('/api/activities/', async (_request, response) => {
  const activities = await ActivityModel.find()
    .sort({ occurredAt: -1 })
    .lean()
    .exec();
  response.json(activities);
});

router.get('/api/leaderboard/', async (_request, response) => {
  const entries = await LeaderboardModel.find()
    .sort({ rank: 1, points: -1 })
    .populate('user', 'name email')
    .lean()
    .exec();
  response.json(entries);
});

router.get('/api/workouts/', async (_request, response) => {
  const workouts = await WorkoutModel.find().sort({ title: 1 }).lean().exec();
  response.json(workouts);
});
