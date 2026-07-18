/**
 * Custom hook for geolocation and hospital finding
 */

import { useState, useEffect, useCallback } from 'react'
import { GeolocationCoords } from '@/types/index'
import { NearbyHospital, BirthCenter } from '@/types/hospital'
import { GeolocationService } from '@/services/geolocationService'
import { logger } from '@/utils/logger'

export interface GeolocationState {
  coords: GeolocationCoords | null
  isLoading: boolean
  error: string | null
  accuracy: number | null
}

export function useGeolocation(autoStart: boolean = true) {
  const [state, setState] = useState<GeolocationState>({
    coords: null,
    isLoading: false,
    error: null,
    accuracy: null,
  })

  const [nearbyHospitals, setNearbyHospitals] = useState<NearbyHospital[] | null>(null)
  const [nearbyBirthCenters, setNearbyBirthCenters] = useState<BirthCenter[] | null>(null)
  const [hospitalsLoading, setHospitalsLoading] = useState(false)

  /**
   * Get current location
   */
  const getLocation = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const coords = await GeolocationService.getCurrentLocation()

      if (coords) {
        setState({
          coords,
          isLoading: false,
          error: null,
          accuracy: coords.accuracy,
        })
        logger.debug('useGeolocation: Location obtained', coords)
      } else {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: 'Não foi possível obter localização',
        }))
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Erro ao obter localização'
      setState({
        coords: null,
        isLoading: false,
        error: errorMsg,
        accuracy: null,
      })
      logger.error('useGeolocation: Failed to get location', error)
    }
  }, [])

  /**
   * Find nearby hospitals
   */
  const findNearbyHospitals = useCallback(
    async (radiusKm: number = 20) => {
      if (!state.coords) {
        setState(prev => ({ ...prev, error: 'Localização não disponível' }))
        return
      }

      setHospitalsLoading(true)

      try {
        const hospitals = await GeolocationService.getNearbyHospitals(radiusKm)
        setNearbyHospitals(hospitals)
        logger.info('useGeolocation: Nearby hospitals found', {
          count: hospitals?.length || 0,
        })
      } catch (error) {
        logger.error('useGeolocation: Failed to find nearby hospitals', error)
        setNearbyHospitals([])
      } finally {
        setHospitalsLoading(false)
      }
    },
    [state.coords]
  )

  /**
   * Find nearby birth centers
   */
  const findNearbyBirthCenters = useCallback(
    async (radiusKm: number = 20) => {
      if (!state.coords) {
        setState(prev => ({ ...prev, error: 'Localização não disponível' }))
        return
      }

      setHospitalsLoading(true)

      try {
        const centers = await GeolocationService.getNearbyBirthCenters(radiusKm)
        setNearbyBirthCenters(centers)
        logger.info('useGeolocation: Nearby birth centers found', {
          count: centers?.length || 0,
        })
      } catch (error) {
        logger.error('useGeolocation: Failed to find nearby birth centers', error)
        setNearbyBirthCenters([])
      } finally {
        setHospitalsLoading(false)
      }
    },
    [state.coords]
  )

  /**
   * Get distance to location
   */
  const getDistance = useCallback(
    (lat: number, lon: number): number | null => {
      if (!state.coords) return null
      return GeolocationService.getDistance(state.coords.latitude, state.coords.longitude, lat, lon)
    },
    [state.coords]
  )

  /**
   * Calculate ETA
   */
  const calculateETA = useCallback((distanceKm: number): number => {
    return GeolocationService.calculateETA(distanceKm)
  }, [])

  /**
   * Check if has good accuracy
   */
  const hasGoodAccuracy = useCallback((threshold: number = 100): boolean => {
    if (!state.coords) return false
    return GeolocationService.hasGoodAccuracy(state.coords, threshold)
  }, [state.coords])

  /**
   * Share location
   */
  const shareLocation = useCallback(async (): Promise<boolean> => {
    return GeolocationService.shareLocation()
  }, [])

  /**
   * Reset state
   */
  const reset = useCallback(() => {
    setState({
      coords: null,
      isLoading: false,
      error: null,
      accuracy: null,
    })
    setNearbyHospitals(null)
    setNearbyBirthCenters(null)
  }, [])

  /**
   * Auto-start on mount if requested
   */
  useEffect(() => {
    if (autoStart) {
      getLocation()
    }
  }, [autoStart, getLocation])

  return {
    // Location state
    coords: state.coords,
    isLoading: state.isLoading,
    error: state.error,
    accuracy: state.accuracy,

    // Nearby facilities
    nearbyHospitals,
    nearbyBirthCenters,
    hospitalsLoading,

    // Actions
    getLocation,
    findNearbyHospitals,
    findNearbyBirthCenters,
    shareLocation,
    reset,

    // Queries
    getDistance,
    calculateETA,
    hasGoodAccuracy,
  }
}
