import { describe, expect, it } from "vitest";
import { clampTransform, defaultTransform, estimateMetrics, getAutoFitTransform } from "./fit";
import type { TwinProfile } from "../types";

const profile: TwinProfile = {
  heightCm: 176,
  build: "balanced",
  fitPreference: "true-to-size",
  privacyMode: true,
};

describe("fit utilities", () => {
  it("creates category-aware auto fit transforms", () => {
    const dress = getAutoFitTransform({ category: "dresses" }, profile);
    const top = getAutoFitTransform({ category: "tops" }, profile);

    expect(dress.y).toBeGreaterThan(top.y);
    expect(dress.scale).toBeGreaterThan(top.scale);
  });

  it("keeps transform values inside the supported canvas range", () => {
    const clamped = clampTransform({
      ...defaultTransform,
      x: 2,
      y: -1,
      scale: 4,
      rotation: 100,
      opacity: 0,
    });

    expect(clamped.x).toBe(0.95);
    expect(clamped.y).toBe(0.05);
    expect(clamped.scale).toBe(1.2);
    expect(clamped.rotation).toBe(35);
    expect(clamped.opacity).toBe(0.2);
  });

  it("estimates local processing cost as zero in privacy mode", () => {
    const metrics = estimateMetrics({ conversionLift: 15, returnReduction: 10 }, profile);

    expect(metrics.processingCost).toBe(0);
    expect(metrics.confidence).toBeGreaterThan(80);
  });
});
