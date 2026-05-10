/**
 * Logger utility for development and debugging
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogEntry {
  timestamp: string
  level: LogLevel
  message: string
  data?: unknown
  stack?: string
}

class Logger {
  private logs: LogEntry[] = []
  private isDevelopment = import.meta.env.DEV

  private getTimestamp(): string {
    return new Date().toISOString()
  }

  private formatMessage(level: LogLevel, message: string): string {
    const timestamp = new Date().toLocaleTimeString('pt-BR')
    return `[${timestamp}] [${level.toUpperCase()}] ${message}`
  }

  debug(message: string, data?: unknown): void {
    const entry: LogEntry = {
      timestamp: this.getTimestamp(),
      level: 'debug',
      message,
      data,
    }
    this.logs.push(entry)
    if (this.isDevelopment) {
      console.debug(this.formatMessage('debug', message), data)
    }
  }

  info(message: string, data?: unknown): void {
    const entry: LogEntry = {
      timestamp: this.getTimestamp(),
      level: 'info',
      message,
      data,
    }
    this.logs.push(entry)
    console.info(this.formatMessage('info', message), data)
  }

  warn(message: string, data?: unknown): void {
    const entry: LogEntry = {
      timestamp: this.getTimestamp(),
      level: 'warn',
      message,
      data,
    }
    this.logs.push(entry)
    console.warn(this.formatMessage('warn', message), data)
  }

  error(message: string, error?: Error | unknown): void {
    const stack = error instanceof Error ? error.stack : undefined
    const entry: LogEntry = {
      timestamp: this.getTimestamp(),
      level: 'error',
      message,
      data: error,
      stack,
    }
    this.logs.push(entry)
    console.error(this.formatMessage('error', message), error)
  }

  getLogs(level?: LogLevel): LogEntry[] {
    if (level) {
      return this.logs.filter(log => log.level === level)
    }
    return this.logs
  }

  clearLogs(): void {
    this.logs = []
  }

  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2)
  }

  downloadLogs(): void {
    const data = this.exportLogs()
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `logs-${new Date().toISOString()}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  logTablePerformance(label: string): () => void {
    const startTime = performance.now()
    return () => {
      const endTime = performance.now()
      const duration = endTime - startTime
      this.debug(`${label} took ${duration.toFixed(2)}ms`)
    }
  }

  static getInstance(): Logger {
    if (!globalThis.__logger) {
      globalThis.__logger = new Logger()
    }
    return globalThis.__logger
  }
}

declare global {
  var __logger: Logger
}

export const logger = Logger.getInstance()

// Performance monitoring helper
export function measurePerformance(name: string, fn: () => void): void {
  const start = performance.now()
  fn()
  const end = performance.now()
  logger.debug(`Performance: ${name}`, { duration: `${(end - start).toFixed(2)}ms` })
}

// Async performance monitoring
export async function measurePerformanceAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
  const start = performance.now()
  try {
    const result = await fn()
    const end = performance.now()
    logger.debug(`Performance: ${name}`, { duration: `${(end - start).toFixed(2)}ms` })
    return result
  } catch (error) {
    const end = performance.now()
    logger.error(`Performance: ${name} (FAILED)`, {
      duration: `${(end - start).toFixed(2)}ms`,
      error,
    })
    throw error
  }
}
