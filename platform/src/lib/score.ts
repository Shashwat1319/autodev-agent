type ScoreTier = 'high' | 'medium' | 'low';

function getScoreTier(score: number): ScoreTier {
  if (score >= 70) return 'high';
  if (score >= 40) return 'medium';
  return 'low';
}

export function getScoreHex(score: number): string {
  const colors: Record<ScoreTier, string> = {
    high: '#4caf50',
    medium: '#ff9800',
    low: '#f44336',
  };
  return colors[getScoreTier(score)];
}

export function getScoreLabel(score: number): string {
  const labels: Record<ScoreTier, string> = {
    high: 'Great',
    medium: 'Okay',
    low: 'Needs Work',
  };
  return labels[getScoreTier(score)];
}

export function getScoreShieldsColor(score: number): string {
  const colors: Record<ScoreTier, string> = {
    high: 'brightgreen',
    medium: 'yellow',
    low: 'red',
  };
  return colors[getScoreTier(score)];
}
