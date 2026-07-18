/**
 * Custom hook for localStorage management
 */

import { useState, useEffect, useCallback } from 'react'
import { logger } from '@/utils/logger'

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      if (item) {
        return JSON.parse(item)
      }
      return initialValue
    } catch (error) {
      logger.error(`useLocalStorage: Error reading from localStorage for key "${key}"`, error)
      return initialValue
    }
  })

  // Return a wrapped version of useState's setter function that
  // persists the new value to localStorage
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        // Allow value to be a function so we have same API as useState
        const valueToStore = value instanceof Function ? value(storedValue) : value
        setStoredValue(valueToStore)
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
        logger.debug(`useLocalStorage: Set ${key}`)
      } catch (error) {
        logger.error(`useLocalStorage: Error writing to localStorage for key "${key}"`, error)
      }
    },
    [key, storedValue]
  )

  return [storedValue, setValue]
}

/**
 * Hook to clear a localStorage key
 */
export function useClearLocalStorage(key: string): () => void {
  return useCallback(() => {
    try {
      window.localStorage.removeItem(key)
      logger.debug(`useClearLocalStorage: Cleared ${key}`)
    } catch (error) {
      logger.error(`useClearLocalStorage: Error clearing localStorage key "${key}"`, error)
    }
  }, [key])
}

/**
 * Hook to listen for localStorage changes
 */
export function useLocalStorageListener<T>(
  key: string,
  callback: (value: T | null) => void
): void {
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key) {
        try {
          const newValue = e.newValue ? JSON.parse(e.newValue) : null
          callback(newValue)
        } catch (error) {
          logger.error(`useLocalStorageListener: Error parsing storage value for key "${key}"`, error)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [key, callback])
}
