'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

type ProgressProps = React.HTMLAttributes<HTMLDivElement> & {
  value?: number | null;
  max?: number;
  getValueLabel?: (value: number, max: number) => string;
};

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, max = 100, getValueLabel, ...props }, ref) => {
    const clampedMax = typeof max === 'number' && max > 0 ? max : 100;
    const numericValue = typeof value === 'number' ? value : 0;
    const percentage = Math.max(0, Math.min(100, (numericValue / clampedMax) * 100));

    const ariaLabel = getValueLabel
      ? getValueLabel(numericValue, clampedMax)
      : `${Math.round(percentage)}%`;

    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={clampedMax}
        aria-valuenow={numericValue}
        aria-valuetext={ariaLabel}
        className={cn('relative h-4 w-full overflow-hidden rounded-full bg-secondary', className)}
        {...props}
      >
        <div
          className="h-full w-full flex-1 bg-primary transition-all"
          style={{ transform: `translateX(-${100 - percentage}%)` }}
        />
      </div>
    );
  }
);
Progress.displayName = 'Progress';

export { Progress };
