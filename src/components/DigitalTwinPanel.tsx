import { Lock, Ruler, UserRound } from "lucide-react";
import type { BodyBuild, FitPreference, TwinProfile } from "../types";

interface DigitalTwinPanelProps {
  profile: TwinProfile;
  onChange: (profile: TwinProfile) => void;
}

const buildOptions: Array<{ value: BodyBuild; label: string }> = [
  { value: "balanced", label: "Balanced" },
  { value: "athletic", label: "Athletic" },
  { value: "curvy", label: "Curvy" },
  { value: "slim", label: "Slim" },
];

const fitOptions: Array<{ value: FitPreference; label: string }> = [
  { value: "relaxed", label: "Relaxed" },
  { value: "true-to-size", label: "True" },
  { value: "snug", label: "Snug" },
];

export function DigitalTwinPanel({ profile, onChange }: DigitalTwinPanelProps) {
  return (
    <section className="panel twin-panel">
      <div className="panel__header">
        <div>
          <p className="eyebrow">Digital Twin</p>
          <h2>Profile</h2>
        </div>
        <span className="status-pill status-pill--green">
          <Lock size={14} />
          Local
        </span>
      </div>

      <label className="number-field">
        <span>
          <Ruler size={16} />
          Height
        </span>
        <input
          type="number"
          min={120}
          max={230}
          value={profile.heightCm}
          onChange={(event) => onChange({ ...profile, heightCm: Number(event.target.value) })}
        />
      </label>

      <div className="field-group">
        <span className="field-label">
          <UserRound size={16} />
          Build
        </span>
        <div className="segmented segmented--wrap">
          {buildOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              className={profile.build === option.value ? "is-active" : ""}
              onClick={() => onChange({ ...profile, build: option.value })}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="field-group">
        <span className="field-label">Preferred Fit</span>
        <div className="segmented">
          {fitOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              className={profile.fitPreference === option.value ? "is-active" : ""}
              onClick={() => onChange({ ...profile, fitPreference: option.value })}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <label className="switch-row">
        <span>
          <Lock size={16} />
          Privacy Mode
        </span>
        <input
          type="checkbox"
          checked={profile.privacyMode}
          onChange={(event) => onChange({ ...profile, privacyMode: event.target.checked })}
        />
      </label>
    </section>
  );
}
