export type GarmentCategory = "tops" | "outerwear" | "dresses" | "sets";

export type BlendMode = "source-over" | "multiply" | "screen" | "overlay" | "soft-light";

export type BodyBuild = "balanced" | "athletic" | "curvy" | "slim";

export type FitPreference = "relaxed" | "true-to-size" | "snug";

export interface Garment {
  id: string;
  name: string;
  brand: string;
  category: GarmentCategory;
  fit: string;
  fabric: string;
  color: string;
  src: string;
  accent: string;
  conversionLift: number;
  returnReduction: number;
}

export interface UploadedAsset {
  name: string;
  src: string;
}

export interface TransformState {
  x: number;
  y: number;
  scale: number;
  rotation: number;
  opacity: number;
  blendMode: BlendMode;
  mirror: boolean;
  shadow: boolean;
}

export interface TwinProfile {
  heightCm: number;
  build: BodyBuild;
  fitPreference: FitPreference;
  privacyMode: boolean;
}

export interface StudioMetrics {
  confidence: number;
  conversionLift: number;
  returnReduction: number;
  processingCost: number;
}
