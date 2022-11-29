import { Request, Response } from 'express';
import LeaderboardService from '../services/LeaderboardService';

export default class LeaderbordController {
  static async getLeaderboardGeneral(_req: Request, res: Response) {
    const leaderboard = await LeaderboardService.getLeaderboardGeneral();
    res.status(200).json(leaderboard);
  }

  static async getLeaderboardHome(_req: Request, res: Response) {
    const leaderboard = await LeaderboardService.getLeaderboardHome();
    res.status(200).json(leaderboard);
  }

  static async getLeaderboardAway(_req: Request, res: Response) {
    const leaderboard = await LeaderboardService.getLeaderboardAway();
    res.status(200).json(leaderboard);
  }
}
