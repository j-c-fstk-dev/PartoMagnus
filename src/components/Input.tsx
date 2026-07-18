/**
 * Input component - Form input field
 */

import React from 'react'
import { clsx } from 'clsx'

type InputType = 'text' | 'email' | 'password' | 'number' | 'date' | 'time' | 'tel' | 'url'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helpText?: string
  icon?: React.ReactNode
  variant?: 'default' | 'filled' | 'outlined'
  size?: 'sm' | 'md' | 'lg'
  isRequired?: boolean
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helpText,
      icon,
      variant = 'default',
      size = 'md',
      isRequired = false,
      className,
      type = 'text',
      disabled = false,
      ...props
    },
    ref
  ) => {
    const baseStyles = 'w-full bg-dark-900 text-dark-100 placeholder-dark-500 transition-all duration-200 rounded-lg focus:outline-none focus:ring-2'

    const variantStyles = {
      default: 'border border-dark-700 focus:border-primary-500 focus:ring-primary-500/20',
      filled: 'bg-dark-800 border border-dark-700 focus:border-primary-500 focus:ring-primary-500/20',
      outlined: 'border-2 border-dark-600 focus:border-primary-500 focus:ring-primary-500/20',
    }

    const sizeStyles = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2.5 text-base',
      lg: 'px-5 py-3 text-lg',
    }

    const disabledStyles = disabled ? 'bg-dark-800 opacity-50 cursor-not-allowed' : ''
    const errorStyles = error ? 'border-error focus:ring-error/20 focus:border-error' : ''

    const containerClass = clsx(
      'relative',
      icon ? 'flex items-center' : ''
    )

    const inputClass = clsx(
      baseStyles,
      variantStyles[variant],
      sizeStyles[size],
      disabledStyles,
      errorStyles,
      icon ? 'pl-10' : '',
      className
    )

    return (
      <div className="w-full flex flex-col gap-1.5">
        {/* Label */}
        {label && (
          <label className="text-sm font-medium text-dark-200 flex items-center gap-1">
            {label}
            {isRequired && <span className="text-error">*</span>}
          </label>
        )}

        {/* Input Container */}
        <div className={containerClass}>
          {/* Icon */}
          {icon && (
            <span className="absolute left-3 text-dark-400 flex items-center justify-center">
              {icon}
            </span>
          )}

          {/* Input */}
          <input
            ref={ref}
            type={type}
            disabled={disabled}
            className={inputClass}
            {...props}
          />
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-xs text-error flex items-center gap-1">
            <span>⚠️</span>
            {error}
          </p>
        )}

        {/* Help Text */}
        {helpText && !error && (
          <p className="text-xs text-dark-400">
            {helpText}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
