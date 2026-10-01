"use client";

import React, { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingStarsProps {
  rating: number;
  totalReviews?: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  showText?: boolean;
  className?: string;
}

export function RatingStars({
  rating,
  totalReviews,
  size = "md",
  interactive = false,
  onRatingChange,
  showText = true,
  className,
}: RatingStarsProps) {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const starSizes = {
    sm: "h-3.5 w-3.5",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  const currentVal = hoverRating !== null ? hoverRating : rating;

  return (
    <div className={cn("inline-flex items-center gap-1.5", className)}>
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((starIndex) => {
          const isFilled = starIndex <= Math.round(currentVal);
          return (
            <button
              key={starIndex}
              type="button"
              disabled={!interactive}
              onClick={() => onRatingChange?.(starIndex)}
              onMouseEnter={() => interactive && setHoverRating(starIndex)}
              onMouseLeave={() => interactive && setHoverRating(null)}
              className={cn(
                "transition-all duration-150 p-0.5 rounded-sm",
                interactive
                  ? "cursor-pointer hover:scale-110 active:scale-95 focus:outline-none"
                  : "cursor-default"
              )}
              aria-label={`Étoile ${starIndex}`}
            >
              <Star
                className={cn(
                  starSizes[size],
                  isFilled
                    ? "fill-amber-400 text-amber-500 drop-shadow-[0_1px_2px_rgba(234,179,8,0.2)]"
                    : "fill-slate-100 text-slate-300"
                )}
              />
            </button>
          );
        })}
      </div>

      {showText && (
        <span className="text-xs sm:text-sm font-semibold text-slate-800 ml-1">
          {rating > 0 ? rating.toFixed(1) : "Nouveau"}
          {totalReviews !== undefined && (
            <span className="text-slate-500 font-normal ml-1">
              ({totalReviews} avis)
            </span>
          )}
        </span>
      )}
    </div>
  );
}

interface MultiCriteriaRatingProps {
  qualite: number;
  ponctualite: number;
  prix: number;
  communication: number;
  onChange?: (criteria: { qualite: number; ponctualite: number; prix: number; communication: number }) => void;
  readOnly?: boolean;
}

export function MultiCriteriaRating({
  qualite,
  ponctualite,
  prix,
  communication,
  onChange,
  readOnly = false,
}: MultiCriteriaRatingProps) {
  const criteria = [
    { key: "qualite", label: "Qualité du travail", value: qualite },
    { key: "ponctualite", label: "Ponctualité & Réactivité", value: ponctualite },
    { key: "prix", label: "Respect du tarif / Devis", value: prix },
    { key: "communication", label: "Courtoisie & Propreté", value: communication },
  ];

  return (
    <div className="space-y-3 rounded-xl border border-border bg-slate-50/60 p-4 shadow-soft">
      <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700">
        Évaluation multicritères
      </h5>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {criteria.map((item) => (
          <div key={item.key} className="flex items-center justify-between text-xs">
            <span className="text-slate-600 font-medium">{item.label}</span>
            <div className="flex items-center gap-1">
              <RatingStars
                rating={item.value}
                size="sm"
                interactive={!readOnly}
                showText={false}
                onRatingChange={(val) => {
                  if (onChange) {
                    onChange({
                      qualite: item.key === "qualite" ? val : qualite,
                      ponctualite: item.key === "ponctualite" ? val : ponctualite,
                      prix: item.key === "prix" ? val : prix,
                      communication: item.key === "communication" ? val : communication,
                    });
                  }
                }}
              />
              <span className="font-semibold text-slate-800 w-5 text-right">{item.value}/5</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
