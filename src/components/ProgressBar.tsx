/**
 * ProgressBar component - Visual progress indicator
 */

import React from 'react'
import { clsx } from 'clsx'

interface ProgressBarProps {
  value: number // 0-100
  max?: number
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  animated?: boolean
  striped?: boolean
  label?: string | React.ReactNode
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  variant = 'primary',
  size = 'md',
  showLabel = false,
  animated = true,
  striped = false,
  label,
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

  const sizeStyles = {
    sm: 'h-1',
    md: 'h-2.5',
    lg: 'h-4',
  }

  const variantStyles = {
    primary: 'bg-primary-600',
    success: 'bg-success',
    warning: 'bg-warning',
    error: 'bg-error',
    secondary: 'bg-secondary-600',
  }

  const animatedStyles = animated ? 'transition-all duration-500 ease-out' : ''
  const stripedStyles = striped ? 'bg-gradient-to-r from-transparent via-white/20 to-transparent' : ''

  return (
    <div className="w-full">
      {/* Label */}
      {(showLabel || label) && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-dark-200">
            {typeof label === 'string' ? label : label}
          </span>
          {showLabel && (
            <span className="text-sm font-medium text-dark-400">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}

      {/* Progress Container */}
      <div className={clsx(
        'w-full bg-dark-800 rounded-full overflow-hidden',
        sizeStyles[size]
      )}>
        {/* Progress Fill */}
        <div
          className={clsx(
            'h-full rounded-full',
            variantStyles[variant],
            stripedStyles,
            animatedStyles
          )}
          style={{
            width: `${percentage}%`,
          }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
    </div>
  )
}

ProgressBar.displayName = 'ProgressBar'
