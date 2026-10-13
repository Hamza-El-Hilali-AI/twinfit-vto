import { Download, FlipHorizontal, Maximize2, RefreshCw, RotateCcw, Sparkles } from "lucide-react";
import type { BlendMode, TransformState } from "../types";
import { clampTransform, defaultTransform } from "../utils/fit";

interface ControlPanelProps {
  transform: TransformState;
  canExport: boolean;
  onChange: (transform: TransformState) => void;
  onAutoFit: () => void;
  onExport: () => void;
}

const blendModes: Array<{ value: BlendMode; label: string }> = [
  { value: "source-over", label: "Normal" },
  { value: "multiply", label: "Multiply" },
  { value: "screen", label: "Screen" },
  { value: "overlay", label: "Overlay" },
  { value: "soft-light", label: "Soft" },
];

export function ControlPanel({ transform, canExport, onChange, onAutoFit, onExport }: ControlPanelProps) {
  const setValue = (key: keyof TransformState, value: number | boolean | BlendMode) => {
    onChange(clampTransform({ ...transform, [key]: value }));
  };

  return (
    <section className="panel control-panel">
      <div className="panel__header">
        <div>
          <p className="eyebrow">Try-On Controls</p>
          <h2>Fit Composer</h2>
        </div>
        <button className="icon-button" type="button" onClick={() => onChange(defaultTransform)} title="Reset controls">
          <RotateCcw size={17} />
        </button>
      </div>

      <div className="toolbar">
        <button className="primary-button" type="button" onClick={onAutoFit}>
          <Maximize2 size={17} />
          Auto Fit
        </button>
        <button className="primary-button" type="button" disabled={!canExport} onClick={onExport}>
          <Download size={17} />
          Export
        </button>
      </div>

      <Slider label="Scale" value={transform.scale} min={0.18} max={1.2} step={0.01} onChange={(value) => setValue("scale", value)} />
      <Slider label="Horizontal" value={transform.x} min={0.05} max={0.95} step={0.01} onChange={(value) => setValue("x", value)} />
      <Slider label="Vertical" value={transform.y} min={0.05} max={0.95} step={0.01} onChange={(value) => setValue("y", value)} />
      <Slider
        label="Rotation"
        value={transform.rotation}
        min={-35}
        max={35}
        step={1}
        onChange={(value) => setValue("rotation", value)}
      />
      <Slider
        label="Opacity"
        value={transform.opacity}
        min={0.2}
        max={1}
        step={0.01}
        onChange={(value) => setValue("opacity", value)}
      />

      <div className="field-group">
        <span className="field-label">Blend</span>
        <div className="segmented segmented--wrap">
          {blendModes.map((mode) => (
            <button
              type="button"
              key={mode.value}
              className={transform.blendMode === mode.value ? "is-active" : ""}
              onClick={() => setValue("blendMode", mode.value)}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      <div className="toggle-grid">
        <button
          type="button"
          className={`toggle-button ${transform.mirror ? "is-active" : ""}`}
          onClick={() => setValue("mirror", !transform.mirror)}
        >
          <FlipHorizontal size={17} />
          Mirror
        </button>
        <button
          type="button"
          className={`toggle-button ${transform.shadow ? "is-active" : ""}`}
          onClick={() => setValue("shadow", !transform.shadow)}
        >
          <Sparkles size={17} />
          Shadow
        </button>
        <button type="button" className="toggle-button" onClick={() => onChange({ ...transform, rotation: 0 })}>
          <RefreshCw size={17} />
          Level
        </button>
      </div>
    </section>
  );
}

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}

function Slider({ label, value, min, max, step, onChange }: SliderProps) {
  return (
    <label className="range-field">
      <span>
        {label}
        <strong>{formatValue(value, label)}</strong>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}

function formatValue(value: number, label: string) {
  if (label === "Rotation") {
    return `${value} deg`;
  }
  if (label === "Opacity") {
    return `${Math.round(value * 100)}%`;
  }
  return value.toFixed(2);
}
