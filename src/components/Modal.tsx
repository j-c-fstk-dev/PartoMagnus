/**
 * Modal component - Dialog overlay
 */

import React, { useEffect } from 'react'
import { clsx } from 'clsx'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  showCloseButton?: boolean
  closeOnBackdropClick?: boolean
  closeOnEscape?: boolean
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnBackdropClick = true,
  closeOnEscape = true,
}) => {
  // Handle escape key
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen, closeOnEscape, onClose])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  const sizeStyles = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full mx-4',
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => closeOnBackdropClick && onClose()}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div
        className={clsx(
          'relative bg-dark-900 rounded-lg shadow-2xl',
          'border border-dark-800 w-full',
          sizeStyles[size],
          'animate-[slideUp_0.3s_ease-out]'
        )}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-6 border-b border-dark-800">
            <h2 className="text-xl font-semibold text-dark-100">{title}</h2>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-2 hover:bg-dark-800 rounded-lg transition-colors text-dark-400 hover:text-dark-100"
                aria-label="Close modal"
              >
                ✕
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-6 max-h-[calc(90vh-180px)] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  )
}

Modal.displayName = 'Modal'
