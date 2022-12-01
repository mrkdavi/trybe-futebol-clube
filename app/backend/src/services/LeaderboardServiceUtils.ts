import {
  LeaderboardDto,
  TeamMatches,
  TeamMatchesGeneralModel,
  TeamMatchesModel,
} from '../@types/DTOs/LeaderboardDto';

import MatchModel from '../database/models/Matches';

export default class LeaderboardServiceUtils {
  protected static swapTeams(teamMatches: MatchModel[]) {
    return teamMatches.map(({ dataValues }) => {
      const match = { ...dataValues } as MatchModel;
      [match.awayTeam, match.homeTeam] = [match.homeTeam, match.awayTeam];
      [match.awayTeamGoals, match.homeTeamGoals] = [match.homeTeamGoals, match.awayTeamGoals];
      return match;
    });
  }

  protected static filterFinishedGames(teamMatches: MatchModel[]) {
    return teamMatches.filter((v) => v.inProgress !== true);
  }

  protected static formatMatches(teamMatches: TeamMatchesGeneralModel) {
    const convertedAwayMatches = LeaderboardServiceUtils.swapTeams(
      teamMatches.teamAway,
    );
    return teamMatches.teamHome
      .concat(convertedAwayMatches);
  }

  protected static formatTeamsMatches(
    teamMatches: TeamMatchesModel,
    matches: MatchModel[],
  ): TeamMatches {
    return {
      id: teamMatches.id,
      name: teamMatches.teamName,
      matches,
    };
  }

  protected static sortLeaderboard(leaderboard: LeaderboardDto[]) {
    return leaderboard.sort(
      (a, b) =>
        b.totalPoints - a.totalPoints
        || b.totalVictories - a.totalVictories
        || b.goalsBalance - a.goalsBalance
        || b.goalsFavor - a.goalsFavor
        || a.goalsOwn - b.goalsOwn,
    );
  }

  protected static getTeamsStats(teamsMatches: TeamMatches[]): LeaderboardDto[] {
    return teamsMatches.map((teamMatches) => ({
      name: teamMatches.name,
      totalPoints: LeaderboardServiceUtils.calculateTotalPoints(teamMatches),
      totalGames: LeaderboardServiceUtils.calculateTotalGames(teamMatches),
      totalVictories: LeaderboardServiceUtils.calculateTotalVictories(teamMatches),
      totalDraws: LeaderboardServiceUtils.calculateTotalDraws(teamMatches),
      totalLosses: LeaderboardServiceUtils.calculateTotalLosses(teamMatches),
      goalsFavor: LeaderboardServiceUtils.calculateGoalsFavor(teamMatches),
      goalsOwn: LeaderboardServiceUtils.calculateGoalsOwn(teamMatches),
      goalsBalance: LeaderboardServiceUtils.calculateGoalsBalance(teamMatches),
      efficiency: LeaderboardServiceUtils.calculateEfficiency(teamMatches),
    }));
  }

  protected static calculateTotalPoints(teamMatches: TeamMatches) {
    const totalVictories = LeaderboardServiceUtils.calculateTotalVictories(teamMatches);
    const totalDraws = LeaderboardServiceUtils.calculateTotalDraws(teamMatches);
    return totalVictories * 3 + totalDraws;
  }

  protected static calculateEfficiency(teamMatches: TeamMatches) {
    const totalPoints = LeaderboardServiceUtils.calculateTotalPoints(teamMatches);
    const totalGames = LeaderboardServiceUtils.calculateTotalGames(teamMatches);
    return +((totalPoints / (totalGames * 3)) * 100).toFixed(2);
  }

  protected static calculateGoalsFavor(teamMatches: TeamMatches) {
    return teamMatches.matches.reduce((acc, v) => acc + v.homeTeamGoals, 0);
  }

  protected static calculateGoalsOwn(teamMatches: TeamMatches) {
    return teamMatches.matches.reduce((acc, v) => acc + v.awayTeamGoals, 0);
  }

  protected static calculateGoalsBalance(teamMatches: TeamMatches) {
    const goalsFavor = LeaderboardServiceUtils.calculateGoalsFavor(teamMatches);
    const goalsOwn = LeaderboardServiceUtils.calculateGoalsOwn(teamMatches);
    return goalsFavor - goalsOwn;
  }

  protected static calculateTotalVictories(teamMatches: TeamMatches) {
    return teamMatches.matches.reduce(
      (acc, v) => (v.homeTeamGoals > v.awayTeamGoals ? acc + 1 : acc),
      0,
    );
  }

  protected static calculateTotalDraws(teamMatches: TeamMatches) {
    return teamMatches.matches.reduce(
      (acc, v) => (v.homeTeamGoals === v.awayTeamGoals ? acc + 1 : acc),
      0,
    );
  }

  protected static calculateTotalLosses(teamMatches: TeamMatches) {
    return teamMatches.matches.reduce(
      (acc, v) => (v.homeTeamGoals < v.awayTeamGoals ? acc + 1 : acc),
      0,
    );
  }

  protected static calculateTotalGames(teamMatches: TeamMatches) {
    return teamMatches.matches.length;
  }
}
