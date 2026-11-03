export type ReceiptData = {
  date: string;
  time: string;
  orderId: string;
  achievements: string[];
  scores: Record<string, number>;
  totalItems: number;
  totalScore: number;
};

const SCORES_KEY = "cinn-game-scores-v1";

export function saveGameScore(game: string, score: number) {
  if (typeof window === "undefined") return;
  try {
    const raw = sessionStorage.getItem(SCORES_KEY);
    const scores: Record<string, number> = raw ? JSON.parse(raw) : {};
    if (score > (scores[game] ?? 0)) {
      scores[game] = score;
      sessionStorage.setItem(SCORES_KEY, JSON.stringify(scores));
    }
  } catch {}
}

export function getGameScores(): Record<string, number> {
  if (typeof window === "undefined") return {};
  try {
    const raw = sessionStorage.getItem(SCORES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function getUnlockedAchievements(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("cinn-achievements-v4");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function generateOrderId(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}
