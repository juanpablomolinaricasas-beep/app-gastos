import { Badge, BADGE_TIERS, BadgeType } from '../types';

export function initialBadges(): Badge[] {
  const types: BadgeType[] = ['constancia', 'ahorro'];
  return types.flatMap((type) =>
    BADGE_TIERS.map((tier) => ({ id: `${type}-${tier}`, type, tier, unlockedAt: null }))
  );
}

/** Unlocks badges permanently once a streak reaches their tier; already-unlocked badges are untouched. */
export function unlockEligibleBadges(
  badges: Badge[],
  type: BadgeType,
  currentStreak: number,
  now: string
): Badge[] {
  return badges.map((b) => {
    if (b.type === type && b.unlockedAt === null && currentStreak >= b.tier) {
      return { ...b, unlockedAt: now };
    }
    return b;
  });
}
