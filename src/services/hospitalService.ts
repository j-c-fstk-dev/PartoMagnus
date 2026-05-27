/**
 * Hospital service for managing hospital data and emergency contacts
 */

import { Hospital, BirthCenter, HospitalContact } from '@/types/hospital'
import { HOSPITALS, BIRTH_CENTERS, EMERGENCY_NUMBERS, calculateDistance } from '@/config/hospitals'
import { logger } from '@/utils/logger'

export class HospitalService {
  /**
   * Get all hospitals
   */
  static getAllHospitals(): Hospital[] {
    return HOSPITALS
  }

  /**
   * Get hospital by ID
   */
  static getHospitalById(id: string): Hospital | undefined {
    return HOSPITALS.find(h => h.id === id)
  }

  /**
   * Get all birth centers
   */
  static getAllBirthCenters(): BirthCenter[] {
    return BIRTH_CENTERS
  }

  /**
   * Get birth center by ID
   */
  static getBirthCenterById(id: string): BirthCenter | undefined {
    return BIRTH_CENTERS.find(bc => bc.id === id)
  }

  /**
   * Search hospitals by name
   */
  static searchHospitals(query: string): Hospital[] {
    const lowercaseQuery = query.toLowerCase()
    return HOSPITALS.filter(
      h =>
        h.name.toLowerCase().includes(lowercaseQuery) ||
        h.city.toLowerCase().includes(lowercaseQuery) ||
        h.address.toLowerCase().includes(lowercaseQuery)
    )
  }

  /**
   * Filter hospitals by service
   */
  static filterByService(serviceName: string): Hospital[] {
    return HOSPITALS.filter(h => h.services.includes(serviceName as any))
  }

  /**
   * Get top-rated hospitals
   */
  static getTopRated(limit: number = 5): Hospital[] {
    return [...HOSPITALS].sort((a, b) => b.rating - a.rating).slice(0, limit)
  }

  /**
   * Get hospitals accepting public health
   */
  static getPublicHealthHospitals(): Hospital[] {
    return HOSPITALS.filter(h => h.acceptsPublicHealth)
  }

  /**
   * Get hospitals with specific feature
   */
  static getHospitalsWithFeature(
    feature: 'humanized' | 'doula' | 'water_birth' | 'epidural'
  ): Hospital[] {
    return HOSPITALS.filter(h => {
      switch (feature) {
        case 'humanized':
          return h.hasHumanizedBirthProgram
        case 'doula':
          return h.hasDoula
        case 'water_birth':
          return h.hasBirthing
        case 'epidural':
          return h.hasEpidural
        default:
          return false
      }
    })
  }

  /**
   * Get emergency contacts
   */
  static getEmergencyNumbers(): typeof EMERGENCY_NUMBERS {
    return EMERGENCY_NUMBERS
  }

  /**
   * Call ambulance (opens phone dialer)
   */
  static callAmbulance(): void {
    const tel = `tel:${EMERGENCY_NUMBERS.AMBULANCE}`
    window.location.href = tel
    logger.info('HospitalService: Ambulance call initiated')
  }

  /**
   * Call specific hospital
   */
  static callHospital(hospitalId: string): void {
    const hospital = this.getHospitalById(hospitalId)
    if (hospital) {
      const tel = `tel:${hospital.phone}`
      window.location.href = tel
      logger.info('HospitalService: Hospital call initiated', { hospitalId })
    }
  }

  /**
   * Send SMS to hospital
   */
  static sendSMS(hospitalId: string, message: string): void {
    const hospital = this.getHospitalById(hospitalId)
    if (hospital) {
      const sms = `sms:${hospital.phone}?body=${encodeURIComponent(message)}`
      window.location.href = sms
      logger.info('HospitalService: SMS initiated', { hospitalId })
    }
  }

  /**
   * Get hospital contact details
   */
  static getContactDetails(hospitalId: string): Partial<Hospital> | null {
    const hospital = this.getHospitalById(hospitalId)
    if (!hospital) return null

    return {
      name: hospital.name,
      phone: hospital.phone,
      address: hospital.address,
      website: hospital.website,
    }
  }

  /**
   * Open hospital website
   */
  static openWebsite(hospitalId: string): void {
    const hospital = this.getHospitalById(hospitalId)
    if (hospital && hospital.website) {
      window.open(hospital.website, '_blank')
      logger.info('HospitalService: Website opened', { hospitalId })
    }
  }

  /**
   * Check hospital distance from coordinates
   */
  static getDistanceToHospital(
    hospitalId: string,
    userLat: number,
    userLon: number
  ): number | null {
    const hospital = this.getHospitalById(hospitalId)
    if (!hospital) return null

    return calculateDistance(userLat, userLon, hospital.coordinates.latitude, hospital.coordinates.longitude)
  }

  /**
   * Get directions to hospital
   */
  static getDirectionsURL(
    hospitalId: string,
    userLat: number,
    userLon: number
  ): string | null {
    const hospital = this.getHospitalById(hospitalId)
    if (!hospital) return null

    const destLat = hospital.coordinates.latitude
    const destLon = hospital.coordinates.longitude

    // Try to detect if on mobile
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

    if (isMobile) {
      // Apple Maps for iOS
      if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
        return `maps://maps.apple.com/?saddr=${userLat},${userLon}&daddr=${destLat},${destLon}`
      }
      // Google Maps for Android
      return `https://www.google.com/maps/dir/${userLat},${userLon}/${destLat},${destLon}`
    }

    // Web version
    return `https://www.google.com/maps/dir/${userLat},${userLon}/${destLat},${destLon}`
  }

  /**
   * Generate hospital comparison
   */
  static compareHospitals(hospitalIds: string[]): Hospital[] {
    return hospitalIds
      .map(id => this.getHospitalById(id))
      .filter((h): h is Hospital => h !== undefined)
  }

  /**
   * Get hospital amenities
   */
  static getAmenities(hospitalId: string): string[] {
    const hospital = this.getHospitalById(hospitalId)
    if (!hospital) return []

    const amenities: string[] = []

    if (hospital.hasHumanizedBirthProgram) amenities.push('Programa de Parto Humanizado')
    if (hospital.hasDoula) amenities.push('Doulas Disponíveis')
    if (hospital.hasBirthing) amenities.push('Banheira/Parto na Água')
    if (hospital.hasEpidural) amenities.push('Epidural')
    if (hospital.allowsCompanion) amenities.push('Acompanhante Permitido')
    if (hospital.allowsFreeMovement) amenities.push('Movimento Livre Durante Parto')
    if (hospital.allowsMultipleBirthPositions) amenities.push('Múltiplas Posições de Parto')
    if (hospital.hasMothersRooming) amenities.push('Alojamento Conjunto')

    return amenities
  }

  /**
   * Log hospital service access
   */
  static logAccess(hospitalId: string, action: string): void {
    const hospital = this.getHospitalById(hospitalId)
    if (hospital) {
      logger.info('HospitalService: Access logged', {
        hospitalId,
        hospitalName: hospital.name,
        action,
      })
    }
  }

  /**
   * Validate hospital data
   */
  static validateHospital(hospital: Hospital): boolean {
    const required = ['id', 'name', 'address', 'phone', 'coordinates']
    return required.every(field => (hospital as any)[field] !== undefined && (hospital as any)[field] !== null)
  }

  /**
   * Format hospital info for display
   */
  static formatHospitalInfo(hospital: Hospital): string {
    return `
${hospital.name}
Telefone: ${hospital.phone}
Endereço: ${hospital.address}
Cidade: ${hospital.city}, ${hospital.state}

Avaliação: ${hospital.rating}/5 (${hospital.totalReviews} avaliações)

Recursos:
${this.getAmenities(hospital.id).map(a => `• ${a}`).join('\n')}
    `.trim()
  }
}
