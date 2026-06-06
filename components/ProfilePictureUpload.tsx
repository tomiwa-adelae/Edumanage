"use client";
import React, { useRef, useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import {
  IconPhoto,
  IconX,
  IconRotateClockwise,
  IconZoomIn,
  IconZoomOut,
  IconUpload,
} from "@tabler/icons-react";

interface Props {
  isOpen?: boolean;
  onClose?: () => void;
  onUpload?: (croppedImage: string) => void;
  currentImage?: string | null | undefined;
}

export const ProfilePictureUpload = ({
  isOpen = true,
  onClose,
  onUpload,
  currentImage,
}: Props) => {
  const [image, setImage] = useState<string | null>(currentImage || null);
  const [isDragging, setIsDragging] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) {
      handleFile(droppedFiles[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (
      !["image/png", "image/jpeg", "image/jpg", "image/webp"].includes(
        file.type
      )
    ) {
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new window.Image();
      img.src = reader.result as string;
      img.onload = () => {
        const containerSize = containerRef.current?.offsetWidth || 400;
        const cropDiameter = containerSize * 0.9; // 90% of container

        // Fit entire image into crop circle
        const scaleToFitWidth = cropDiameter / img.width;
        const scaleToFitHeight = cropDiameter / img.height;
        const initialZoom = Math.min(scaleToFitWidth, scaleToFitHeight);

        setImage(reader.result as string);
        setZoom(Math.max(0.5, Math.min(3, initialZoom)));
        setRotation(0);
        setPosition({ x: 0, y: 0 });
      };
    };
    reader.readAsDataURL(file);
  };

  const handleBrowse = () => {
    fileInputRef.current?.click();
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!image) return;
    setIsDraggingImage(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingImage) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDraggingImage(false);
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  async function getCroppedImage(
    imageSrc: string,
    crop: { x: number; y: number },
    zoom: number,
    rotation: number
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      img.crossOrigin = "anonymous";
      img.src = imageSrc;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject("Canvas not supported");
          return;
        }

        // Get actual container dimensions
        const containerSize = containerRef.current?.offsetWidth || 400;
        const cropRadius = containerSize * 0.45; // 45% radius to match overlay

        const outputSize = 512; // final cropped image size
        canvas.width = outputSize;
        canvas.height = outputSize;

        // Calculate scale: how much bigger should we draw to fill the crop circle
        const scale = outputSize / (cropRadius * 2);

        // clip to circle mask
        ctx.save();
        ctx.beginPath();
        ctx.arc(outputSize / 2, outputSize / 2, outputSize / 2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();

        // move origin to center
        ctx.translate(outputSize / 2, outputSize / 2);

        // apply rotation
        ctx.rotate((rotation * Math.PI) / 180);

        // apply zoom with scale adjustment
        const finalScale = zoom * scale;
        ctx.scale(finalScale, finalScale);

        // Adjust position based on scale
        const scaledX = crop.x / scale;
        const scaledY = crop.y / scale;

        // draw image centered with position offset
        ctx.drawImage(img, scaledX - img.width / 2, scaledY - img.height / 2);

        ctx.restore();

        // return circular PNG
        const dataUrl = canvas.toDataURL("image/png");
        resolve(dataUrl);
      };

      img.onerror = (err) => reject(err);
    });
  }

  const handleUpload = async () => {
    if (!image) return;

    const croppedImage = await getCroppedImage(image, position, zoom, rotation);
    if (croppedImage && onUpload) {
      onUpload(croppedImage);
    }
    if (onClose) {
      onClose();
    }
  };

  const handleRemove = () => {
    setImage(null);
    setZoom(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="flex flex-col gap-0 overflow-hidden max-h-[70vh] max-w-[90vw] sm:max-w-xl sm:max-h-[min(640px,80vh)]">
        <AlertDialogHeader className="flex flex-row items-center justify-between gap-1 pb-4">
          <AlertDialogTitle>Upload Profile Picture</AlertDialogTitle>
          <Button size="icon" variant="ghost" onClick={onClose}>
            <IconX />
          </Button>
        </AlertDialogHeader>

        <div className="overflow-y-auto custom-scroll space-y-4 py-4">
          {!image ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-md p-12 text-center transition-colors ${
                isDragging
                  ? "border-primary/50 bg-primary/50"
                  : "border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-950"
              }`}
            >
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <IconPhoto size={32} className="text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Drop your image here, or{" "}
                    <button
                      onClick={handleBrowse}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      browse
                    </button>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Supports: PNG, JPG, JPEG, WEBP
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Image Preview Container */}
              <div
                ref={containerRef}
                className="relative w-full aspect-square bg-gray-100 rounded-md overflow-hidden"
              >
                {/* Circular Crop Overlay */}
                <div className="absolute inset-0 pointer-events-none z-10">
                  <svg className="w-full h-full">
                    <defs>
                      <mask id="circleMask">
                        <rect width="100%" height="100%" fill="white" />
                        <circle cx="50%" cy="50%" r="45%" fill="black" />
                      </mask>
                    </defs>
                    <rect
                      width="100%"
                      height="100%"
                      fill="black"
                      opacity="0.5"
                      mask="url(#circleMask)"
                    />
                    <circle
                      cx="50%"
                      cy="50%"
                      r="45%"
                      fill="none"
                      stroke="white"
                      strokeWidth="2"
                      strokeDasharray="5,5"
                    />
                  </svg>
                </div>

                {/* Image */}
                <div
                  className="absolute inset-0 cursor-move"
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  style={{ touchAction: "none" }}
                >
                  <img
                    src={image}
                    alt="Preview"
                    className="absolute top-1/2 left-1/2 max-w-none select-none"
                    draggable={false}
                    style={{
                      transform: `translate(-50%, -50%) translate(${position.x}px, ${position.y}px) scale(${zoom}) rotate(${rotation}deg)`,
                      transformOrigin: "center",
                    }}
                  />
                </div>
              </div>

              {/* Controls */}
              <div className="space-y-4">
                {/* Zoom Slider */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Zoom</label>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
                      >
                        <IconZoomOut size={16} />
                      </Button>
                      <span className="text-xs text-muted-foreground w-12 text-center">
                        {Math.round(zoom * 100)}%
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setZoom(Math.min(3, zoom + 0.1))}
                      >
                        <IconZoomIn size={16} />
                      </Button>
                    </div>
                  </div>
                  <Slider
                    value={[zoom]}
                    onValueChange={(value) => setZoom(value[0])}
                    min={0.5}
                    max={3}
                    step={0.1}
                    className="w-full"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={handleRotate}
                  >
                    <IconRotateClockwise size={16} className="mr-2" />
                    Rotate
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={handleRemove}
                  >
                    <IconX size={16} className="mr-2" />
                    Remove
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={handleBrowse}
                  >
                    <IconUpload size={16} className="mr-2" />
                    Replace
                  </Button>
                </div>
              </div>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        <AlertDialogFooter className="border-t pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" onClick={handleUpload} disabled={!image}>
            Save Picture
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
