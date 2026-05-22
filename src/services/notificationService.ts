/**
 * Notification service for push notifications and in-app alerts
 */

import { NotificationPayload } from '@/types/index'
import { NOTIFICATION_TAGS } from '@/utils/constants'
import { logger } from '@/utils/logger'

export class NotificationService {
  /**
   * Request notification permission
   */
  static async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      logger.warn('NotificationService: Notifications not supported')
      return false
    }

    if (Notification.permission === 'granted') {
      return true
    }

    if (Notification.permission !== 'denied') {
      try {
        const permission = await Notification.requestPermission()
        const granted = permission === 'granted'
        logger.info('NotificationService: Permission requested', { granted })
        return granted
      } catch (error) {
        logger.error('NotificationService: Failed to request permission', error)
        return false
      }
    }

    return false
  }

  /**
   * Check if notifications are enabled
   */
  static isEnabled(): boolean {
    return 'Notification' in window && Notification.permission === 'granted'
  }

  /**
   * Send notification
   */
  static async sendNotification(payload: NotificationPayload): Promise<void> {
    try {
      if (!this.isEnabled()) {
        logger.warn('NotificationService: Notifications not enabled')
        return
      }

      const notification = new Notification(payload.title, {
        body: payload.body,
        icon: payload.icon || '/logo.svg',
        badge: payload.badge || '/app-icon-192.png',
        tag: payload.tag || 'default',
        requireInteraction: false,
      })

      notification.onclick = () => {
        window.focus()
        notification.close()
      }

      logger.info('NotificationService: Notification sent', { title: payload.title })
    } catch (error) {
      logger.error('NotificationService: Failed to send notification', error)
    }
  }

  /**
   * Send phase change notification
   */
  static async notifyPhaseChange(phase: string): Promise<void> {
    const messages: Record<string, { title: string; body: string }> = {
      LATENT: {
        title: '🌙 Fase Latente',
        body: 'Você entrou na fase latente. Continue descansando e se hidratando.',
      },
      ACTIVE: {
        title: '⚡ Fase Ativa',
        body: 'Você entrou na fase ativa! Contrações estão progredindo. Considere ir ao hospital.',
      },
      TRANSITION: {
        title: '🔥 Transição',
        body: 'Você está na transição - o momento mais intenso! Você está chegando perto!',
      },
      EXPULSIVE: {
        title: '👶 Hora de Empurrar!',
        body: 'Seu bebê está nascendo! Siga os impulsos do seu corpo.',
      },
      DEQUITACAO: {
        title: '🎉 Dequitação',
        body: 'Seu bebê nasceu! Agora a placenta será expulsa.',
      },
    }

    const message = messages[phase]
    if (message) {
      await this.sendNotification({
        title: message.title,
        body: message.body,
        tag: NOTIFICATION_TAGS.PHASE_CHANGE,
      })
    }
  }

  /**
   * Send milestone notification
   */
  static async notifyMilestone(message: string): Promise<void> {
    await this.sendNotification({
      title: '✨ Marco Alcançado',
      body: message,
      tag: NOTIFICATION_TAGS.MILESTONE,
    })
  }

  /**
   * Send affirmation notification
   */
  static async sendAffirmation(affirmation: string): Promise<void> {
    await this.sendNotification({
      title: '💪 Afirmação',
      body: affirmation,
      tag: NOTIFICATION_TAGS.AFFIRMATION,
    })
  }

  /**
   * Send hydration reminder
   */
  static async remindHydration(): Promise<void> {
    await this.sendNotification({
      title: '💧 Hidratação',
      body: 'Beba água ou suco para se manter hidratada.',
      tag: NOTIFICATION_TAGS.HYDRATION_REMINDER,
    })
  }

  /**
   * Send movement reminder
   */
  static async remindMovement(): Promise<void> {
    await this.sendNotification({
      title: '🚶 Movimento',
      body: 'Mude de posição ou caminhe um pouco para facilitar a progressão.',
      tag: NOTIFICATION_TAGS.MOVEMENT_REMINDER,
    })
  }

  /**
   * Send alert notification
   */
  static async sendAlert(alertType: string, message: string): Promise<void> {
    await this.sendNotification({
      title: '⚠️ Alerta',
      body: message,
      tag: NOTIFICATION_TAGS.ALERT,
    })
  }

  /**
   * Send emergency notification
   */
  static async sendEmergency(message: string): Promise<void> {
    await this.sendNotification({
      title: '🚨 EMERGÊNCIA',
      body: message,
      tag: NOTIFICATION_TAGS.EMERGENCY,
    })
  }

  /**
   * Schedule notifications for labor phase
   */
  static schedulePhaseNotifications(phase: string): NodeJS.Timeout[] {
    const timers: NodeJS.Timeout[] = []

    const affirmations: Record<string, string[]> = {
      LATENT: [
        'Seu corpo está se preparando naturalmente',
        'Descanse e preserve sua energia',
        'Cada momento é um progresso',
      ],
      ACTIVE: [
        'Você está na fase ativa! Cada contração te traz perto',
        'Seu corpo é forte e capaz',
        'Respire profundamente, você consegue',
      ],
      TRANSITION: [
        'Este é o momento mais intenso, mas também o mais curto',
        'Você está quase lá!',
        'Seu bebê está chegando muito perto',
      ],
      EXPULSIVE: [
        'Seu bebê está nascendo!',
        'Empurre quando sentir vontade',
        'Você é forte demais!',
      ],
    }

    const phaseAffirmations = affirmations[phase] || []

    // Send random affirmation every 30 minutes
    const affirmationTimer = setInterval(
      async () => {
        const randomAffirmation = phaseAffirmations[Math.floor(Math.random() * phaseAffirmations.length)]
        if (randomAffirmation) {
          await this.sendAffirmation(randomAffirmation)
        }
      },
      30 * 60 * 1000 // 30 minutes
    )

    timers.push(affirmationTimer)

    // Send hydration reminder every 20 minutes during active/transition
    if (phase === 'ACTIVE' || phase === 'TRANSITION') {
      const hydrationTimer = setInterval(
        async () => {
          await this.remindHydration()
        },
        20 * 60 * 1000 // 20 minutes
      )
      timers.push(hydrationTimer)
    }

    logger.info('NotificationService: Phase notifications scheduled', {
      phase,
      timerCount: timers.length,
    })

    return timers
  }

  /**
   * Cancel scheduled notifications
   */
  static cancelScheduledNotifications(timers: NodeJS.Timeout[]): void {
    timers.forEach(timer => clearInterval(timer))
    logger.info('NotificationService: Scheduled notifications cancelled', {
      count: timers.length,
    })
  }

  /**
   * Show badge notification count
   */
  static async setBadgeCount(count: number): Promise<void> {
    if ('setAppBadge' in navigator) {
      try {
        if (count > 0) {
          await (navigator as any).setAppBadge(count)
        } else {
          await (navigator as any).clearAppBadge()
        }
        logger.debug('NotificationService: Badge updated', { count })
      } catch (error) {
        logger.warn('NotificationService: Failed to set badge', error)
      }
    }
  }

  /**
   * Register service worker for push notifications
   */
  static async registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
    if (!('serviceWorker' in navigator)) {
      logger.warn('NotificationService: Service Workers not supported')
      return null
    }

    try {
      const registration = await navigator.serviceWorker.register('/sw.js')
      logger.info('NotificationService: Service Worker registered')
      return registration
    } catch (error) {
      logger.error('NotificationService: Failed to register Service Worker', error)
      return null
    }
  }

  /**
   * Get notification permission status
   */
  static getPermissionStatus(): string {
    return Notification.permission
  }
}
