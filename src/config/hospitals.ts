/**
 * Hospital and healthcare facility configuration
 * Focused on Pindamonhangaba, SP, Brazil
 */

import { Hospital, BirthCenter } from '@/types/hospital'

// Pindamonhangaba hospitals
export const HOSPITALS: Hospital[] = [
  {
    id: 'santa-casa-pindamonhangaba',
    name: 'Santa Casa de Misericórdia de Pindamonhangaba',
    address: 'Rua Dr. Campos Sales, 1000',
    city: 'Pindamonhangaba',
    state: 'SP',
    zipCode: '12400-000',
    phone: '(12) 3644-6000',
    website: 'https://www.santacasapindamonhangaba.com.br',
    coordinates: {
      latitude: -22.3186,
      longitude: -45.4686,
    },
    services: ['obstetrics', 'neonatal_icu', 'pediatrics', 'anesthesia', 'ultrasound', 'blood_bank', 'emergency'],
    hasVaginalDelivery: true,
    hasCesareanSection: true,
    hasContinuousLabor: true,
    hasDoula: false,
    hasBirthing: true,
    hasEpidural: true,
    hasMothersRooming: true,
    hasHumanizedBirthProgram: true,
    allowsCompanion: true,
    allowsMultipleBirthPositions: true,
    allowsFreeMovement: true,
    rating: 4.5,
    totalReviews: 127,
    acceptsPublicHealth: true,
    acceptsPrivateInsurance: true,
    acceptsPrivatePay: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'hospital-10-julho-pindamonhangaba',
    name: 'Hospital 10 de Julho',
    address: 'Avenida Getúlio Vargas, 2500',
    city: 'Pindamonhangaba',
    state: 'SP',
    zipCode: '12400-100',
    phone: '(12) 3644-8800',
    website: 'https://www.hospital10dejulho.com.br',
    coordinates: {
      latitude: -22.3250,
      longitude: -45.4750,
    },
    services: ['obstetrics', 'neonatal_icu', 'pediatrics', 'anesthesia', 'ultrasound', 'blood_bank', 'emergency'],
    hasVaginalDelivery: true,
    hasCesareanSection: true,
    hasContinuousLabor: true,
    hasDoula: true,
    hasBirthing: true,
    hasEpidural: true,
    hasMothersRooming: true,
    hasHumanizedBirthProgram: true,
    allowsCompanion: true,
    allowsMultipleBirthPositions: true,
    allowsFreeMovement: true,
    rating: 4.7,
    totalReviews: 156,
    acceptsPublicHealth: true,
    acceptsPrivateInsurance: true,
    acceptsPrivatePay: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
]

// Birth centers in Pindamonhangaba area
export const BIRTH_CENTERS: BirthCenter[] = [
  {
    id: 'casa-parto-pindamonhangaba',
    name: 'Casa de Parto Natural',
    address: 'Rua das Flores, 456',
    city: 'Pindamonhangaba',
    coordinates: {
      latitude: -22.3200,
      longitude: -45.4700,
    },
    phone: '(12) 3644-5555',
    midwives: 3,
    doulas: 2,
    hasLaborBed: true,
    hasBirthBall: true,
    hasShower: true,
    hasWaterBirth: true,
    distanceToCesarean: 2, // 2 km to nearest hospital
    rating: 4.8,
    totalReviews: 89,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
]

export const PINDAMONHANGABA_CENTER = {
  latitude: -22.3186,
  longitude: -45.4686,
}

// Helper functions
export function getHospitalById(id: string): Hospital | undefined {
  return HOSPITALS.find(h => h.id === id)
}

export function getHospitalsByCity(city: string): Hospital[] {
  return HOSPITALS.filter(h => h.city === city)
}

export function getNearbyHospitals(latitude: number, longitude: number, radiusKm: number = 20) {
  return HOSPITALS
    .map(hospital => {
      const distance = calculateDistance(latitude, longitude, hospital.coordinates.latitude, hospital.coordinates.longitude)
      if (distance <= radiusKm) {
        return {
          ...hospital,
          distance,
          estimatedTime: Math.round(distance * 2), // ~2 min per km
        }
      }
      return null
    })
    .filter(Boolean)
    .sort((a, b) => (a?.distance || 0) - (b?.distance || 0))
}

export function getNearbyBirthCenters(latitude: number, longitude: number, radiusKm: number = 20) {
  return BIRTH_CENTERS
    .map(center => {
      const distance = calculateDistance(latitude, longitude, center.coordinates.latitude, center.coordinates.longitude)
      if (distance <= radiusKm) {
        return {
          ...center,
          distance,
          estimatedTime: Math.round(distance * 2),
        }
      }
      return null
    })
    .filter(Boolean)
    .sort((a, b) => (a?.distance || 0) - (b?.distance || 0))
}

// Haversine formula to calculate distance between two coordinates
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// Emergency contacts
export const EMERGENCY_NUMBERS = {
  AMBULANCE: '192',
  FIRE: '193',
  POLICE: '190',
  POISON_CONTROL: '0800 722 6001',
}

// Default hospital for app
export const DEFAULT_HOSPITAL = HOSPITALS[0]
