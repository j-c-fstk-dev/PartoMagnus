/**
 * Audio service for managing sound and music
 * Handles frequency generation, playback, and audio management
 */

import { SOLFEGGIO_FREQUENCIES } from '@/utils/constants'
import { logger } from '@/utils/logger'

export interface AudioPlaybackState {
  isPlaying: boolean
  currentTrackId?: string
  currentTime: number
  duration: number
  volume: number
  isLooping: boolean
}

export class AudioService {
  private static audioContext: AudioContext | null = null
  private static currentOscillator: OscillatorNode | null = null
  private static gainNode: GainNode | null = null
  private static isPlaying = false

  /**
   * Initialize Web Audio API
   */
  static initAudioContext(): AudioContext {
    if (!this.audioContext) {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      this.audioContext = audioContext
      this.gainNode = audioContext.createGain()
      this.gainNode.connect(audioContext.destination)
      logger.debug('AudioService: AudioContext initialized')
    }
    return this.audioContext
  }

  /**
   * Generate and play a Solfeggio frequency
   */
  static playFrequency(frequency: number, duration: number = 5000): void {
    try {
      const audioContext = this.initAudioContext()

      // Stop current playback
      if (this.currentOscillator) {
        this.stopFrequency()
      }

      // Create oscillator
      const oscillator = audioContext.createOscillator()
      oscillator.type = 'sine'
      oscillator.frequency.value = frequency

      // Connect to gain node
      oscillator.connect(this.gainNode!)
      this.gainNode!.connect(audioContext.destination)

      // Set volume (0.1 to avoid being too loud)
      this.gainNode!.gain.setValueAtTime(0.1, audioContext.currentTime)

      // Start oscillator
      oscillator.start()
      this.currentOscillator = oscillator
      this.isPlaying = true

      logger.info(`AudioService: Playing ${frequency}Hz frequency`)

      // Stop after duration
      setTimeout(() => {
        this.stopFrequency()
      }, duration)
    } catch (error) {
      logger.error('AudioService: Failed to play frequency', error)
    }
  }

  /**
   * Stop current frequency playback
   */
  static stopFrequency(): void {
    try {
      if (this.currentOscillator) {
        this.currentOscillator.stop()
        this.currentOscillator = null
      }
      this.isPlaying = false
      logger.debug('AudioService: Frequency stopped')
    } catch (error) {
      logger.error('AudioService: Failed to stop frequency', error)
    }
  }

  /**
   * Set volume (0-1)
   */
  static setVolume(volume: number): void {
    try {
      const audioContext = this.initAudioContext()
      const clampedVolume = Math.max(0, Math.min(1, volume))
      this.gainNode!.gain.setValueAtTime(clampedVolume, audioContext.currentTime)
      logger.debug('AudioService: Volume set to', { volume: clampedVolume })
    } catch (error) {
      logger.error('AudioService: Failed to set volume', error)
    }
  }

  /**
   * Get frequency info by Hz value
   */
  static getFrequencyInfo(frequency: number): {
    name: string
    benefits: string[]
  } | null {
    return SOLFEGGIO_FREQUENCIES[frequency as keyof typeof SOLFEGGIO_FREQUENCIES] || null
  }

  /**
   * Play a breathing guide audio file
   */
  static async playBreathingGuide(audioUrl: string, volume: number = 0.7): Promise<void> {
    try {
      const audioContext = this.initAudioContext()
      const response = await fetch(audioUrl)
      const arrayBuffer = await response.arrayBuffer()
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)

      const source = audioContext.createBufferSource()
      source.buffer = audioBuffer
      source.connect(this.gainNode!)

      this.gainNode!.gain.setValueAtTime(volume, audioContext.currentTime)
      source.start(0)

      logger.info('AudioService: Playing breathing guide')
    } catch (error) {
      logger.error('AudioService: Failed to play breathing guide', error)
    }
  }

  /**
   * Play affirmation audio
   */
  static async playAffirmation(audioUrl: string, volume: number = 0.8): Promise<void> {
    try {
      const audioContext = this.initAudioContext()
      const response = await fetch(audioUrl)
      const arrayBuffer = await response.arrayBuffer()
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)

      const source = audioContext.createBufferSource()
      source.buffer = audioBuffer
      source.connect(this.gainNode!)

      this.gainNode!.gain.setValueAtTime(volume, audioContext.currentTime)
      source.start(0)

      logger.info('AudioService: Playing affirmation')
    } catch (error) {
      logger.error('AudioService: Failed to play affirmation', error)
    }
  }

  /**
   * Play ambient sound
   */
  static async playAmbientSound(audioUrl: string, volume: number = 0.5, loop: boolean = true): Promise<void> {
    try {
      const audioContext = this.initAudioContext()
      const response = await fetch(audioUrl)
      const arrayBuffer = await response.arrayBuffer()
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)

      const source = audioContext.createBufferSource()
      source.buffer = audioBuffer
      source.loop = loop
      source.connect(this.gainNode!)

      this.gainNode!.gain.setValueAtTime(volume, audioContext.currentTime)
      source.start(0)

      logger.info('AudioService: Playing ambient sound')
    } catch (error) {
      logger.error('AudioService: Failed to play ambient sound', error)
    }
  }

  /**
   * Request microphone permission
   */
  static async requestMicrophonePermission(): Promise<boolean> {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true })
      logger.info('AudioService: Microphone permission granted')
      return true
    } catch (error) {
      logger.warn('AudioService: Microphone permission denied', error)
      return false
    }
  }

  /**
   * Check if audio is supported
   */
  static isAudioSupported(): boolean {
    return !!(
      window.AudioContext ||
      (window as any).webkitAudioContext ||
      (window as any).mozAudioContext ||
      (window as any).oAudioContext ||
      (window as any).msAudioContext
    )
  }

  /**
   * Check if vibration is supported
   */
  static isVibrationSupported(): boolean {
    return !!navigator.vibrate
  }

  /**
   * Trigger haptic feedback (vibration)
   */
  static vibrate(pattern: number | number[] = 50): boolean {
    try {
      if (navigator.vibrate) {
        navigator.vibrate(pattern)
        logger.debug('AudioService: Vibration triggered')
        return true
      }
      return false
    } catch (error) {
      logger.warn('AudioService: Vibration failed', error)
      return false
    }
  }

  /**
   * Vibration pattern for contraction detection
   */
  static vibrateContractionDetected(): void {
    this.vibrate([100, 50, 100]) // Double tap pattern
  }

  /**
   * Vibration pattern for alert
   */
  static vibrateAlert(): void {
    this.vibrate([200, 100, 200, 100, 200]) // SOS pattern
  }

  /**
   * Vibration pattern for success
   */
  static vibrateSuccess(): void {
    this.vibrate([50, 30, 50]) // Triple tap
  }

  /**
   * Create a simple beep sound
   */
  static playBeep(frequency: number = 800, duration: number = 100): void {
    try {
      const audioContext = this.initAudioContext()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.value = frequency
      oscillator.type = 'sine'

      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + duration / 1000)

      logger.debug('AudioService: Beep played')
    } catch (error) {
      logger.error('AudioService: Failed to play beep', error)
    }
  }

  /**
   * Resume audio context if suspended (required for autoplay)
   */
  static async resumeAudioContext(): Promise<void> {
    try {
      const audioContext = this.initAudioContext()
      if (audioContext.state === 'suspended') {
        await audioContext.resume()
        logger.info('AudioService: AudioContext resumed')
      }
    } catch (error) {
      logger.error('AudioService: Failed to resume AudioContext', error)
    }
  }
}
