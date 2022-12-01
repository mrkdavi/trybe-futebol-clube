import {
  TeamMatchesAwayModel,
  TeamMatchesGeneralModel,
  TeamMatchesHomeModel,
} from '../@types/DTOs/LeaderboardDto';

import TeamModel from '../database/models/Team';
import LeaderboardServiceUtils from './LeaderboardServiceUtils';

export default class LeaderboardService extends LeaderboardServiceUtils {
  static async getLeaderboardGeneral(): Promise<unknown> {
    const teams = await TeamModel.findAll({
      include: ['teamHome', 'teamAway'],
    });

    const teamsMatches = teams.map(
      (team) => team.dataValues,
    ) as TeamMatchesGeneralModel[];

    const teamsMatchesFormatted = teamsMatches.map((teamMatches) => {
      const matches = LeaderboardService.formatMatches(teamMatches);
      const filteredMatches = LeaderboardService.filterFinishedGames(matches);
      return LeaderboardService.formatTeamsMatches(teamMatches, filteredMatches);
    });

    const teamStats = LeaderboardService.getTeamsStats(teamsMatchesFormatted);

    return LeaderboardService.sortLeaderboard(teamStats);
  }

  static async getLeaderboardHome(): Promise<unknown> {
    const teams = await TeamModel.findAll({
      include: ['teamHome'],
    });
    const teamsMatches = teams.map(
      (team) => team.dataValues,
    ) as TeamMatchesHomeModel[];

    const teamsMatchesFormatted = teamsMatches.map((teamMatches) => {
      const filteredMatches = LeaderboardService.filterFinishedGames(teamMatches.teamHome);
      return LeaderboardService.formatTeamsMatches(teamMatches, filteredMatches);
    });

    const teamStats = LeaderboardService.getTeamsStats(teamsMatchesFormatted);

    return LeaderboardService.sortLeaderboard(teamStats);
  }

  static async getLeaderboardAway(): Promise<unknown> {
    const teams = await TeamModel.findAll({
      include: ['teamAway'],
    });
    const teamsMatches = teams.map(
      (team) => team.dataValues,
    ) as TeamMatchesAwayModel[];

    const teamsMatchesFormatted = teamsMatches.map((teamMatches) => {
      const matches = LeaderboardService.swapTeams(teamMatches.teamAway);
      const filteredMatches = LeaderboardService.filterFinishedGames(matches);
      return LeaderboardService.formatTeamsMatches(teamMatches, filteredMatches);
    });

    const teamStats = LeaderboardService.getTeamsStats(teamsMatchesFormatted);

    return LeaderboardService.sortLeaderboard(teamStats);
  }
}
