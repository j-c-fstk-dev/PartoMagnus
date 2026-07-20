/**
 * Geolocation service for location tracking and hospital finding
 */

import { GeolocationCoords } from '@/types/index'
import { getNearbyHospitals, getNearbyBirthCenters, calculateDistance } from '@/config/hospitals'
import { logger } from '@/utils/logger'

export class GeolocationService {
  private static watchId: number | null = null
  private static lastPosition: GeolocationCoords | null = null

  /**
   * Get current user location
   */
  static async getCurrentLocation(): Promise<GeolocationCoords | null> {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        logger.warn('GeolocationService: Geolocation not supported')
        resolve(null)
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords: GeolocationCoords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          }
          this.lastPosition = coords
          logger.info('GeolocationService: Location obtained', coords)
          resolve(coords)
        },
        (error) => {
          logger.error('GeolocationService: Failed to get location', error)
          resolve(null)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      )
    })
  }

  /**
   * Watch location changes
   */
  static watchLocation(callback: (coords: GeolocationCoords) => void): number | null {
    if (!navigator.geolocation) {
      logger.warn('GeolocationService: Geolocation not supported')
      return null
    }

    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        const coords: GeolocationCoords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        }
        this.lastPosition = coords
        callback(coords)
      },
      (error) => {
        logger.error('GeolocationService: Watch error', error)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5000,
      }
    )

    logger.info('GeolocationService: Location watch started')
    return this.watchId
  }

  /**
   * Stop watching location
   */
  static stopWatchingLocation(): void {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId)
      this.watchId = null
      logger.info('GeolocationService: Location watch stopped')
    }
  }

  /**
   * Get last known position
   */
  static getLastPosition(): GeolocationCoords | null {
    return this.lastPosition
  }

  /**
   * Find nearby hospitals
   */
  static async getNearbyHospitals(
    radiusKm: number = 20
  ): Promise<ReturnType<typeof getNearbyHospitals> | null> {
    try {
      const location = await this.getCurrentLocation()
      if (!location) {
        logger.warn('GeolocationService: Could not get location for hospital search')
        return null
      }

      const hospitals = getNearbyHospitals(location.latitude, location.longitude, radiusKm)
      logger.info('GeolocationService: Found nearby hospitals', {
        count: hospitals.length,
        radiusKm,
      })

      return hospitals
    } catch (error) {
      logger.error('GeolocationService: Failed to find nearby hospitals', error)
      return null
    }
  }

  /**
   * Find nearby birth centers
   */
  static async getNearbyBirthCenters(
    radiusKm: number = 20
  ): Promise<ReturnType<typeof getNearbyBirthCenters> | null> {
    try {
      const location = await this.getCurrentLocation()
      if (!location) {
        logger.warn('GeolocationService: Could not get location for birth center search')
        return null
      }

      const centers = getNearbyBirthCenters(location.latitude, location.longitude, radiusKm)
      logger.info('GeolocationService: Found nearby birth centers', {
        count: centers.length,
        radiusKm,
      })

      return centers
    } catch (error) {
      logger.error('GeolocationService: Failed to find nearby birth centers', error)
      return null
    }
  }

  /**
   * Get distance between two points
   */
  static getDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    return calculateDistance(lat1, lon1, lat2, lon2)
  }

  /**
   * Calculate ETA in minutes (rough estimate: 2 min per km)
   */
  static calculateETA(distanceKm: number): number {
    return Math.round(distanceKm * 2)
  }

  /**
   * Format location for display
   */
  static formatLocation(coords: GeolocationCoords): string {
    return `${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}`
  }

  /**
   * Check if location has good accuracy
   */
  static hasGoodAccuracy(coords: GeolocationCoords, thresholdMeters: number = 100): boolean {
    return coords.accuracy <= thresholdMeters
  }

  /**
   * Request permission check
   */
  static async checkPermission(): Promise<boolean> {
    if (!navigator.geolocation) {
      logger.warn('GeolocationService: Geolocation not supported')
      return false
    }

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        () => {
          logger.info('GeolocationService: Permission granted')
          resolve(true)
        },
        () => {
          logger.warn('GeolocationService: Permission denied')
          resolve(false)
        }
      )
    })
  }

  /**
   * Get coordinates from hospital ID
   */
  static async getHospitalCoordinates(hospitalId: string): Promise<{ latitude: number; longitude: number } | null> {
    try {
      const hospitals = await this.getNearbyHospitals(100)
      if (!hospitals) return null

      const hospital = hospitals?.find(h => h.id === hospitalId)
      return hospital
        ? {
            latitude: hospital.coordinates.latitude,
            longitude: hospital.coordinates.longitude,
          }
        : null
    } catch (error) {
      logger.error('GeolocationService: Failed to get hospital coordinates', error)
      return null
    }
  }

  /**
   * Generate Google Maps URL for directions
   */
  static getGoogleMapsURL(
    destinationLat: number,
    destinationLon: number,
    originLat?: number,
    originLon?: number
  ): string {
    if (originLat && originLon) {
      return `https://www.google.com/maps/dir/${originLat},${originLon}/${destinationLat},${destinationLon}`
    }
    return `https://www.google.com/maps/search/${destinationLat},${destinationLon}`
  }

  /**
   * Generate Apple Maps URL for directions
   */
  static getAppleMapsURL(
    destinationLat: number,
    destinationLon: number,
    originLat?: number,
    originLon?: number
  ): string {
    if (originLat && originLon) {
      return `maps://maps.apple.com/?saddr=${originLat},${originLon}&daddr=${destinationLat},${destinationLon}`
    }
    return `maps://maps.apple.com/?q=${destinationLat},${destinationLon}`
  }

  /**
   * Share location
   */
  static async shareLocation(): Promise<boolean> {
    try {
      const location = await this.getCurrentLocation()
      if (!location) return false

      if (navigator.share) {
        await navigator.share({
          title: 'Minha Localização',
          text: `Estou em: ${this.formatLocation(location)}`,
          url: this.getGoogleMapsURL(location.latitude, location.longitude),
        })
        logger.info('GeolocationService: Location shared')
        return true
      }

      logger.warn('GeolocationService: Share not supported')
      return false
    } catch (error) {
      logger.error('GeolocationService: Failed to share location', error)
      return false
    }
  }
}
