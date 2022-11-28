import { Request, Response } from 'express';
import { inProgressQuery } from '../@types/DTOs/QueryDto';
import MatchesService from '../services/MatchesService';

export default class MatchesController {
  static async getAllMatches(req: Request, res: Response) {
    const { inProgress } = req.query;
    const matches = await MatchesService.getAllMatches(inProgress as inProgressQuery);
    res.status(200).json(matches);
  }

  // static async getMatchById(req: Request, res: Response) {
  //   const { id } = req.params;
  //   const match = await MatchesService.getMatchById(+id);
  //   res.status(200).json(match);
  // }

  static async createMatch(req: Request, res: Response) {
    const match = await MatchesService.createMatch(req.body);
    res.status(201).json(match);
  }

  static async finishMatch(req: Request, res: Response) {
    const { params: { id } } = req;
    const message = await MatchesService.finishMatch(+id);
    res.status(200).json(message);
  }

  static async updateGoals(req: Request, res: Response) {
    const { params: { id }, body } = req;
    const message = await MatchesService.updateGoals(+id, body);
    res.status(200).json(message);
  }
}
