import type { Garment, StudioMetrics, TransformState, TwinProfile } from "../types";

export const defaultTransform: TransformState = {
  x: 0.5,
  y: 0.41,
  scale: 0.52,
  rotation: 0,
  opacity: 0.94,
  blendMode: "source-over",
  mirror: false,
  shadow: true,
};

const preferenceScale = {
  relaxed: 1.06,
  "true-to-size": 1,
  snug: 0.95,
} as const;

const buildScale = {
  balanced: 1,
  athletic: 1.03,
  curvy: 1.05,
  slim: 0.96,
} as const;

const categoryYOffset = {
  tops: 0.4,
  outerwear: 0.43,
  dresses: 0.5,
  sets: 0.46,
} as const;

const categoryScale = {
  tops: 0.5,
  outerwear: 0.58,
  dresses: 0.62,
  sets: 0.56,
} as const;

export function getAutoFitTransform(
  garment: Pick<Garment, "category"> | undefined,
  profile: Pick<TwinProfile, "build" | "fitPreference">,
): TransformState {
  const category = garment?.category ?? "tops";
  return {
    ...defaultTransform,
    y: categoryYOffset[category],
    scale: Number(
      (categoryScale[category] * preferenceScale[profile.fitPreference] * buildScale[profile.build]).toFixed(2),
    ),
  };
}

export function estimateMetrics(
  garment: Pick<Garment, "conversionLift" | "returnReduction"> | undefined,
  profile: TwinProfile,
): StudioMetrics {
  const fitBoost = profile.fitPreference === "true-to-size" ? 4 : profile.fitPreference === "relaxed" ? 2 : 1;
  const buildBoost = profile.build === "balanced" ? 3 : 2;
  const confidence = Math.min(98, 73 + fitBoost + buildBoost + (garment?.returnReduction ?? 8));
  const conversionLift = Math.round((garment?.conversionLift ?? 12) + fitBoost);
  const returnReduction = Math.round((garment?.returnReduction ?? 8) + buildBoost);
  const processingCost = profile.privacyMode ? 0 : 2;

  return {
    confidence,
    conversionLift,
    returnReduction,
    processingCost,
  };
}

export function clampTransform(transform: TransformState): TransformState {
  return {
    ...transform,
    x: Math.min(0.95, Math.max(0.05, transform.x)),
    y: Math.min(0.95, Math.max(0.05, transform.y)),
    scale: Math.min(1.2, Math.max(0.18, transform.scale)),
    rotation: Math.min(35, Math.max(-35, transform.rotation)),
    opacity: Math.min(1, Math.max(0.2, transform.opacity)),
  };
}
