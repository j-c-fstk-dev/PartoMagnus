/**
 * Validation utilities for forms and data
 */

// ============ EMAIL ============

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// ============ PHONE ============

export function isValidPhoneNumber(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '')
  // Brazilian phone: 10 or 11 digits
  return cleaned.length === 10 || cleaned.length === 11
}

// ============ DATE ============

export function isValidDate(dateString: string): boolean {
  const date = new Date(dateString)
  return date instanceof Date && !isNaN(date.getTime())
}

export function isValidDateFormat(dateString: string, format: string = 'YYYY-MM-DD'): boolean {
  if (format === 'YYYY-MM-DD') {
    const regex = /^\d{4}-\d{2}-\d{2}$/
    if (!regex.test(dateString)) return false
    return isValidDate(dateString)
  }
  return false
}

export function isDateInFuture(date: Date | string): boolean {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.getTime() > new Date().getTime()
}

export function isDateInPast(date: Date | string): boolean {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.getTime() < new Date().getTime()
}

// ============ PREGNANCY ============

export function isValidWeeks(weeks: number): boolean {
  return weeks >= 0 && weeks <= 43
}

export function isValidGestationalAge(weeks: number): boolean {
  // Viability starts at 22 weeks, normal term is 37-42
  return weeks >= 22 && weeks <= 42
}

export function isValidApgarScore(score: number): boolean {
  return score >= 0 && score <= 10
}

export function isValidBabyWeight(grams: number): boolean {
  // Reasonable range: 500g to 6000g
  return grams >= 500 && grams <= 6000
}

export function isValidBabyHeight(cm: number): boolean {
  // Reasonable range: 30cm to 60cm
  return cm >= 30 && cm <= 60
}

// ============ NAME & TEXT ============

export function isValidName(name: string): boolean {
  const trimmed = name.trim()
  if (trimmed.length < 2 || trimmed.length > 100) return false
  // Allow letters, spaces, hyphens, and accents
  const nameRegex = /^[a-záàâãéèêíïóôõöúçñ\s\-']+$/i
  return nameRegex.test(trimmed)
}

export function isValidNotEmpty(text: string): boolean {
  return text.trim().length > 0
}

export function isValidLength(text: string, min: number, max: number): boolean {
  const length = text.trim().length
  return length >= min && length <= max
}

// ============ CONTRACTION ============

export function isValidContractionDuration(seconds: number): boolean {
  // Normal contractions: 20-120 seconds
  return seconds >= 20 && seconds <= 120
}

export function isValidContractionInterval(seconds: number): boolean {
  // Reasonable interval: 1 minute to 30 minutes
  return seconds >= 60 && seconds <= 30 * 60
}

export function isValidIntensity(intensity: string): boolean {
  return ['LEVE', 'MODERADA', 'FORTE'].includes(intensity.toUpperCase())
}

// ============ LABOR PHASE ============

export function isValidLaborPhase(phase: string): boolean {
  const validPhases = ['PRODROMAL', 'LATENT', 'ACTIVE', 'TRANSITION', 'EXPULSIVE', 'DEQUITACAO', 'COMPLETED']
  return validPhases.includes(phase.toUpperCase())
}

export function isValidAlertLevel(level: string): boolean {
  return ['GREEN', 'YELLOW', 'RED'].includes(level.toUpperCase())
}

// ============ LOCATION ============

export function isValidLatitude(lat: number): boolean {
  return lat >= -90 && lat <= 90
}

export function isValidLongitude(lon: number): boolean {
  return lon >= -180 && lon <= 180
}

export function isValidCoordinates(lat: number, lon: number): boolean {
  return isValidLatitude(lat) && isValidLongitude(lon)
}

export function isValidDistance(km: number): boolean {
  return km >= 0 && km <= 40000 // Max Earth circumference
}

// ============ NUMBERS ============

export function isValidNumber(num: unknown): boolean {
  return typeof num === 'number' && !isNaN(num) && isFinite(num)
}

export function isValidPositiveNumber(num: number): boolean {
  return isValidNumber(num) && num > 0
}

export function isValidNonNegativeNumber(num: number): boolean {
  return isValidNumber(num) && num >= 0
}

export function isValidPercentage(num: number): boolean {
  return isValidNumber(num) && num >= 0 && num <= 100
}

// ============ RATING ============

export function isValidRating(rating: number): boolean {
  return Number.isInteger(rating) && rating >= 1 && rating <= 5
}

// ============ UUID ============

export function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  return uuidRegex.test(uuid)
}

// ============ URL ============

export function isValidURL(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

// ============ FORM VALIDATION ============

export interface ValidationResult {
  isValid: boolean
  errors: Record<string, string>
}

export function validateUserForm(data: {
  name?: string
  birthDate?: string
  email?: string
  phone?: string
}): ValidationResult {
  const errors: Record<string, string> = {}

  if (!data.name || !isValidName(data.name)) {
    errors.name = 'Nome inválido (mínimo 2 caracteres)'
  }

  if (data.birthDate && !isValidDate(data.birthDate)) {
    errors.birthDate = 'Data de nascimento inválida'
  }

  if (data.email && !isValidEmail(data.email)) {
    errors.email = 'Email inválido'
  }

  if (data.phone && !isValidPhoneNumber(data.phone)) {
    errors.phone = 'Telefone inválido'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

export function validateAnamnesisForm(data: {
  currentWeek?: number
  estimatedDueDate?: string
  numberOfPreviousPregnancies?: number
  numberOfNormalBirths?: number
}): ValidationResult {
  const errors: Record<string, string> = {}

  if (data.currentWeek && !isValidWeeks(data.currentWeek)) {
    errors.currentWeek = 'Semana gestacional inválida (0-43)'
  }

  if (data.estimatedDueDate && !isValidDate(data.estimatedDueDate)) {
    errors.estimatedDueDate = 'Data prevista inválida'
  }

  if (data.numberOfPreviousPregnancies !== undefined && data.numberOfPreviousPregnancies < 0) {
    errors.numberOfPreviousPregnancies = 'Não pode ser negativo'
  }

  if (data.numberOfNormalBirths !== undefined && data.numberOfNormalBirths < 0) {
    errors.numberOfNormalBirths = 'Não pode ser negativo'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

export function validateContractionForm(data: {
  duration?: number
  intensity?: string
  notes?: string
}): ValidationResult {
  const errors: Record<string, string> = {}

  if (data.duration && !isValidContractionDuration(data.duration)) {
    errors.duration = 'Duração deve estar entre 20 e 120 segundos'
  }

  if (data.intensity && !isValidIntensity(data.intensity)) {
    errors.intensity = 'Intensidade inválida'
  }

  if (data.notes && !isValidLength(data.notes, 0, 500)) {
    errors.notes = 'Notas não podem exceder 500 caracteres'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}
