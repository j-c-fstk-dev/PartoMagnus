/**
 * ContractionCounter - Main component for registering contractions
 */

import React, { useState } from 'react'
import { Button } from '@/components/Button'
import { Modal } from '@/components/Modal'
import { Input } from '@/components/Input'
import { Card } from '@/components/Card'
import { Badge } from '@/components/Badge'
import { useContractionLogic } from '@/hooks/useContractionLogic'
import { useVibration } from '@/hooks/useVibration'
import { formatInterval, formatDuration } from '@/utils/formatting'
import { logger } from '@/utils/logger'

interface ContractionCounterProps {
  onContractionAdded?: () => void
  sessionId: string
}

export const ContractionCounter: React.FC<ContractionCounterProps> = ({
  onContractionAdded,
  // sessionId - mantido para compatibilidade de interface
}) => {
  const {
    contractions,
    pattern,
    isTracking,
    error,
    setError,
    startContraction,
    endContraction,
    getTimeSinceLastContraction,
    getContractionCount,
  } = useContractionLogic()

  const { vibrateContractionDetected } = useVibration()

  const [showModal, setShowModal] = useState(false)
  const [duration, setDuration] = useState('45')
  const [intensity, setIntensity] = useState<'LEVE' | 'MODERADA' | 'FORTE'>('MODERADA')
  const [notes, setNotes] = useState('')

  const timeSinceLastContraction = getTimeSinceLastContraction()
  const contractionCount = getContractionCount()

  const handleStartTracking = () => {
    startContraction()
    vibrateContractionDetected()
    logger.info('ContractionCounter: Started tracking')
  }

  const handleEndTracking = () => {
    setShowModal(true)
  }

  const handleSaveContraction = () => {
    const durationNum = parseInt(duration)

    if (isNaN(durationNum) || durationNum < 20 || durationNum > 120) {
      setError('Duração deve estar entre 20 e 120 segundos')
      return
    }

    endContraction(intensity, notes)
    vibrateContractionDetected()

    // Reset form
    setDuration('45')
    setIntensity('MODERADA')
    setNotes('')
    setShowModal(false)

    // Callback
    onContractionAdded?.()

    logger.info('ContractionCounter: Contraction saved', {
      duration: durationNum,
      intensity,
    })
  }

  const handleRegisterQuick = (_dur: number, int: 'LEVE' | 'MODERADA' | 'FORTE') => {
    endContraction(int, '')
    vibrateContractionDetected()
    onContractionAdded?.()
  }

  return (
    <div className="space-y-4">
      {/* Main CTA Button */}
      <div className="text-center space-y-3">
        {isTracking ? (
          <Button
            onClick={handleEndTracking}
            size="xl"
            isFullWidth
            variant="danger"
            className="h-20 text-2xl animate-pulse"
          >
            ⏹️ Parar Contração
          </Button>
        ) : (
          <Button
            onClick={handleStartTracking}
            size="xl"
            isFullWidth
            variant="primary"
            className="h-20 text-2xl"
          >
            ➕ Registrar Contração
          </Button>
        )}

        {error && (
          <div className="p-3 bg-error/10 border border-error/50 rounded-lg text-error text-sm">
            {error}
          </div>
        )}
      </div>

      {/* Quick Registro Options */}
      {!isTracking && contractionCount > 0 && (
        <Card variant="outlined" padding="md">
          <p className="text-xs text-dark-400 mb-2 text-center">Ou registre rápido:</p>
          <div className="grid grid-cols-3 gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => handleRegisterQuick(30, 'LEVE')}
            >
              30s 😊
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => handleRegisterQuick(45, 'MODERADA')}
            >
              45s ��
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => handleRegisterQuick(60, 'FORTE')}
            >
              60s 😣
            </Button>
          </div>
        </Card>
      )}

      {/* Stats */}
      {contractionCount > 0 && (
        <Card variant="filled" padding="md" className="space-y-3">
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-400">{contractionCount}</div>
              <div className="text-xs text-dark-400">Contrações</div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-secondary-400">
                {pattern?.averageInterval
                  ? formatInterval(Math.round(pattern.averageInterval))
                  : '-'}
              </div>
              <div className="text-xs text-dark-400">Intervalo Médio</div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-accent-400">
                {timeSinceLastContraction !== null
                  ? formatDuration(timeSinceLastContraction)
                  : '-'}
              </div>
              <div className="text-xs text-dark-400">Última</div>
            </div>
          </div>

          {/* Regularity Score */}
          {pattern && (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-dark-400">Regularidade</span>
                <span className="text-primary-400 font-semibold">
                  {Math.round(pattern.regularityScore * 100)}%
                </span>
              </div>
              <div className="h-1.5 bg-dark-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary-600 to-secondary-600 transition-all duration-500"
                  style={{ width: `${pattern.regularityScore * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Intensity Trend */}
          {pattern && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-dark-400">Tendência de Intensidade</span>
              <Badge
                variant={
                  pattern.intensityTrend === 'increasing'
                    ? 'success'
                    : pattern.intensityTrend === 'decreasing'
                    ? 'warning'
                    : 'neutral'
                }
              >
                {pattern.intensityTrend === 'increasing'
                  ? '📈 Aumentando'
                  : pattern.intensityTrend === 'decreasing'
                  ? '📉 Diminuindo'
                  : '➡️ Estável'}
              </Badge>
            </div>
          )}
        </Card>
      )}

      {/* Recent Contractions List */}
      {contractions.length > 0 && (
        <Card variant="outlined" padding="md">
          <h4 className="text-sm font-semibold text-dark-200 mb-3">Últimas Contrações</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {contractions.slice(-5).reverse().map((contraction, index) => (
              <div
                key={contraction.id}
                className="flex items-center justify-between p-2 bg-dark-800/50 rounded text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-primary-400">#{contractionCount - index}</span>
                  <span className="text-dark-400">{contraction.duration}s</span>
                  <Badge
                    variant={
                      contraction.intensity === 'FORTE'
                        ? 'error'
                        : contraction.intensity === 'MODERADA'
                        ? 'warning'
                        : 'success'
                    }
                    size="sm"
                  >
                    {contraction.intensity}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Modal for detailed entry */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Registrar Contração"
        size="md"
      >
        <div className="space-y-4">
          <Input
            label="Duração (segundos)"
            type="number"
            min="20"
            max="120"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            error={error || undefined}
          />

          <div className="space-y-2">
            <label className="text-sm font-medium text-dark-200">Intensidade</label>
            <div className="flex gap-2">
              <Button
                variant={intensity === 'LEVE' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setIntensity('LEVE')}
                isFullWidth
              >
                😊 Leve
              </Button>
              <Button
                variant={intensity === 'MODERADA' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setIntensity('MODERADA')}
                isFullWidth
              >
                😐 Moderada
              </Button>
              <Button
                variant={intensity === 'FORTE' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setIntensity('FORTE')}
                isFullWidth
              >
                😣 Forte
              </Button>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-dark-200 block mb-2">
              Notas (opcional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Dor nas costas, mudei de posição..."
              className="w-full px-3 py-2 bg-dark-900 border border-dark-700 rounded-lg text-dark-100 text-sm resize-none h-20 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              isFullWidth
              onClick={() => setShowModal(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              size="sm"
              isFullWidth
              onClick={handleSaveContraction}
            >
              Salvar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
