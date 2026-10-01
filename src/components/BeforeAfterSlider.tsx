"use client";

import React, { useState, useRef, useCallback } from "react";
import { CheckCircle2, MoveHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

interface BeforeAfterSliderProps {
  avantUrl: string;
  apresUrl: string;
  title: string;
  description?: string;
  date?: string;
  className?: string;
}

export function BeforeAfterSlider({
  avantUrl,
  apresUrl,
  title,
  description,
  date,
  className,
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let percentage = (x / rect.width) * 100;
    if (percentage < 0) percentage = 0;
    if (percentage > 100) percentage = 100;
    setSliderPosition(percentage);
  }, []);

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      handleMove(e.clientX);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches[0]) {
      handleMove(e.touches[0].clientX);
    }
  };

  return (
    <div className={cn("overflow-hidden rounded-2xl border border-border bg-white shadow-soft transition-all duration-200 hover:shadow-soft-md", className)}>
      <div className="p-4 sm:p-5 border-b border-border/80">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-jobber-surface text-jobber-dark">
              <CheckCircle2 className="h-4 w-4" />
            </span>
            <h4 className="font-semibold text-slate-900 text-sm sm:text-base">{title}</h4>
          </div>
          {date && (
            <span className="text-xs text-slate-500 font-medium">{date}</span>
          )}
        </div>
        {description && (
          <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {/* Zone de comparaison visuelle interactive */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        className="relative h-64 sm:h-80 w-full select-none overflow-hidden cursor-ew-resize bg-slate-900"
      >
        {/* Image "APRÈS" (en arrière-plan complet) */}
        <img
          src={apresUrl}
          alt={`Après - ${title}`}
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Badge "APRÈS" */}
        <div className="absolute top-3 right-3 z-10 rounded-lg bg-emerald-600/90 backdrop-blur px-2.5 py-1 text-[11px] font-bold text-white shadow-soft tracking-wider uppercase">
          Après
        </div>

        {/* Image "AVANT" (rognée selon sliderPosition) */}
        <div
          className="absolute inset-y-0 left-0 overflow-hidden"
          style={{ width: `${sliderPosition}%` }}
        >
          <img
            src={avantUrl}
            alt={`Avant - ${title}`}
            className="absolute inset-0 h-full w-full object-cover max-w-none"
            style={{
              width: containerRef.current ? `${containerRef.current.clientWidth}px` : "100%",
            }}
          />
        </div>

        {/* Badge "AVANT" */}
        <div className="absolute top-3 left-3 z-10 rounded-lg bg-slate-900/80 backdrop-blur px-2.5 py-1 text-[11px] font-bold text-white shadow-soft tracking-wider uppercase">
          Avant
        </div>

        {/* Curseur séparateur vertical */}
        <div
          className="absolute inset-y-0 z-20 w-0.5 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)]"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-800 shadow-soft-md border border-slate-200">
            <MoveHorizontal className="h-4 w-4" />
          </div>
        </div>
      </div>

      {/* Guide tactile doux */}
      <div className="bg-slate-50 px-4 py-2.5 flex items-center justify-between text-[11px] text-slate-500 border-t border-border">
        <span>Glissez pour comparer l'état initial et la finition</span>
        <span className="font-semibold text-client">100% Réalisation certifiée</span>
      </div>
    </div>
  );
}
