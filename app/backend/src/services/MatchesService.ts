import { messageDto } from '../@types/messageDto';
import { GoalsData, MatchData } from '../@types/DTOs/MatchesDto';
import { inProgressQuery } from '../@types/DTOs/QueryDto';
import { NotFound, UnprocessableEntity } from '../@types/errors';
import MatchModel from '../database/models/Matches';
import TeamModel from '../database/models/Team';

export default class MatchesService {
  static async getAllMatches(inProgress: inProgressQuery): Promise<MatchModel[]> {
    const where = inProgress?.length ? { inProgress: (inProgress === 'true') } : {};
    const matches = await MatchModel.findAll({
      where,
      include: ['teamHome', 'teamAway'],
    });
    return matches;
  }

  // static async getMatchById(id: number): Promise<MatchModel> {
  //   const match = await MatchModel.findOne({ where: { id } });

  //   if (!match) {
  //     throw new NotFound('match not found!');
  //   }

  //   return match;
  // }

  static async createMatch(matchData: MatchData): Promise<MatchModel> {
    const homeTeam = await TeamModel.findOne({ where: { id: matchData.homeTeam } });
    const awayTeam = await TeamModel.findOne({ where: { id: matchData.awayTeam } });

    console.log(homeTeam, awayTeam);
    console.log(!homeTeam, !awayTeam, !homeTeam || !awayTeam);

    if (!homeTeam || !awayTeam) {
      throw new NotFound('There is no team with such id!');
    }

    const match = await MatchModel.create({
      homeTeam: matchData.homeTeam,
      awayTeam: matchData.awayTeam,
      homeTeamGoals: matchData.homeTeamGoals,
      awayTeamGoals: matchData.awayTeamGoals,
      inProgress: true,
    });
    return match;
  }

  static async finishMatch(id: number): Promise<messageDto> {
    const match = await MatchModel.findOne({ where: { id } });

    if (!match) {
      throw new NotFound('match not found!');
    }

    await MatchModel.update({
      inProgress: false,
    }, { where: { id } });

    return { message: 'Finished' };
  }

  static async updateGoals(id: number, goalsData: GoalsData): Promise<MatchModel> {
    const match = await MatchModel.findOne({ where: { id } });

    if (!match) {
      throw new NotFound('match not found!');
    }

    if (!match.inProgress) {
      throw new UnprocessableEntity();
    }

    await MatchModel.update({
      homeTeamGoals: goalsData.homeTeamGoals,
      awayTeamGoals: goalsData.awayTeamGoals,
    }, { where: { id } });

    return { ...match.dataValues, ...goalsData } as MatchModel;
  }
}
