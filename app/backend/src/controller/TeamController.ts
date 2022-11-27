import { Request, Response } from 'express';
import TeamService from '../services/TeamService';

export default class TeamController {
  static async getAllTeams(_req: Request, res: Response) {
    const teams = await TeamService.getAllTeams();
    res.status(200).json(teams);
  }

  static async getTeamById(req: Request, res: Response) {
    const { id } = req.params;
    const team = await TeamService.getTeamById(+id);
    res.status(200).json(team);
  }
}
