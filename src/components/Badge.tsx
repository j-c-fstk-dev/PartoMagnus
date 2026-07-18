/**
 * Badge component - Small labeled element
 */

import React from 'react'
import { clsx } from 'clsx'

export type BadgeVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'neutral'
export type BadgeSize = 'sm' | 'md' | 'lg'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  size?: BadgeSize
  children: React.ReactNode
  icon?: React.ReactNode
  dismissible?: boolean
  onDismiss?: () => void
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      children,
      icon,
      dismissible = false,
      onDismiss,
      className,
      ...props
    },
    ref
  ) => {
    const baseStyles = 'inline-flex items-center gap-1.5 font-medium rounded-full transition-all duration-200'

    const variantStyles = {
      primary: 'bg-primary-900/30 text-primary-300 border border-primary-700/50',
      secondary: 'bg-secondary-900/30 text-secondary-300 border border-secondary-700/50',
      success: 'bg-green-900/30 text-green-300 border border-green-700/50',
      warning: 'bg-warning-900/30 text-warning-300 border border-warning-700/50',
      error: 'bg-error-900/30 text-error-300 border border-error-700/50',
      info: 'bg-blue-900/30 text-blue-300 border border-blue-700/50',
      neutral: 'bg-dark-700 text-dark-200 border border-dark-600',
    }

    const sizeStyles = {
      sm: 'px-2.5 py-1 text-xs',
      md: 'px-3 py-1.5 text-sm',
      lg: 'px-4 py-2 text-base',
    }

    return (
      <span
        ref={ref}
        className={clsx(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {icon && <span className="flex-shrink-0">{icon}</span>}
        <span>{children}</span>
        {dismissible && (
          <button
            onClick={onDismiss}
            className="ml-1 flex-shrink-0 hover:opacity-70 transition-opacity"
            aria-label="Dismiss badge"
          >
            ✕
          </button>
        )}
      </span>
    )
  }
)

Badge.displayName = 'Badge'
