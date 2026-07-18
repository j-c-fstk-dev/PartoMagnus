/**
 * Header component - Top navigation bar
 */

import React from 'react'
import { clsx } from 'clsx'

interface HeaderProps {
  title?: string
  subtitle?: string
  leftAction?: React.ReactNode
  rightAction?: React.ReactNode
  centered?: boolean
  sticky?: boolean
  variant?: 'default' | 'minimal'
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  leftAction,
  rightAction,
  centered = false,
  sticky = true,
  variant = 'default',
}) => {
  const stickyStyles = sticky ? 'sticky top-0 z-40' : ''

  const variantStyles = {
    default: 'bg-dark-900 border-b border-dark-800 shadow-md',
    minimal: 'bg-transparent border-b border-dark-800/30',
  }

  const layoutStyles = centered
    ? 'flex flex-col items-center justify-center'
    : 'flex items-center justify-between'

  return (
    <header
      className={clsx(
        'w-full py-4 px-6 transition-all duration-300',
        stickyStyles,
        variantStyles[variant]
      )}
    >
      <div className={layoutStyles}>
        {/* Left Action */}
        {leftAction && !centered && (
          <div className="flex items-center">
            {leftAction}
          </div>
        )}

        {/* Title & Subtitle */}
        <div className={clsx(
          'flex flex-col gap-1',
          centered ? 'text-center' : 'flex-1 ml-4'
        )}>
          {title && (
            <h1 className="text-2xl font-bold text-dark-100">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="text-sm text-dark-400">
              {subtitle}
            </p>
          )}
        </div>

        {/* Right Action */}
        {rightAction && !centered && (
          <div className="flex items-center gap-2">
            {rightAction}
          </div>
        )}
      </div>
    </header>
  )
}

Header.displayName = 'Header'
