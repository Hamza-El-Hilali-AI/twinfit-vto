import { Image, Trash2, UploadCloud } from "lucide-react";
import type { DragEvent } from "react";
import { useId, useState } from "react";
import { readImageFile } from "../utils/imageProcessing";

interface UploadDropzoneProps {
  title: string;
  label: string;
  preview?: string;
  fileName?: string;
  compact?: boolean;
  onUpload: (asset: { name: string; src: string }) => void;
  onClear?: () => void;
}

export function UploadDropzone({
  title,
  label,
  preview,
  fileName,
  compact,
  onUpload,
  onClear,
}: UploadDropzoneProps) {
  const inputId = useId();
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file || !file.type.startsWith("image/")) {
      return;
    }

    const src = await readImageFile(file);
    onUpload({ name: file.name, src });
  };

  const handleDrop = async (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragging(false);
    await handleFiles(event.dataTransfer.files);
  };

  return (
    <section className={`upload ${compact ? "upload--compact" : ""} ${isDragging ? "is-dragging" : ""}`}>
      <div className="upload__heading">
        <div>
          <p className="eyebrow">{title}</p>
          <h2>{label}</h2>
        </div>
        {preview && onClear ? (
          <button className="icon-button" type="button" onClick={onClear} title="Remove image">
            <Trash2 size={17} />
          </button>
        ) : null}
      </div>

      <label
        className="upload__target"
        htmlFor={inputId}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        {preview ? (
          <img src={preview} alt="" />
        ) : (
          <span className="upload__placeholder">
            <UploadCloud size={24} />
            <span>Drop image</span>
          </span>
        )}
        <input id={inputId} type="file" accept="image/*" onChange={(event) => handleFiles(event.target.files)} />
      </label>

      <div className="upload__footer">
        <span>
          <Image size={15} />
          {fileName || "PNG, JPG, WebP"}
        </span>
      </div>
    </section>
  );
}
