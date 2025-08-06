export function getLevelTitle(level: number) {
    const titles = [
        "Disaster Explorer",
        "Disaster Aware",
        "Prepared Rookie",
        "Risk Responder",
        "Disaster Prepared",
    ];
    return titles[Math.min(level - 1, titles.length - 1)];
}
