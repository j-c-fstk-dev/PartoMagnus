/**
 * Storage service for localStorage and IndexedDB
 * Handles persistence of app data
 */

import { STORAGE_KEYS } from '@/utils/constants'
import { logger } from '@/utils/logger'

// ============ LOCALSTORAGE WRAPPER ============

class LocalStorageService {
  set<T>(key: string, value: T): boolean {
    try {
      const serialized = JSON.stringify(value)
      localStorage.setItem(key, serialized)
      logger.debug(`LocalStorage: Set ${key}`)
      return true
    } catch (error) {
      logger.error(`LocalStorage: Failed to set ${key}`, error)
      return false
    }
  }

  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key)
      if (!item) return null
      return JSON.parse(item) as T
    } catch (error) {
      logger.error(`LocalStorage: Failed to get ${key}`, error)
      return null
    }
  }

  remove(key: string): boolean {
    try {
      localStorage.removeItem(key)
      logger.debug(`LocalStorage: Removed ${key}`)
      return true
    } catch (error) {
      logger.error(`LocalStorage: Failed to remove ${key}`, error)
      return false
    }
  }

  clear(): boolean {
    try {
      localStorage.clear()
      logger.debug('LocalStorage: Cleared')
      return true
    } catch (error) {
      logger.error('LocalStorage: Failed to clear', error)
      return false
    }
  }

  getAllKeys(): string[] {
    const keys: string[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key) keys.push(key)
    }
    return keys
  }

  getAllBeregenerativeData(): Record<string, unknown> {
    const data: Record<string, unknown> = {}
    const keys = this.getAllKeys()

    keys.forEach(key => {
      if (key.startsWith('beregenerative:')) {
        data[key] = this.get(key)
      }
    })

    return data
  }

  exportData(): string {
    const data = this.getAllBeregenerativeData()
    return JSON.stringify(data, null, 2)
  }

  importData(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString)
      Object.entries(data).forEach(([key, value]) => {
        this.set(key, value)
      })
      logger.info('LocalStorage: Data imported successfully')
      return true
    } catch (error) {
      logger.error('LocalStorage: Failed to import data', error)
      return false
    }
  }
}

// ============ INDEXEDDB WRAPPER ============

interface IndexedDBConfig {
  dbName: string
  version: number
  stores: Record<string, string> // { storeName: 'keyPath' }
}

class IndexedDBService {
  private db: IDBDatabase | null = null
  private config: IndexedDBConfig

  constructor(config: IndexedDBConfig) {
    this.config = config
  }

  async init(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.config.dbName, this.config.version)

      request.onerror = () => {
        logger.error('IndexedDB: Failed to open database', request.error)
        reject(request.error)
      }

      request.onsuccess = () => {
        this.db = request.result
        logger.debug('IndexedDB: Database opened successfully')
        resolve(true)
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result

        Object.entries(this.config.stores).forEach(([storeName, keyPath]) => {
          if (!db.objectStoreNames.contains(storeName)) {
            db.createObjectStore(storeName, { keyPath })
            logger.debug(`IndexedDB: Created store ${storeName}`)
          }
        })
      }
    })
  }

  async set<T>(storeName: string, value: T): Promise<boolean> {
    if (!this.db) {
      logger.warn('IndexedDB: Database not initialized')
      return false
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readwrite')
      const store = transaction.objectStore(storeName)
      const request = store.put(value)

      request.onerror = () => {
        logger.error(`IndexedDB: Failed to set in ${storeName}`, request.error)
        reject(request.error)
      }

      request.onsuccess = () => {
        logger.debug(`IndexedDB: Set in ${storeName}`)
        resolve(true)
      }
    })
  }

  async get<T>(storeName: string, key: string): Promise<T | null> {
    if (!this.db) {
      logger.warn('IndexedDB: Database not initialized')
      return null
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readonly')
      const store = transaction.objectStore(storeName)
      const request = store.get(key)

      request.onerror = () => {
        logger.error(`IndexedDB: Failed to get from ${storeName}`, request.error)
        reject(request.error)
      }

      request.onsuccess = () => {
        resolve(request.result || null)
      }
    })
  }

  async getAll<T>(storeName: string): Promise<T[]> {
    if (!this.db) {
      logger.warn('IndexedDB: Database not initialized')
      return []
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readonly')
      const store = transaction.objectStore(storeName)
      const request = store.getAll()

      request.onerror = () => {
        logger.error(`IndexedDB: Failed to getAll from ${storeName}`, request.error)
        reject(request.error)
      }

      request.onsuccess = () => {
        resolve(request.result || [])
      }
    })
  }

  async delete(storeName: string, key: string): Promise<boolean> {
    if (!this.db) {
      logger.warn('IndexedDB: Database not initialized')
      return false
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readwrite')
      const store = transaction.objectStore(storeName)
      const request = store.delete(key)

      request.onerror = () => {
        logger.error(`IndexedDB: Failed to delete from ${storeName}`, request.error)
        reject(request.error)
      }

      request.onsuccess = () => {
        logger.debug(`IndexedDB: Deleted from ${storeName}`)
        resolve(true)
      }
    })
  }

  async clear(storeName: string): Promise<boolean> {
    if (!this.db) {
      logger.warn('IndexedDB: Database not initialized')
      return false
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readwrite')
      const store = transaction.objectStore(storeName)
      const request = store.clear()

      request.onerror = () => {
        logger.error(`IndexedDB: Failed to clear ${storeName}`, request.error)
        reject(request.error)
      }

      request.onsuccess = () => {
        logger.debug(`IndexedDB: Cleared ${storeName}`)
        resolve(true)
      }
    })
  }
}

// ============ SINGLETON INSTANCES ============

export const localStorageService = new LocalStorageService()

export const indexedDBService = new IndexedDBService({
  dbName: 'beregenerative',
  version: 1,
  stores: {
    'labor-sessions': 'id',
    'contractions': 'id',
    'audio-cache': 'url',
    'user-data': 'id',
  },
})

// ============ UTILITY FUNCTIONS ============

export async function initializeStorage(): Promise<void> {
  try {
    await indexedDBService.init()
    logger.info('Storage: Initialized successfully')
  } catch (error) {
    logger.error('Storage: Initialization failed', error)
  }
}

export async function clearAllStorage(): Promise<void> {
  localStorageService.clear()
  await indexedDBService.clear('labor-sessions')
  await indexedDBService.clear('contractions')
  await indexedDBService.clear('user-data')
  logger.info('Storage: All data cleared')
}

export async function exportAllData(): Promise<string> {
  const localData = localStorageService.exportData()
  return localData
}

export async function importAllData(jsonString: string): Promise<boolean> {
  return localStorageService.importData(jsonString)
}
