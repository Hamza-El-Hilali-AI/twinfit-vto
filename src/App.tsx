import { Github, Lock, Sparkles } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { ControlPanel } from "./components/ControlPanel";
import { DigitalTwinPanel } from "./components/DigitalTwinPanel";
import { GarmentCatalog } from "./components/GarmentCatalog";
import { InsightPanel } from "./components/InsightPanel";
import { StudioCanvas, type StudioCanvasHandle } from "./components/StudioCanvas";
import { UploadDropzone } from "./components/UploadDropzone";
import { garments as catalogGarments } from "./data/garments";
import type { Garment, GarmentCategory, TransformState, TwinProfile, UploadedAsset } from "./types";
import { downloadDataUrl, removeLightBackground } from "./utils/imageProcessing";
import { defaultTransform, estimateMetrics, getAutoFitTransform } from "./utils/fit";
import "./App.css";

const customGarmentTemplate: Omit<Garment, "src"> = {
  id: "custom-garment",
  name: "Custom garment",
  brand: "Uploaded",
  category: "tops",
  fit: "Manual",
  fabric: "Uploaded file",
  color: "Original",
  accent: "#5f7c70",
  conversionLift: 13,
  returnReduction: 10,
};

const initialProfile: TwinProfile = {
  heightCm: 176,
  build: "balanced",
  fitPreference: "true-to-size",
  privacyMode: true,
};

function App() {
  const canvasRef = useRef<StudioCanvasHandle | null>(null);
  const [person, setPerson] = useState<UploadedAsset>();
  const [customGarment, setCustomGarment] = useState<UploadedAsset>();
  const [selectedGarment, setSelectedGarment] = useState<Garment>(catalogGarments[0]);
  const [activeCategory, setActiveCategory] = useState<"all" | GarmentCategory>("all");
  const [profile, setProfile] = useState<TwinProfile>(initialProfile);
  const [transform, setTransform] = useState<TransformState>(defaultTransform);
  const [isCleaning, setIsCleaning] = useState(false);

  const visibleGarments = useMemo(
    () => (activeCategory === "all" ? catalogGarments : catalogGarments.filter((garment) => garment.category === activeCategory)),
    [activeCategory],
  );

  const metrics = useMemo(() => estimateMetrics(selectedGarment, profile), [selectedGarment, profile]);

  const handleGarmentSelect = (garment: Garment) => {
    setSelectedGarment(garment);
    setTransform(getAutoFitTransform(garment, profile));
  };

  const handleUseCustom = () => {
    if (!customGarment) {
      return;
    }

    const garment = {
      ...customGarmentTemplate,
      src: customGarment.src,
    };
    setSelectedGarment(garment);
    setTransform(getAutoFitTransform(garment, profile));
  };

  const handleCleanCustom = async () => {
    if (!customGarment) {
      return;
    }

    setIsCleaning(true);
    try {
      const cleaned = await removeLightBackground(customGarment.src);
      const nextAsset = { ...customGarment, src: cleaned, name: `${customGarment.name.replace(/\.[^.]+$/, "")}-clean.png` };
      setCustomGarment(nextAsset);
      if (selectedGarment.id === "custom-garment") {
        setSelectedGarment({ ...customGarmentTemplate, src: cleaned });
      }
    } finally {
      setIsCleaning(false);
    }
  };

  const handleAutoFit = () => {
    setTransform(getAutoFitTransform(selectedGarment, profile));
  };

  const handleExport = () => {
    const dataUrl = canvasRef.current?.exportPng();
    if (dataUrl) {
      downloadDataUrl(dataUrl, `twinfit-${Date.now()}.png`);
    }
  };

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand-lockup">
          <div className="brand-mark">
            <Sparkles size={22} />
          </div>
          <div>
            <p>TwinFit Studio</p>
            <span>Virtual Try-On Workspace</span>
          </div>
        </div>

        <div className="topbar__actions">
          <span className="status-pill status-pill--green">
            <Lock size={14} />
            Local-First
          </span>
          <a className="secondary-button" href="https://github.com/MarkusSmart" target="_blank" rel="noreferrer">
            <Github size={16} />
            GitHub
          </a>
        </div>
      </header>

      <section className="workspace">
        <aside className="left-rail">
          <UploadDropzone
            title="Customer"
            label="Model Photo"
            preview={person?.src}
            fileName={person?.name}
            onUpload={setPerson}
            onClear={() => setPerson(undefined)}
          />
          <GarmentCatalog
            garments={visibleGarments}
            selectedId={selectedGarment.id}
            customGarment={customGarment}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            onSelect={handleGarmentSelect}
            onCustomUpload={setCustomGarment}
            onUseCustom={handleUseCustom}
            onCleanCustom={handleCleanCustom}
          />
          {isCleaning ? <div className="toast">Cleaning garment background...</div> : null}
        </aside>

        <section className="center-stage">
          <div className="stage-toolbar">
            <div>
              <p className="eyebrow">Live Preview</p>
              <h1>{selectedGarment.name}</h1>
            </div>
            <div className="stage-toolbar__meta">
              <span>{selectedGarment.color}</span>
              <span>{selectedGarment.fit}</span>
            </div>
          </div>

          <StudioCanvas
            ref={canvasRef}
            personSrc={person?.src}
            garmentSrc={selectedGarment.src}
            transform={transform}
            onTransformChange={setTransform}
          />
        </section>

        <aside className="right-rail">
          <ControlPanel
            transform={transform}
            canExport={Boolean(selectedGarment.src)}
            onChange={setTransform}
            onAutoFit={handleAutoFit}
            onExport={handleExport}
          />
          <DigitalTwinPanel profile={profile} onChange={setProfile} />
          <InsightPanel garment={selectedGarment} metrics={metrics} profile={profile} />
        </aside>
      </section>
    </main>
  );
}

export default App;
