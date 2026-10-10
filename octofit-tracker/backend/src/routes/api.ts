import { Router } from 'express';
import { ActivityModel } from '../models/activity.js';
import { LeaderboardModel } from '../models/leaderboard.js';
import { TeamModel } from '../models/team.js';
import { UserModel } from '../models/user.js';
import { WorkoutModel } from '../models/workout.js';

export const apiRouter = Router();

apiRouter.get('/users/', async (_request, response) => {
  const users = await UserModel.find().sort({ name: 1 }).lean().exec();
  response.json(users);
});

apiRouter.get('/teams/', async (_request, response) => {
  const teams = await TeamModel.find().sort({ name: 1 }).lean().exec();
  response.json(teams);
});

apiRouter.get('/activities/', async (_request, response) => {
  const activities = await ActivityModel.find()
    .sort({ occurredAt: -1 })
    .lean()
    .exec();
  response.json(activities);
});

apiRouter.get('/leaderboard/', async (_request, response) => {
  const entries = await LeaderboardModel.find()
    .sort({ rank: 1, points: -1 })
    .populate('user', 'name email')
    .lean()
    .exec();
  response.json(entries);
});

apiRouter.get('/workouts/', async (_request, response) => {
  const workouts = await WorkoutModel.find().sort({ title: 1 }).lean().exec();
  response.json(workouts);
});

apiRouter.use((_request, response) => {
  response.status(404).json({ error: 'API route not found' });
});
