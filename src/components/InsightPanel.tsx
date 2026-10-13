import { BarChart3, ShieldCheck, TrendingDown, TrendingUp } from "lucide-react";
import type { ReactNode } from "react";
import type { Garment, StudioMetrics, TwinProfile } from "../types";

interface InsightPanelProps {
  garment?: Garment;
  metrics: StudioMetrics;
  profile: TwinProfile;
}

export function InsightPanel({ garment, metrics, profile }: InsightPanelProps) {
  return (
    <section className="panel insight-panel">
      <div className="panel__header">
        <div>
          <p className="eyebrow">Retail Impact</p>
          <h2>E-S-C Snapshot</h2>
        </div>
        <span className="status-pill">
          <BarChart3 size={14} />
          Live
        </span>
      </div>

      <div className="metric-grid">
        <Metric icon={<ShieldCheck size={18} />} label="Confidence" value={`${metrics.confidence}%`} tone="green" />
        <Metric icon={<TrendingUp size={18} />} label="Conversion" value={`+${metrics.conversionLift}%`} tone="blue" />
        <Metric icon={<TrendingDown size={18} />} label="Returns" value={`-${metrics.returnReduction}%`} tone="red" />
      </div>

      <div className="decision-strip">
        <div>
          <span>Selected</span>
          <strong>{garment?.name ?? "Custom garment"}</strong>
        </div>
        <div>
          <span>Profile</span>
          <strong>{profile.build} / {profile.fitPreference}</strong>
        </div>
      </div>

      <div className="privacy-box">
        <ShieldCheck size={18} />
        <div>
          <strong>{profile.privacyMode ? "Browser-only session" : "Cloud-ready mode"}</strong>
          <span>{profile.privacyMode ? "Images stay on this device." : "Ready for provider-side AI inference."}</span>
        </div>
      </div>
    </section>
  );
}

interface MetricProps {
  icon: ReactNode;
  label: string;
  value: string;
  tone: "green" | "blue" | "red";
}

function Metric({ icon, label, value, tone }: MetricProps) {
  return (
    <div className={`metric metric--${tone}`}>
      <span>{icon}</span>
      <strong>{value}</strong>
      <small>{label}</small>
    </div>
  );
}
