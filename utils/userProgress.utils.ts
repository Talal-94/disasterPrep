export function getLevelTitle(level: number, lang: string) {
  const titles = lang.startsWith("en") ? [
    "Disaster Explorer",
    "Disaster Aware",
    "Prepared Rookie",
    "Disaster Prepared",
    "Risk Responder",
  ] : [
    "مستكشف الكوارث",
    "واعٍ بالمخاطر",
    "مبتدئ مُستعد",
    "مستعد للكوارث",
    "مستجيب للمخاطر",
  ];
  return titles[Math.min(level - 1, titles.length - 1)];
}

export const LEVEL_CAPS = [0, 100, 200, 300, 400, 500];

export function getLevelFromXP(xp: number) {
  let level = 1;
  while (level < LEVEL_CAPS.length && xp >= LEVEL_CAPS[level]) level++;
  return level;
}

export function getLevelBounds(xp: number) {
  const level = getLevelFromXP(xp);
  const prevCap = LEVEL_CAPS[level - 1];
  const nextCap = LEVEL_CAPS[level] ?? prevCap + 100;
  return { level, prevCap, nextCap };
}
