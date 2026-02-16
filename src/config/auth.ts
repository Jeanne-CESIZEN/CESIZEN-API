const parseDurationToSeconds = (duration: string, fallback: number): number => {
  const trimmed = duration.trim();
  const match = trimmed.match(/^(\d+)([smhd])$/i);

  if (!match) {
    const asNumber = Number(trimmed);
    return Number.isFinite(asNumber) && asNumber > 0 ? asNumber : fallback;
  }

  const value = Number(match[1]);
  const unit = match[2].toLowerCase();

  if (unit === "s") return value;
  if (unit === "m") return value * 60;
  if (unit === "h") return value * 60 * 60;
  if (unit === "d") return value * 60 * 60 * 24;

  return fallback;
};

export const authConfig = {
  accessTokenSecret:
    process.env.JWT_ACCESS_SECRET || "dev-access-secret-change-me",
  refreshTokenSecret:
    process.env.JWT_REFRESH_SECRET || "dev-refresh-secret-change-me",
  accessTokenTtlSeconds: parseDurationToSeconds(
    process.env.JWT_ACCESS_TOKEN_TTL || "15m",
    900
  ),
  refreshTokenTtlSeconds: parseDurationToSeconds(
    process.env.JWT_REFRESH_TOKEN_TTL || "7d",
    604800
  ),
};
