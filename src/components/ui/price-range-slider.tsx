'use client';

import { useCallback, useMemo } from 'react';
import { cn } from '@/lib/utils';

export interface PriceRangeSliderProps {
  min: number;
  max: number;
  step?: number;
  value: [number, number];
  onChange: (next: [number, number]) => void;
  className?: string;
}

export function PriceRangeSlider({
  min,
  max,
  step = 1000,
  value,
  onChange,
  className
}: PriceRangeSliderProps) {
  const [low, high] = value;
  const span = Math.max(1, max - min);

  const lowPct = ((low - min) / span) * 100;
  const highPct = ((high - min) / span) * 100;

  const clampPair = useCallback(
    (nextLow: number, nextHigh: number): [number, number] => {
      const a = Math.min(Math.max(nextLow, min), max);
      const b = Math.min(Math.max(nextHigh, min), max);
      return a <= b ? [a, b] : [b, a];
    },
    [max, min]
  );

  const trackStyle = useMemo(
    () => ({
      left: `${lowPct}%`,
      width: `${Math.max(0, highPct - lowPct)}%`
    }),
    [highPct, lowPct]
  );

  return (
    <div className={cn('relative h-6 w-full touch-none select-none', className)}>
      <div className='absolute top-1/2 h-1.5 w-full -translate-y-1/2 rounded-full bg-muted' />
      <div
        className='absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-primary'
        style={trackStyle}
      />
      <input
        type='range'
        min={min}
        max={max}
        step={step}
        value={low}
        aria-label='Minimum price'
        onChange={(event) => {
          const nextLow = Number(event.target.value);
          onChange(clampPair(nextLow, Math.max(nextLow, high)));
        }}
        className='pointer-events-none absolute inset-0 z-20 m-0 h-6 w-full appearance-none bg-transparent [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:size-4 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-primary [&::-moz-range-thumb]:bg-background [&::-moz-range-thumb]:shadow-md [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:relative [&::-webkit-slider-thumb]:z-30 [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:bg-background [&::-webkit-slider-thumb]:shadow-md'
      />
      <input
        type='range'
        min={min}
        max={max}
        step={step}
        value={high}
        aria-label='Maximum price'
        onChange={(event) => {
          const nextHigh = Number(event.target.value);
          onChange(clampPair(Math.min(low, nextHigh), nextHigh));
        }}
        className='pointer-events-none absolute inset-0 z-30 m-0 h-6 w-full appearance-none bg-transparent [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:size-4 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-primary [&::-moz-range-thumb]:bg-background [&::-moz-range-thumb]:shadow-md [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:relative [&::-webkit-slider-thumb]:z-40 [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:bg-background [&::-webkit-slider-thumb]:shadow-md'
      />
    </div>
  );
}
