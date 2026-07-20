/**
 * AnamnesisPoll - Periodic health assessment during labor
 */

import React, { useState } from 'react'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { Modal } from '@/components/Modal'
import { Badge } from '@/components/Badge'
import { AnamnesisService, AnamnesisResponse } from '@/services/anamnesisService'
import { useLaborStore } from '@/store/laborStore'
import { NotificationService } from '@/services/notificationService'
import { logger } from '@/utils/logger'

interface AnamnesisPollProps {
  sessionId: string
  onAlertGenerated?: (alertLevel: 'GREEN' | 'YELLOW' | 'RED') => void
}

export const AnamnesisPoll: React.FC<AnamnesisPollProps> = ({
  sessionId,
  onAlertGenerated,
}) => {
  const [showPoll, setShowPoll] = useState(false)
  const [lastPollTime, setLastPollTime] = useState<number | null>(null)
  const [currentResponse, setCurrentResponse] = useState<AnamnesisResponse | null>(null)
  const [alertResult, setAlertResult] = useState<'GREEN' | 'YELLOW' | 'RED' | null>(null)
  const [showResult, setShowResult] = useState(false)

  const addAnamnesisRecord = useLaborStore(state => state.addAnamnesisRecord)

  // const questions = AnamnesisService.getQuestions()

  const handleStartPoll = () => {
    const now = Date.now()
    if (lastPollTime && now - lastPollTime < 15 * 60 * 1000) {
      // Less than 15 minutes since last poll
      alert('Aguarde pelo menos 15 minutos para fazer a próxima avaliação')
      return
    }
    setShowPoll(true)
  }

  const handleSubmitPoll = () => {
    if (!currentResponse) return

    // Evaluate response
    const alertLevel = AnamnesisService.evaluateResponse(currentResponse)
    const message = AnamnesisService.getAlertMessage(currentResponse)

    // Create record
    const record = AnamnesisService.createRecord(sessionId, currentResponse)
    addAnamnesisRecord(record)

    // Show result
    setAlertResult(alertLevel)
    setShowResult(true)
    setLastPollTime(Date.now())

    // Send notification if needed
    if (alertLevel === 'RED') {
      NotificationService.sendEmergency(message)
    } else if (alertLevel === 'YELLOW') {
      NotificationService.sendAlert('warning', message)
    }

    // Callback
    onAlertGenerated?.(alertLevel)

    logger.info('AnamnesisPoll: Poll submitted', {
      alertLevel,
      sessionId,
    })

    // Close main modal after showing results
    setTimeout(() => {
      setShowPoll(false)
      setCurrentResponse(null)
    }, 5000)
  }

  const handleOptionSelect = (field: keyof AnamnesisResponse, value: any) => {
    setCurrentResponse(prev => ({
      ...(prev || {} as AnamnesisResponse),
      [field]: value,
    } as AnamnesisResponse))
  }

  const canSubmit = currentResponse && Object.values(currentResponse).every(v => v !== null)

  return (
    <div className="space-y-3">
      {/* CTA Button */}
      <Button
        onClick={handleStartPoll}
        size="lg"
        isFullWidth
        variant="secondary"
        leftIcon="❓"
      >
        Como você está? (Avaliação Rápida)
      </Button>

      {/* Last Poll Info */}
      {lastPollTime && (
        <p className="text-xs text-dark-500 text-center">
          Última avaliação: {Math.round((Date.now() - lastPollTime) / 60000)} minuto(s) atrás
        </p>
      )}

      {/* Poll Modal */}
      <Modal
        isOpen={showPoll}
        onClose={() => {
          setShowPoll(false)
          setCurrentResponse(null)
        }}
        title="Avaliação de Saúde"
        size="lg"
        closeOnBackdropClick={false}
      >
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {/* Fetal Movement */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-dark-200">
              Como está a movimentação do bebê?
            </label>
            <div className="space-y-2">
              <button
                onClick={() => handleOptionSelect('fetalMovement', 'normal')}
                className={`w-full p-3 rounded-lg text-left transition-all ${
                  currentResponse?.fetalMovement === 'normal'
                    ? 'bg-success/20 border-2 border-success'
                    : 'bg-dark-800 border border-dark-700 hover:border-dark-600'
                }`}
              >
                ✓ Normal - Bebê se mexendo bem
              </button>
              <button
                onClick={() => handleOptionSelect('fetalMovement', 'reduced')}
                className={`w-full p-3 rounded-lg text-left transition-all ${
                  currentResponse?.fetalMovement === 'reduced'
                    ? 'bg-warning-900/20 border-2 border-warning'
                    : 'bg-dark-800 border border-dark-700 hover:border-dark-600'
                }`}
              >
                ⚠️ Reduzida - Menos movimentos
              </button>
              <button
                onClick={() => handleOptionSelect('fetalMovement', 'absent')}
                className={`w-full p-3 rounded-lg text-left transition-all ${
                  currentResponse?.fetalMovement === 'absent'
                    ? 'bg-error/20 border-2 border-error'
                    : 'bg-dark-800 border border-dark-700 hover:border-dark-600'
                }`}
              >
                🚨 Ausente - Nenhum movimento
              </button>
            </div>
          </div>

          {/* Fluid Loss */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-dark-200">
              Houve perda de líquido? Qual a cor?
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: 'none', label: 'Não houve' },
                { value: 'clear', label: 'Claro' },
                { value: 'green', label: '🟢 Esverdeado' },
                { value: 'yellow', label: '🟡 Amarelado' },
                { value: 'dark', label: '⚫ Escuro' },
                { value: 'bloody', label: '🔴 Com sangue' },
              ].map(option => (
                <button
                  key={option.value}
                  onClick={() => handleOptionSelect('fluidLoss', option.value)}
                  className={`p-2 rounded-lg text-xs font-medium transition-all ${
                    currentResponse?.fluidLoss === option.value
                      ? 'bg-primary-600 text-dark-100'
                      : 'bg-dark-800 text-dark-300 hover:bg-dark-700'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Vaginal Bleeding */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-dark-200">
              Houve sangramento vaginal?
            </label>
            <div className="flex gap-2">
              {[
                { value: false, label: 'Não' },
                { value: true, label: 'Sim' },
              ].map(option => (
                <button
                  key={String(option.value)}
                  onClick={() => handleOptionSelect('vaginalBleeding', option.value)}
                  className={`flex-1 p-3 rounded-lg font-medium transition-all ${
                    currentResponse?.vaginalBleeding === option.value
                      ? 'bg-primary-600 text-dark-100'
                      : 'bg-dark-800 text-dark-300 hover:bg-dark-700'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            {currentResponse?.vaginalBleeding && (
              <div className="space-y-2">
                <label className="text-xs text-dark-400">Quantidade:</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'small', label: 'Pouco' },
                    { value: 'moderate', label: 'Moderado' },
                    { value: 'large', label: 'Muito' },
                  ].map(option => (
                    <button
                      key={option.value}
                      onClick={() => handleOptionSelect('bleedingAmount', option.value)}
                      className={`p-2 rounded text-xs transition-all ${
                        currentResponse?.bleedingAmount === option.value
                          ? 'bg-primary-600 text-dark-100'
                          : 'bg-dark-800 text-dark-300'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Abdominal Pain Between Contractions */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-dark-200">
              Sente dor abdominal constante entre as contrações?
            </label>
            <div className="flex gap-2">
              {[
                { value: false, label: 'Não' },
                { value: true, label: 'Sim' },
              ].map(option => (
                <button
                  key={String(option.value)}
                  onClick={() =>
                    handleOptionSelect('abdominalPainBetweenContractions', option.value)
                  }
                  className={`flex-1 p-3 rounded-lg font-medium transition-all ${
                    currentResponse?.abdominalPainBetweenContractions === option.value
                      ? 'bg-primary-600 text-dark-100'
                      : 'bg-dark-800 text-dark-300 hover:bg-dark-700'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            {currentResponse?.abdominalPainBetweenContractions && (
              <div className="space-y-2">
                <label className="text-xs text-dark-400">Intensidade:</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'mild', label: 'Leve' },
                    { value: 'moderate', label: 'Moderada' },
                    { value: 'severe', label: 'Severa' },
                  ].map(option => (
                    <button
                      key={option.value}
                      onClick={() => handleOptionSelect('painIntensity', option.value)}
                      className={`p-2 rounded text-xs transition-all ${
                        currentResponse?.painIntensity === option.value
                          ? 'bg-primary-600 text-dark-100'
                          : 'bg-dark-800 text-dark-300'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Fever */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-dark-200">
              Tem febre ou calafrios?
            </label>
            <div className="flex gap-2">
              {[
                { value: false, label: 'Não' },
                { value: true, label: 'Sim' },
              ].map(option => (
                <button
                  key={String(option.value)}
                  onClick={() => handleOptionSelect('hasChillsOrFever', option.value)}
                  className={`flex-1 p-3 rounded-lg font-medium transition-all ${
                    currentResponse?.hasChillsOrFever === option.value
                      ? 'bg-primary-600 text-dark-100'
                      : 'bg-dark-800 text-dark-300 hover:bg-dark-700'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            {currentResponse?.hasChillsOrFever && (
              <div className="space-y-2">
                <label className="text-xs text-dark-400">Temperatura:</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="Ex: 37.5"
                  value={currentResponse?.temperature || ''}
                  onChange={(e) => handleOptionSelect('temperature', parseFloat(e.target.value))}
                  className="w-full px-3 py-2 bg-dark-900 border border-dark-700 rounded text-dark-100 text-sm"
                />
              </div>
            )}
          </div>

          {/* Dizziness/Fainting */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-dark-200">
              Tem tontura ou sensação de desmaio?
            </label>
            <div className="flex gap-2">
              {[
                { value: false, label: 'Não' },
                { value: true, label: 'Sim' },
              ].map(option => (
                <button
                  key={String(option.value)}
                  onClick={() => handleOptionSelect('hasDizzinessOrFainting', option.value)}
                  className={`flex-1 p-3 rounded-lg font-medium transition-all ${
                    currentResponse?.hasDizzinessOrFainting === option.value
                      ? 'bg-primary-600 text-dark-100'
                      : 'bg-dark-800 text-dark-300 hover:bg-dark-700'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Vision Changes */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-dark-200">
              Está vendo turvo ou escuro?
            </label>
            <div className="flex gap-2">
              {[
                { value: false, label: 'Não' },
                { value: true, label: 'Sim' },
              ].map(option => (
                <button
                  key={String(option.value)}
                  onClick={() => handleOptionSelect('hasBlurredOrDarkVision', option.value)}
                  className={`flex-1 p-3 rounded-lg font-medium transition-all ${
                    currentResponse?.hasBlurredOrDarkVision === option.value
                      ? 'bg-error/30 border-2 border-error text-error'
                      : 'bg-dark-800 text-dark-300 hover:bg-dark-700'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-6 flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            isFullWidth
            onClick={() => {
              setShowPoll(false)
              setCurrentResponse(null)
            }}
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            size="sm"
            isFullWidth
            onClick={handleSubmitPoll}
            disabled={!canSubmit}
          >
            Enviar Avaliação
          </Button>
        </div>
      </Modal>

      {/* Result Modal */}
      <Modal
        isOpen={showResult}
        onClose={() => setShowResult(false)}
        title="Resultado da Avaliação"
        size="md"
        closeOnBackdropClick={false}
      >
        {alertResult && (
          <div className="space-y-4">
            <Card
              variant={
                alertResult === 'RED'
                  ? 'outlined'
                  : alertResult === 'YELLOW'
                  ? 'outlined'
                  : 'elevated'
              }
              padding="lg"
              className={
                alertResult === 'RED'
                  ? 'bg-error/10 border-error/50 text-center'
                  : alertResult === 'YELLOW'
                  ? 'bg-warning-900/20 border-warning/50 text-center'
                  : 'bg-success/10 border-success/50 text-center'
              }
            >
              <div className="text-4xl mb-3">
                {alertResult === 'RED' ? '🚨' : alertResult === 'YELLOW' ? '⚠️' : '✅'}
              </div>
              <Badge
                variant={
                  alertResult === 'RED' ? 'error' : alertResult === 'YELLOW' ? 'warning' : 'success'
                }
              >
                {alertResult === 'RED'
                  ? 'CRÍTICO - Procure Hospital'
                  : alertResult === 'YELLOW'
                  ? 'ALERTA - Prepare-se'
                  : 'TUDO BEM!'}
              </Badge>

              <div className="mt-4 text-dark-200">
                {alertResult === 'RED' && (
                  <p>
                    Detectamos sinais que requerem atenção médica imediata. 
                    <strong> Procure o hospital agora ou chame uma ambulância.</strong>
                  </p>
                )}
                {alertResult === 'YELLOW' && (
                  <p>
                    Sua avaliação mostrou alguns sinais de alerta. 
                    <strong> Prepare-se para ir ao hospital e comunique à sua equipe.</strong>
                  </p>
                )}
                {alertResult === 'GREEN' && (
                  <p>
                    Tudo parece bem! Continue se monitorando e não hesite em procurar 
                    ajuda se algo mudar.
                  </p>
                )}
              </div>
            </Card>

            <Button
              onClick={() => setShowResult(false)}
              size="sm"
              isFullWidth
              variant="primary"
            >
              Fechar
            </Button>
          </div>
        )}
      </Modal>
    </div>
  )
}
