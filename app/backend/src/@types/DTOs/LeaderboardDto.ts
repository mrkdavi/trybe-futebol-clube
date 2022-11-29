import Matches from '../../database/models/Matches';

export interface TeamMatchesModel {
  id: number;
  teamName: string;
}

export interface TeamMatchesHomeModel extends TeamMatchesModel {
  teamHome: Matches[];
}

export interface TeamMatchesAwayModel extends TeamMatchesModel {
  teamAway: Matches[];
}

export interface TeamMatchesGeneralModel
  extends TeamMatchesModel,
  TeamMatchesHomeModel,
  TeamMatchesAwayModel {
}

export interface TeamMatches {
  id: number;
  name: string;
  matches: Matches[];
}

export interface LeaderboardDto {
  name: string;
  totalPoints: number;
  totalGames: number;
  totalVictories: number;
  totalDraws: number;
  totalLosses: number;
  goalsFavor: number;
  goalsOwn: number;
  goalsBalance: number;
  efficiency: number;
}
