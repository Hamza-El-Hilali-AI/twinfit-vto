import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import type { TransformState } from "../types";
import { clampTransform } from "../utils/fit";
import { loadImage } from "../utils/imageProcessing";

interface StudioCanvasProps {
  personSrc?: string;
  garmentSrc?: string;
  transform: TransformState;
  onTransformChange: (transform: TransformState) => void;
}

export interface StudioCanvasHandle {
  exportPng: () => string | undefined;
}

type LoadedImage = HTMLImageElement | undefined;

const CANVAS_WIDTH = 900;
const CANVAS_HEIGHT = 1200;

export const StudioCanvas = forwardRef<StudioCanvasHandle, StudioCanvasProps>(
  ({ personSrc, garmentSrc, transform, onTransformChange }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [personImage, setPersonImage] = useState<LoadedImage>();
    const [garmentImage, setGarmentImage] = useState<LoadedImage>();
    const dragRef = useRef<{ startX: number; startY: number; originX: number; originY: number } | null>(null);

    useImperativeHandle(ref, () => ({
      exportPng: () => {
        draw();
        return canvasRef.current?.toDataURL("image/png");
      },
    }));

    useEffect(() => {
      let active = true;
      if (!personSrc) {
        setPersonImage(undefined);
        return;
      }

      loadImage(personSrc)
        .then((image) => active && setPersonImage(image))
        .catch(() => active && setPersonImage(undefined));

      return () => {
        active = false;
      };
    }, [personSrc]);

    useEffect(() => {
      let active = true;
      if (!garmentSrc) {
        setGarmentImage(undefined);
        return;
      }

      loadImage(garmentSrc)
        .then((image) => active && setGarmentImage(image))
        .catch(() => active && setGarmentImage(undefined));

      return () => {
        active = false;
      };
    }, [garmentSrc]);

    useEffect(() => {
      draw();
    }, [personImage, garmentImage, transform]);

    const getCanvasPoint = (event: React.PointerEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      const rect = canvas?.getBoundingClientRect();
      if (!canvas || !rect) {
        return { x: 0, y: 0 };
      }

      return {
        x: ((event.clientX - rect.left) / rect.width) * CANVAS_WIDTH,
        y: ((event.clientY - rect.top) / rect.height) * CANVAS_HEIGHT,
      };
    };

    const handlePointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
      if (!garmentImage) {
        return;
      }

      const point = getCanvasPoint(event);
      dragRef.current = {
        startX: point.x,
        startY: point.y,
        originX: transform.x,
        originY: transform.y,
      };
      event.currentTarget.setPointerCapture(event.pointerId);
    };

    const handlePointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
      if (!dragRef.current) {
        return;
      }

      const point = getCanvasPoint(event);
      const next = clampTransform({
        ...transform,
        x: dragRef.current.originX + (point.x - dragRef.current.startX) / CANVAS_WIDTH,
        y: dragRef.current.originY + (point.y - dragRef.current.startY) / CANVAS_HEIGHT,
      });
      onTransformChange(next);
    };

    const stopDrag = (event: React.PointerEvent<HTMLCanvasElement>) => {
      dragRef.current = null;
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
    };

    function draw() {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) {
        return;
      }

      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      drawBackdrop(ctx);
      const photoRect = personImage
        ? drawContainedImage(ctx, personImage, 44, 42, CANVAS_WIDTH - 88, CANVAS_HEIGHT - 84)
        : drawSilhouette(ctx);

      drawFloor(ctx);
      if (garmentImage) {
        drawGarment(ctx, garmentImage, transform, photoRect);
      }
      drawFrame(ctx);
    }

    return (
      <div className="studio-frame">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className={garmentImage ? "studio-canvas is-draggable" : "studio-canvas"}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={stopDrag}
          onPointerCancel={stopDrag}
          aria-label="Virtual try-on preview"
        />
      </div>
    );
  },
);

function drawBackdrop(ctx: CanvasRenderingContext2D) {
  const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
  gradient.addColorStop(0, "#f7f8f4");
  gradient.addColorStop(0.55, "#eef2ef");
  gradient.addColorStop(1, "#d9e0dd");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  ctx.strokeStyle = "rgba(33, 45, 44, 0.06)";
  ctx.lineWidth = 1;
  for (let x = 90; x < CANVAS_WIDTH; x += 90) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, CANVAS_HEIGHT);
    ctx.stroke();
  }
}

function drawSilhouette(ctx: CanvasRenderingContext2D) {
  const rect = { x: 135, y: 96, width: 630, height: 1020 };
  ctx.save();
  ctx.translate(CANVAS_WIDTH / 2, 0);
  ctx.fillStyle = "#d6ded9";
  ctx.beginPath();
  ctx.arc(0, 185, 70, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#c2cec8";
  roundedRect(ctx, -125, 270, 250, 410, 96);
  ctx.fill();
  ctx.fillStyle = "#b6c3bd";
  roundedRect(ctx, -205, 332, 86, 430, 42);
  roundedRect(ctx, 119, 332, 86, 430, 42);
  roundedRect(ctx, -106, 662, 82, 366, 38);
  roundedRect(ctx, 24, 662, 82, 366, 38);
  ctx.fill();
  ctx.restore();
  return rect;
}

function drawFloor(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = "rgba(34, 44, 43, 0.08)";
  ctx.beginPath();
  ctx.ellipse(CANVAS_WIDTH / 2, 1090, 270, 36, 0, 0, Math.PI * 2);
  ctx.fill();
}

function drawFrame(ctx: CanvasRenderingContext2D) {
  ctx.strokeStyle = "rgba(24, 34, 36, 0.1)";
  ctx.lineWidth = 2;
  roundedRect(ctx, 28, 28, CANVAS_WIDTH - 56, CANVAS_HEIGHT - 56, 36);
  ctx.stroke();
}

function drawContainedImage(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  x: number,
  y: number,
  width: number,
  height: number,
) {
  const ratio = Math.min(width / image.naturalWidth, height / image.naturalHeight);
  const drawWidth = image.naturalWidth * ratio;
  const drawHeight = image.naturalHeight * ratio;
  const drawX = x + (width - drawWidth) / 2;
  const drawY = y + (height - drawHeight) / 2;

  ctx.save();
  roundedRect(ctx, drawX, drawY, drawWidth, drawHeight, 28);
  ctx.clip();
  ctx.drawImage(image, drawX, drawY, drawWidth, drawHeight);
  ctx.restore();

  return { x: drawX, y: drawY, width: drawWidth, height: drawHeight };
}

function drawGarment(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  transform: TransformState,
  photoRect: { x: number; y: number; width: number; height: number },
) {
  const garmentWidth = photoRect.width * transform.scale;
  const garmentHeight = garmentWidth * (image.naturalHeight / image.naturalWidth);
  const centerX = photoRect.x + photoRect.width * transform.x;
  const centerY = photoRect.y + photoRect.height * transform.y;

  ctx.save();
  ctx.globalAlpha = transform.opacity;
  ctx.globalCompositeOperation = transform.blendMode;
  ctx.translate(centerX, centerY);
  ctx.rotate((transform.rotation * Math.PI) / 180);
  ctx.scale(transform.mirror ? -1 : 1, 1);

  if (transform.shadow) {
    ctx.shadowColor = "rgba(10, 18, 18, 0.26)";
    ctx.shadowBlur = 28;
    ctx.shadowOffsetY = 22;
  }

  ctx.drawImage(image, -garmentWidth / 2, -garmentHeight / 2, garmentWidth, garmentHeight);
  ctx.restore();
}

function roundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
}
