/**
 * Anamnesis service for risk assessment and clinical evaluation
 */

import { AnamnesisRecord, AlertLevel } from '@/types/labor'
import { logger } from '@/utils/logger'

export interface AnamnesisResponse {
  fetalMovement: 'normal' | 'reduced' | 'absent'
  fluidLoss: 'none' | 'clear' | 'green' | 'yellow' | 'dark' | 'bloody'
  vaginalBleeding: boolean
  bleedingAmount?: 'small' | 'moderate' | 'large'
  abdominalPainBetweenContractions: boolean
  painIntensity?: 'mild' | 'moderate' | 'severe'
  hasChillsOrFever: boolean
  temperature?: number
  hasDizzinessOrFainting: boolean
  hasBlurredOrDarkVision: boolean
}

export class AnamnesisService {
  /**
   * Evaluate anamnesis response and return alert level
   */
  static evaluateResponse(response: AnamnesisResponse): AlertLevel {
    logger.debug('AnamnesisService: Evaluating response', response)

    // RED ALERTS - Immediate hospitalization needed
    if (this.hasRedAlert(response)) {
      return 'RED'
    }

    // YELLOW ALERTS - Should inform hospital, prepare to go
    if (this.hasYellowAlert(response)) {
      return 'YELLOW'
    }

    // GREEN - All good
    return 'GREEN'
  }

  /**
   * Check for critical (RED) alerts
   */
  private static hasRedAlert(response: AnamnesisResponse): boolean {
    // Fetal distress signs
    if (response.fetalMovement === 'absent') {
      logger.warn('AnamnesisService: RED ALERT - No fetal movement')
      return true
    }

    // Meconium-stained fluid
    if (response.fluidLoss === 'green' || response.fluidLoss === 'dark') {
      logger.warn('AnamnesisService: RED ALERT - Meconium in fluid')
      return true
    }

    // Heavy vaginal bleeding
    if (response.vaginalBleeding && response.bleedingAmount === 'large') {
      logger.warn('AnamnesisService: RED ALERT - Heavy bleeding')
      return true
    }

    // Constant severe abdominal pain (not from contractions)
    if (response.abdominalPainBetweenContractions && response.painIntensity === 'severe') {
      logger.warn('AnamnesisService: RED ALERT - Severe constant pain')
      return true
    }

    // Fever
    if (response.hasChillsOrFever && response.temperature && response.temperature > 38.5) {
      logger.warn('AnamnesisService: RED ALERT - High fever')
      return true
    }

    // Vision changes (preeclampsia sign)
    if (response.hasBlurredOrDarkVision) {
      logger.warn('AnamnesisService: RED ALERT - Vision changes')
      return true
    }

    // Loss of consciousness
    if (response.hasDizzinessOrFainting) {
      logger.warn('AnamnesisService: RED ALERT - Fainting')
      return true
    }

    return false
  }

  /**
   * Check for warning (YELLOW) alerts
   */
  private static hasYellowAlert(response: AnamnesisResponse): boolean {
    // Reduced fetal movement
    if (response.fetalMovement === 'reduced') {
      logger.warn('AnamnesisService: YELLOW ALERT - Reduced fetal movement')
      return true
    }

    // Vaginal bleeding (any amount)
    if (response.vaginalBleeding && response.bleedingAmount !== undefined) {
      logger.warn('AnamnesisService: YELLOW ALERT - Vaginal bleeding')
      return true
    }

    // Moderate abdominal pain between contractions
    if (response.abdominalPainBetweenContractions && response.painIntensity === 'moderate') {
      logger.warn('AnamnesisService: YELLOW ALERT - Moderate pain between contractions')
      return true
    }

    // Fever (moderate)
    if (response.hasChillsOrFever && response.temperature && response.temperature > 37.8) {
      logger.warn('AnamnesisService: YELLOW ALERT - Fever')
      return true
    }

    // Dizziness (not fainting)
    if (response.hasDizzinessOrFainting && !response.hasBlurredOrDarkVision) {
      logger.warn('AnamnesisService: YELLOW ALERT - Dizziness')
      return true
    }

    return false
  }

  /**
   * Get detailed alert message
   */
  static getAlertMessage(response: AnamnesisResponse): string {
    if (response.fetalMovement === 'absent') {
      return 'Nenhum movimento fetal detectado. Procure hospital IMEDIATAMENTE.'
    }

    if (response.fluidLoss === 'green' || response.fluidLoss === 'dark') {
      return 'Líquido com mecônio detectado. Possível sofrimento fetal. Vá para hospital.'
    }

    if (response.vaginalBleeding && response.bleedingAmount === 'large') {
      return 'Sangramento vaginal intenso. Risco de descolamento de placenta. Procure hospital.'
    }

    if (response.abdominalPainBetweenContractions && response.painIntensity === 'severe') {
      return 'Dor abdominal constante e intensa. Possível complicação obstétrica. Vá para hospital.'
    }

    if (response.hasBlurredOrDarkVision) {
      return 'Visão turva/escura. Possível pré-eclampsia. Procure hospital IMEDIATAMENTE.'
    }

    if (response.hasDizzinessOrFainting) {
      return 'Tontura ou desmaio. Procure atendimento médico.'
    }

    if (response.hasChillsOrFever && response.temperature && response.temperature > 38.5) {
      return 'Febre alta detectada. Procure hospital.'
    }

    if (response.fetalMovement === 'reduced') {
      return 'Movimentos fetais reduzidos. Mantenha observação. Se persistir, procure hospital.'
    }

    if (response.vaginalBleeding) {
      return 'Sangramento vaginal detectado. Procure hospital para avaliação.'
    }

    if (response.abdominalPainBetweenContractions && response.painIntensity === 'moderate') {
      return 'Dor abdominal moderada entre contrações. Prepare-se para ir ao hospital.'
    }

    if (response.hasChillsOrFever && response.temperature && response.temperature > 37.8) {
      return 'Febre moderada detectada. Comunique à equipe de saúde.'
    }

    return 'Seus sintomas estão dentro do esperado. Continue monitorando.'
  }

  /**
   * Get recommended action
   */
  static getRecommendedAction(alertLevel: AlertLevel): string {
    switch (alertLevel) {
      case 'RED':
        return 'PROCURE HOSPITAL IMEDIATAMENTE OU CHAME AMBULÂNCIA'
      case 'YELLOW':
        return 'Prepare-se para ir ao hospital. Comunique à equipe.'
      case 'GREEN':
        return 'Continue o monitoramento em casa.'
      default:
        return 'Monitore seus sintomas'
    }
  }

  /**
   * Create anamnesis record from response
   */
  static createRecord(sessionId: string, response: AnamnesisResponse): AnamnesisRecord {
    const alertLevel = this.evaluateResponse(response)
    const message = this.getAlertMessage(response)

    const record: AnamnesisRecord = {
      id: crypto.randomUUID(),
      sessionId,
      timestamp: new Date().toISOString(),
      fetalMovement: response.fetalMovement,
      fluidLoss: response.fluidLoss,
      vaginalBleeding: response.vaginalBleeding,
      bleedingAmount: response.bleedingAmount,
      abdominalPainBetweenContractions: response.abdominalPainBetweenContractions,
      painIntensity: response.painIntensity,
      painConstant: response.abdominalPainBetweenContractions,
      hasChillsOrFever: response.hasChillsOrFever,
      temperature: response.temperature,
      hasDizzinessOrFainting: response.hasDizzinessOrFainting,
      hasBlurredOrDarkVision: response.hasBlurredOrDarkVision,
      generalObservations: message,
      alertLevel,
      requiresHospitalization: alertLevel === 'RED' || alertLevel === 'YELLOW',
      createdAt: new Date().toISOString(),
    }

    logger.info('AnamnesisService: Record created', {
      sessionId,
      alertLevel,
    })

    return record
  }

  /**
   * Check if tampon loss (mucus plug) is normal
   */
  static isTamponMucosoLoss(
    fluidLoss: string,
    _color: string
  ): boolean {
    // Tampão mucoso é gelatinoso, às vezes com rajas de sangue
    // Não é líquido claro nem verde
    return (
      fluidLoss !== 'clear' &&
      fluidLoss !== 'green' &&
      fluidLoss !== 'dark' &&
      fluidLoss !== 'bloody'
    )
  }

  /**
   * Get anamnesis questions
   */
  static getQuestions(): Array<{
    id: string
    question: string
    type: 'multiple-choice' | 'yes-no' | 'numeric'
    options?: string[]
  }> {
    return [
      {
        id: 'fetal-movement',
        question: 'Como está a movimentação do bebê?',
        type: 'multiple-choice',
        options: ['Normal', 'Reduzida', 'Ausente'],
      },
      {
        id: 'fluid-loss',
        question: 'Houve perda de líquido? Qual a cor?',
        type: 'multiple-choice',
        options: ['Não', 'Claro', 'Esverdeado', 'Amarelado', 'Escuro', 'Com sangue'],
      },
      {
        id: 'vaginal-bleeding',
        question: 'Houve sangramento vaginal?',
        type: 'yes-no',
      },
      {
        id: 'pain-between',
        question: 'Sente dor abdominal constante entre as contrações?',
        type: 'yes-no',
      },
      {
        id: 'fever',
        question: 'Tem febre ou calafrios?',
        type: 'yes-no',
      },
      {
        id: 'dizziness',
        question: 'Tem tontura ou sensação de desmaio?',
        type: 'yes-no',
      },
      {
        id: 'vision',
        question: 'Está vendo turvo ou escuro?',
        type: 'yes-no',
      },
    ]
  }
}
