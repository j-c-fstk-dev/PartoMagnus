/**
 * Formatting utilities for dates, times, durations, and other data
 */

// ============ DATE & TIME ============

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('pt-BR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(d)
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('pt-BR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(d)
}

export function formatTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(d)
}

export function formatTimeShort(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)
}

// ============ DURATION ============

export function formatDuration(seconds: number): string {
  if (seconds < 0) return '0s'
  
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)
  
  if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`
  } else {
    return `${secs}s`
  }
}

export function formatDurationShort(seconds: number): string {
  if (seconds < 0) return '0s'
  
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)
  
  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  } else if (minutes > 0) {
    return `${minutes}:${String(secs).padStart(2, '0')}`
  } else {
    return `${secs}s`
  }
}

export function formatDurationMinutes(seconds: number): string {
  const minutes = Math.round(seconds / 60)
  return `${minutes}m`
}

export function formatDurationHours(seconds: number): string {
  const hours = (seconds / 3600).toFixed(1)
  return `${hours}h`
}

// ============ INTERVALS ============

export function formatInterval(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60
  
  if (minutes > 0) {
    return `${minutes}m ${secs}s`
  } else {
    return `${secs}s`
  }
}

export function formatIntervalMinutes(seconds: number): string {
  const minutes = Math.round(seconds / 60)
  return `a cada ${minutes} min`
}

// ============ TIME AGO ============

export function formatTimeAgo(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffSecs = Math.floor(diffMs / 1000)
  const diffMins = Math.floor(diffSecs / 60)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)
  
  if (diffSecs < 60) {
    return 'agora'
  } else if (diffMins < 60) {
    return `${diffMins}m atrás`
  } else if (diffHours < 24) {
    return `${diffHours}h atrás`
  } else if (diffDays < 7) {
    return `${diffDays}d atrás`
  } else {
    return formatDate(d)
  }
}

// ============ NUMBERS ============

export function formatNumber(num: number, decimals: number = 2): string {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num)
}

export function formatPercentage(num: number): string {
  return `${Math.round(num)}%`
}

export function formatWeight(grams: number): string {
  const kg = grams / 1000
  return `${kg.toFixed(2)} kg`
}

export function formatHeight(cm: number): string {
  return `${cm.toFixed(1)} cm`
}

// ============ PHONE & EMAIL ============

export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
  } else if (cleaned.length === 11) {
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  }
  
  return phone
}

// ============ PREGNANCY DATA ============

export function formatWeeks(weeks: number): string {
  return `${weeks} semana${weeks !== 1 ? 's' : ''}`
}

export function formatWeeksAndDays(totalDays: number): string {
  const weeks = Math.floor(totalDays / 7)
  const days = totalDays % 7
  
  let result = ''
  if (weeks > 0) {
    result += `${weeks}s`
  }
  if (days > 0) {
    result += ` ${days}d`
  }
  
  return result.trim()
}

// ============ INTENSITY ============

export function formatIntensity(intensity: string): string {
  const map: Record<string, string> = {
    LEVE: 'Leve',
    MODERADA: 'Moderada',
    FORTE: 'Forte',
  }
  return map[intensity] || intensity
}

export function formatPhase(phase: string): string {
  const map: Record<string, string> = {
    PRODROMAL: 'Pródromos',
    LATENT: 'Fase Latente',
    ACTIVE: 'Fase Ativa',
    TRANSITION: 'Transição',
    EXPULSIVE: 'Expulsiva',
    DEQUITACAO: 'Dequitação',
    COMPLETED: 'Concluído',
  }
  return map[phase] || phase
}

// ============ LOCATION ============

export function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)}m`
  }
  return `${km.toFixed(1)}km`
}

export function formatETA(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}min`
  }
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours}h ${mins}min`
}

// ============ ALERTS ============

export function formatAlertLevel(level: string): string {
  const map: Record<string, string> = {
    GREEN: '✅ Tudo bem',
    YELLOW: '⚠️ Atenção',
    RED: '🚨 Alerta',
  }
  return map[level] || level
}

// ============ GENERAL ============

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return text.slice(0, length) + '...'
}

export function capitalizeFirst(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
}

export function toTitleCase(text: string): string {
  return text
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
