/**
 * Card component - Container for content
 */

import React from 'react'
import { clsx } from 'clsx'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  variant?: 'default' | 'elevated' | 'outlined' | 'filled'
  hoverable?: boolean
  clickable?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      children,
      variant = 'default',
      hoverable = false,
      clickable = false,
      padding = 'md',
      className,
      ...props
    },
    ref
  ) => {
    const baseStyles = 'rounded-lg transition-all duration-300'

    const variantStyles = {
      default: 'bg-dark-900 border border-dark-800',
      elevated: 'bg-dark-900 shadow-lg',
      outlined: 'bg-dark-950 border-2 border-primary-600',
      filled: 'bg-dark-800',
    }

    const paddingStyles = {
      none: 'p-0',
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-6',
    }

    const hoverableStyles = hoverable ? 'hover:shadow-xl hover:border-primary-500' : ''
    const clickableStyles = clickable ? 'cursor-pointer active:scale-95' : ''

    return (
      <div
        ref={ref}
        className={clsx(
          baseStyles,
          variantStyles[variant],
          paddingStyles[padding],
          hoverableStyles,
          clickableStyles,
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'
