import { Scissors, Shirt, Sparkles, Upload } from "lucide-react";
import type { CSSProperties } from "react";
import type { Garment, GarmentCategory, UploadedAsset } from "../types";
import { UploadDropzone } from "./UploadDropzone";

const categories: Array<{ id: "all" | GarmentCategory; label: string }> = [
  { id: "all", label: "All" },
  { id: "tops", label: "Tops" },
  { id: "outerwear", label: "Outerwear" },
  { id: "dresses", label: "Dresses" },
];

interface GarmentCatalogProps {
  garments: Garment[];
  selectedId?: string;
  customGarment?: UploadedAsset;
  activeCategory: "all" | GarmentCategory;
  onCategoryChange: (category: "all" | GarmentCategory) => void;
  onSelect: (garment: Garment) => void;
  onCustomUpload: (asset: UploadedAsset) => void;
  onUseCustom: () => void;
  onCleanCustom: () => void;
}

export function GarmentCatalog({
  garments,
  selectedId,
  customGarment,
  activeCategory,
  onCategoryChange,
  onSelect,
  onCustomUpload,
  onUseCustom,
  onCleanCustom,
}: GarmentCatalogProps) {
  return (
    <section className="panel catalog-panel">
      <div className="panel__header">
        <div>
          <p className="eyebrow">Garment Library</p>
          <h2>Collection</h2>
        </div>
        <span className="status-pill">
          <Shirt size={14} />
          {garments.length + (customGarment ? 1 : 0)}
        </span>
      </div>

      <div className="segmented" aria-label="Filter garments">
        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            className={activeCategory === category.id ? "is-active" : ""}
            onClick={() => onCategoryChange(category.id)}
          >
            {category.label}
          </button>
        ))}
      </div>

      <div className="garment-list">
        {garments.map((garment) => (
          <button
            className={`garment-card ${selectedId === garment.id ? "is-selected" : ""}`}
            key={garment.id}
            type="button"
            onClick={() => onSelect(garment)}
            style={{ "--accent": garment.accent } as CSSProperties}
          >
            <span className="garment-card__thumb">
              <img src={garment.src} alt="" />
            </span>
            <span className="garment-card__body">
              <span className="garment-card__name">{garment.name}</span>
              <span>{garment.brand}</span>
              <span className="garment-card__meta">{garment.fit} / {garment.fabric}</span>
            </span>
          </button>
        ))}
      </div>

      <div className="custom-garment">
        <UploadDropzone
          compact
          title="Custom Item"
          label="Upload Garment"
          preview={customGarment?.src}
          fileName={customGarment?.name}
          onUpload={onCustomUpload}
        />
        <div className="custom-garment__actions">
          <button className="secondary-button" type="button" disabled={!customGarment} onClick={onUseCustom}>
            <Upload size={16} />
            Use Item
          </button>
          <button className="secondary-button" type="button" disabled={!customGarment} onClick={onCleanCustom}>
            <Scissors size={16} />
            Clean BG
          </button>
        </div>
        <div className="hint-line">
          <Sparkles size={14} />
          {customGarment ? "Custom garment ready" : "Transparent files work best"}
        </div>
      </div>
    </section>
  );
}
