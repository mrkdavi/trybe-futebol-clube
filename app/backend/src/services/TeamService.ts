import { NotFound } from '../@types/errors';
import TeamModel from '../database/models/Team';

export default class TeamService {
  static async getAllTeams(): Promise<TeamModel[]> {
    const teams = await TeamModel.findAll();
    return teams;
  }

  static async getTeamById(id: number): Promise<TeamModel> {
    const team = await TeamModel.findOne({ where: { id } });

    if (!team) {
      throw new NotFound('team not found!');
    }

    return team;
  }
}
