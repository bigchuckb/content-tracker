"use client";

interface StarRatingProps {
  value?: number;
  max?: number;
  interactive?: boolean;
  onChange?: (value: number) => void;
  size?: "sm" | "md";
}

export default function StarRating({
  value = 0,
  max = 5,
  interactive = false,
  onChange,
  size = "md",
}: StarRatingProps) {
  const sizeCls = size === "sm" ? "text-base" : "text-xl";

  const stars = Array.from({ length: max }, (_, i) => {
    const starNum = i + 1;
    const full = value >= starNum;
    const half = !full && value >= starNum - 0.5;

    if (interactive) {
      return (
        <span
          key={starNum}
          className="relative inline-block cursor-pointer select-none"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickedLeft = e.clientX - rect.left < rect.width / 2;
            onChange?.(clickedLeft ? starNum - 0.5 : starNum);
          }}
        >
          {/* Empty background star */}
          <span className={`${sizeCls} text-[#445566]`}>★</span>
          {/* Filled overlay */}
          {(full || half) && (
            <span
              className={`absolute inset-0 overflow-hidden ${sizeCls} text-[#ff8000] pointer-events-none`}
              style={{ width: full ? "100%" : "50%" }}
            >
              ★
            </span>
          )}
        </span>
      );
    }

    return (
      <span key={starNum} className="relative inline-block">
        <span className={`${sizeCls} text-[#445566]`}>★</span>
        {(full || half) && (
          <span
            className={`absolute inset-0 overflow-hidden ${sizeCls} text-[#ff8000]`}
            style={{ width: full ? "100%" : "50%" }}
          >
            ★
          </span>
        )}
      </span>
    );
  });

  return (
    <span className="inline-flex items-center gap-px" title={value ? `${value}/5` : undefined}>
      {stars}
      {value > 0 && <span className="ml-1 text-xs text-[#9ab]">{value}</span>}
    </span>
  );
}
