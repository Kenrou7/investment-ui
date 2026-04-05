"use client";

import { useMemo, useState } from "react";

type RangeKey = "24h" | "7d" | "30d" | "90d" | "360d";

const RANGE_CONFIG: Record<RangeKey, { points: number; trend: number; noise: number }> = {
  "24h": { points: 24, trend: 2.5, noise: 0.75 },
  "7d": { points: 42, trend: 4.8, noise: 1.15 },
  "30d": { points: 64, trend: 7.4, noise: 1.35 },
  "90d": { points: 90, trend: 9.8, noise: 1.75 },
  "360d": { points: 120, trend: 14.6, noise: 2.25 },
};

const RANGE_OPTIONS: RangeKey[] = ["24h", "7d", "30d", "90d", "360d"];

function createMockSeries(range: RangeKey) {
  const { points, trend, noise } = RANGE_CONFIG[range];
  const base = 101.4;

  return Array.from({ length: points }, (_, index) => {
    const position = points === 1 ? 0 : index / (points - 1);
    const trendComponent = trend * position;
    const wave = Math.sin(index * 0.25) * (noise * 0.52);
    const ripple = Math.cos(index * 0.62) * (noise * 0.3);
    const microJitter = ((index * 37) % 11) * 0.026;

    return base + trendComponent + wave + ripple + microJitter;
  });
}

function toTwoDecimals(value: number) {
  return value.toFixed(2);
}

export function ShareValueChart() {
  const [range, setRange] = useState<RangeKey>("30d");

  const { current, deltaPct, polylinePoints, areaPoints, min, max } = useMemo(() => {
    const series = createMockSeries(range);
    const minValue = Math.min(...series);
    const maxValue = Math.max(...series);
    const width = 760;
    const height = 340;
    const ySpan = Math.max(maxValue - minValue, 0.0001);

    const points = series.map((value, index) => {
      const x = (index / (series.length - 1 || 1)) * width;
      const y = height - ((value - minValue) / ySpan) * height;
      return { x, y };
    });

    const polyline = points.map((point) => `${point.x},${point.y}`).join(" ");
    const area = [`0,${height}`, ...points.map((point) => `${point.x},${point.y}`), `${width},${height}`].join(" ");

    const first = series[0];
    const last = series[series.length - 1];
    const delta = ((last - first) / first) * 100;

    return {
      current: last,
      deltaPct: delta,
      polylinePoints: polyline,
      areaPoints: area,
      min: minValue,
      max: maxValue,
    };
  }, [range]);

  return (
    <section className="relative w-full overflow-hidden rounded-[34px] border border-[color:var(--line)] bg-[linear-gradient(180deg,rgba(255,251,247,0.96),rgba(255,246,238,0.78))] p-5 shadow-[0_32px_90px_rgba(43,25,14,0.2)] sm:p-7">
      <div className="pointer-events-none absolute inset-x-8 top-0 h-12 rounded-b-[999px] bg-[radial-gradient(circle,_rgba(255,255,255,0.88)_0%,rgba(255,255,255,0)_74%)]" />

      <div className="relative z-10 flex items-center justify-between gap-3">
        <p className="font-[family-name:var(--font-display)] text-3xl text-[color:var(--foreground)]">
          ${toTwoDecimals(current)}
        </p>
        <span
          className={[
            "rounded-full px-3 py-1 text-xs font-semibold",
            deltaPct >= 0
              ? "bg-emerald-100 text-emerald-700"
              : "bg-rose-100 text-rose-700",
          ].join(" ")}
        >
          {deltaPct >= 0 ? "+" : ""}
          {deltaPct.toFixed(2)}%
        </span>
      </div>

      <div className="relative z-10 mt-4 overflow-hidden rounded-2xl border border-[color:var(--line)] bg-white/75 px-3 py-4 sm:px-4">
        <svg viewBox="0 0 760 340" className="h-56 w-full sm:h-64" aria-label="Share value chart" role="img">
          <defs>
            <linearGradient id="share-line" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#de6f25" />
              <stop offset="100%" stopColor="#f2ad5d" />
            </linearGradient>
            <linearGradient id="share-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(222,111,37,0.30)" />
              <stop offset="100%" stopColor="rgba(222,111,37,0.04)" />
            </linearGradient>
          </defs>

          {Array.from({ length: 4 }).map((_, index) => {
            const y = (340 / 3) * index;
            return (
              <line
                key={index}
                x1="0"
                y1={y}
                x2="760"
                y2={y}
                stroke="rgba(73,53,35,0.1)"
                strokeDasharray="4 8"
              />
            );
          })}

          <polygon points={areaPoints} fill="url(#share-fill)" />
          <polyline
            points={polylinePoints}
            fill="none"
            stroke="url(#share-line)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <div className="mt-2 flex items-center justify-between text-xs font-medium text-[color:var(--muted)]">
          <span>${toTwoDecimals(min)}</span>
          <span>${toTwoDecimals(max)}</span>
        </div>
      </div>

      <div className="relative z-10 mt-4 grid grid-cols-5 gap-2">
        {RANGE_OPTIONS.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setRange(option)}
            className={[
              "rounded-xl px-2 py-2 text-xs font-semibold transition sm:text-sm",
              range === option
                ? "bg-[linear-gradient(135deg,var(--accent),#e58b38)] text-white shadow-[0_8px_20px_rgba(221,107,32,0.35)]"
                : "border border-[color:var(--line)] bg-white/80 text-[color:var(--muted)] hover:bg-white",
            ].join(" ")}
          >
            {option}
          </button>
        ))}
      </div>
    </section>
  );
}