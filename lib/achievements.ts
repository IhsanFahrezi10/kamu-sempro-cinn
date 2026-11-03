"use client";
import { useEffect, useState } from "react";

export type AchievementKey = "gift" | "music" | "fortune" | "jump" | "catch" | "quiz" | "kit" | "wish" | "sticker" | "share" | "konami" | "error";

const KEY = "cinn-achievements-v4";

export const ACHIEVEMENT_META: Record<AchievementKey, { label: string; emoji: string }> = {
  gift: { label: "Buka kado", emoji: "🎁" },
  music: { label: "Nyalain musik", emoji: "🎵" },
  fortune: { label: "Matcha flip", emoji: "🍵" },
  jump: { label: "Jumpin' Cat", emoji: "🐾" },
  catch: { label: "Tangkap ikan", emoji: "🐟" },
  quiz: { label: "Quiz", emoji: "📝" },
  kit: { label: "Celebration kit", emoji: "🎒" },
  wish: { label: "Kasih makan", emoji: "🍖" },
  sticker: { label: "Buka stiker", emoji: "🌸" },
  share: { label: "Share", emoji: "📤" },
  konami: { label: "Easter egg", emoji: "🎮" },
  error: { label: "Error palsu", emoji: "💥" },
};

export function unlock(key: AchievementKey) {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(KEY);
    const set = new Set<AchievementKey>(raw ? JSON.parse(raw) : []);
    if (set.has(key)) return;
    set.add(key);
    localStorage.setItem(KEY, JSON.stringify([...set]));
    window.dispatchEvent(new Event("achievement-unlocked"));
  } catch {}
}

export function useAchievements(): Set<AchievementKey> {
  const [set, setSet] = useState<Set<AchievementKey>>(new Set());
  useEffect(() => {
    const update = () => {
      try {
        const raw = localStorage.getItem(KEY);
        setSet(new Set(raw ? JSON.parse(raw) : []));
      } catch {}
    };
    update();
    window.addEventListener("achievement-unlocked", update);
    return () => window.removeEventListener("achievement-unlocked", update);
  }, []);
  return set;
}

export const ALL_ACHIEVEMENTS: AchievementKey[] = ["gift", "music", "fortune", "jump", "catch", "quiz", "kit", "wish", "sticker", "share", "konami", "error"];
