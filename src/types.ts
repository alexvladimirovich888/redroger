export interface LeaderboardEntry {
  rank: number;
  wallet: string;
  profit: number; // in $ or fake points
  share: number;  // percentage
  received: string; // formatted string e.g. "1.82M"
}

export interface JudgementResult {
  title: string;
  profit: string;
  share: string;
  reward: string;
  status: 'worthy' | 'unworthy' | 'mighty' | 'legendary';
  description: string;
}
