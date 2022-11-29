import {
  LeaderboardDto,
  TeamMatches,
  TeamMatchesAwayModel,
  TeamMatchesGeneralModel,
  TeamMatchesHomeModel,
  TeamMatchesModel,
} from '../@types/DTOs/LeaderboardDto';

import MatchModel from '../database/models/Matches';
import TeamModel from '../database/models/Team';

export default class LeaderboardService {
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

  private static swapTeams(teamMatches: MatchModel[]) {
    return teamMatches.map(({ dataValues }) => {
      const match = { ...dataValues } as MatchModel;
      [match.awayTeam, match.homeTeam] = [match.homeTeam, match.awayTeam];
      [match.awayTeamGoals, match.homeTeamGoals] = [match.homeTeamGoals, match.awayTeamGoals];
      return match;
    });
  }

  private static filterFinishedGames(teamMatches: MatchModel[]) {
    return teamMatches.filter((v) => v.inProgress !== true);
  }

  private static formatMatches(teamMatches: TeamMatchesGeneralModel) {
    const convertedAwayMatches = LeaderboardService.swapTeams(
      teamMatches.teamAway,
    );
    return teamMatches.teamHome
      .concat(convertedAwayMatches);
  }

  private static formatTeamsMatches(
    teamMatches: TeamMatchesModel,
    matches: MatchModel[],
  ): TeamMatches {
    return {
      id: teamMatches.id,
      name: teamMatches.teamName,
      matches,
    };
  }

  private static sortLeaderboard(leaderboard: LeaderboardDto[]) {
    return leaderboard.sort(
      (a, b) =>
        b.totalPoints - a.totalPoints
        || b.totalVictories - a.totalVictories
        || b.goalsBalance - a.goalsBalance
        || b.goalsFavor - a.goalsFavor
        || a.goalsOwn - b.goalsOwn,
    );
  }

  private static getTeamsStats(teamsMatches: TeamMatches[]): LeaderboardDto[] {
    return teamsMatches.map((teamMatches) => ({
      name: teamMatches.name,
      totalPoints: LeaderboardService.calculateTotalPoints(teamMatches),
      totalGames: LeaderboardService.calculateTotalGames(teamMatches),
      totalVictories: LeaderboardService.calculateTotalVictories(teamMatches),
      totalDraws: LeaderboardService.calculateTotalDraws(teamMatches),
      totalLosses: LeaderboardService.calculateTotalLosses(teamMatches),
      goalsFavor: LeaderboardService.calculateGoalsFavor(teamMatches),
      goalsOwn: LeaderboardService.calculateGoalsOwn(teamMatches),
      goalsBalance: LeaderboardService.calculateGoalsBalance(teamMatches),
      efficiency: LeaderboardService.calculateEfficiency(teamMatches),
    }));
  }

  private static calculateTotalPoints(teamMatches: TeamMatches) {
    const totalVictories = LeaderboardService.calculateTotalVictories(teamMatches);
    const totalDraws = LeaderboardService.calculateTotalDraws(teamMatches);
    return totalVictories * 3 + totalDraws;
  }

  private static calculateEfficiency(teamMatches: TeamMatches) {
    const totalPoints = LeaderboardService.calculateTotalPoints(teamMatches);
    const totalGames = LeaderboardService.calculateTotalGames(teamMatches);
    return +((totalPoints / (totalGames * 3)) * 100).toFixed(2);
  }

  private static calculateGoalsFavor(teamMatches: TeamMatches) {
    return teamMatches.matches.reduce((acc, v) => acc + v.homeTeamGoals, 0);
  }

  private static calculateGoalsOwn(teamMatches: TeamMatches) {
    return teamMatches.matches.reduce((acc, v) => acc + v.awayTeamGoals, 0);
  }

  private static calculateGoalsBalance(teamMatches: TeamMatches) {
    const goalsFavor = LeaderboardService.calculateGoalsFavor(teamMatches);
    const goalsOwn = LeaderboardService.calculateGoalsOwn(teamMatches);
    return goalsFavor - goalsOwn;
  }

  private static calculateTotalVictories(teamMatches: TeamMatches) {
    return teamMatches.matches.reduce(
      (acc, v) => (v.homeTeamGoals > v.awayTeamGoals ? acc + 1 : acc),
      0,
    );
  }

  private static calculateTotalDraws(teamMatches: TeamMatches) {
    return teamMatches.matches.reduce(
      (acc, v) => (v.homeTeamGoals === v.awayTeamGoals ? acc + 1 : acc),
      0,
    );
  }

  private static calculateTotalLosses(teamMatches: TeamMatches) {
    return teamMatches.matches.reduce(
      (acc, v) => (v.homeTeamGoals < v.awayTeamGoals ? acc + 1 : acc),
      0,
    );
  }

  private static calculateTotalGames(teamMatches: TeamMatches) {
    return teamMatches.matches.length;
  }
}
