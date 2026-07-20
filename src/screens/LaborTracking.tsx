/**
 * LaborTracking Screen - Main labor monitoring dashboard
 * Integrates all labor subcomponents
 */

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { Header } from '@/components/Header'
import { Modal } from '@/components/Modal'

import { ContractionCounter } from '@/screens/labor/ContractionCounter'
import { PhaseIndicator } from '@/screens/labor/PhaseIndicator'
import { AnamnesisPoll } from '@/screens/labor/AnamnesisPoll'
import { PositionGuide } from '@/screens/labor/PositionGuide'
import { BreathingGuide } from '@/screens/labor/BreathingGuide'
import { MusicPanel } from '@/screens/labor/MusicPanel'
import { SOSPanel } from '@/screens/labor/SOSPanel'
import { CompanionPanel } from '@/screens/labor/CompanionPanel'

import { useLaborStore } from '@/store/laborStore'
import { usePhaseDetection } from '@/hooks/usePhaseDetection'
import { NotificationService } from '@/services/notificationService'
import { NAVIGATION } from '@/config/routes'
import { formatDateTime, formatDuration } from '@/utils/formatting'
import { logger } from '@/utils/logger'

type TabType = 'contractions' | 'phases' | 'breathing' | 'positions' | 'music' | 'companion' | 'sos'

export const LaborTracking: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('contractions')
  const [showEndDialog, setShowEndDialog] = useState(false)
  const [sessionStarted, setSessionStarted] = useState(false)

  const contractions = useLaborStore(state => state.contractions)
  const currentSession = useLaborStore(state => state.currentSession)
  const createSession = useLaborStore(state => state.createSession)
  const endSession = useLaborStore(state => state.endSession)
  const reset = useLaborStore(state => state.reset)

  const { phase } = usePhaseDetection(contractions)

  // Initialize session on first mount
  useEffect(() => {
    if (!currentSession && !sessionStarted) {
      createSession('user-1') // TODO: Get actual user ID
      setSessionStarted(true)
      NotificationService.notifyMilestone('Acompanhamento de parto iniciado! 🎉')
      logger.info('LaborTracking: Session created')
    }
  }, [currentSession, sessionStarted, createSession])

  // Notify on phase changes
  useEffect(() => {
    if (phase && contractions.length > 0) {
      NotificationService.notifyPhaseChange(phase)
    }
  }, [phase, contractions.length])

  const handleContractionAdded = () => {
    // Check if should go to hospital
    const pattern = useLaborStore.getState().currentPattern
    if (pattern && pattern.averageInterval < 3 * 60) {
      NotificationService.sendAlert('phase-change', 'Contrações a cada 3 minutos - considere ir ao hospital!')
    }
  }

  const handleEndSession = () => {
    endSession('vaginal')
    setShowEndDialog(false)
    
    setTimeout(() => {
      window.location.href = NAVIGATION.postpartum()
    }, 1000)
  }

  const handleAbandonSession = () => {
    reset()
    window.location.href = NAVIGATION.home()
  }

  if (!currentSession) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <Card padding="lg" className="text-center">
          <p className="text-dark-300 mb-4">Carregando sessão...</p>
        </Card>
      </div>
    )
  }

  const sessionDuration = new Date().getTime() - new Date(currentSession.startTime).getTime()
  const hours = Math.floor(sessionDuration / 3600000)
  const minutes = Math.floor((sessionDuration % 3600000) / 60000)

  return (
    <div className="min-h-screen bg-dark-950 pb-20">
      {/* Header */}
      <Header
        title="Acompanhamento de Parto 👶"
        subtitle={`Duração: ${hours}h ${minutes}min | Fase: ${phase}`}
        rightAction={
          <div className="flex gap-2">
            <Button
              variant="danger"
              size="sm"
              onClick={() => setShowEndDialog(true)}
            >
              ⏹️ Finalizar
            </Button>
          </div>
        }
      />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        
        {/* Alert Banner */}
        {contractions.length < 3 && (
          <Card
            variant="outlined"
            padding="md"
            className="bg-primary-900/10 border-primary-700/30"
          >
            <p className="text-sm text-dark-200">
              💡 <strong>Bem-vindo!</strong> Comece registrando suas contrações para que possamos acompanhar seu progresso.
            </p>
          </Card>
        )}

        {/* Tabs Navigation */}
        <div className="overflow-x-auto">
          <div className="flex gap-2 min-w-max pb-2">
            {[
              { id: 'contractions' as TabType, label: 'Contrações', icon: '⏱️' },
              { id: 'phases' as TabType, label: 'Fase', icon: '📊' },
              { id: 'breathing' as TabType, label: 'Respiração', icon: '🫁' },
              { id: 'positions' as TabType, label: 'Posições', icon: '🧘' },
              { id: 'music' as TabType, label: 'Áudio', icon: '🎵' },
              { id: 'companion' as TabType, label: 'Acompanhante', icon: '🤝' },
              { id: 'sos' as TabType, label: 'SOS', icon: '🚨' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-primary-600 text-dark-100'
                    : 'bg-dark-800 text-dark-300 hover:bg-dark-700'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="space-y-4">
          {activeTab === 'contractions' && (
            <ContractionCounter
              sessionId={currentSession.id}
              onContractionAdded={handleContractionAdded}
            />
          )}

          {activeTab === 'phases' && (
            <PhaseIndicator contractions={contractions} />
          )}

          {activeTab === 'breathing' && (
            <BreathingGuide />
          )}

          {activeTab === 'positions' && (
            <PositionGuide />
          )}

          {activeTab === 'music' && (
            <MusicPanel />
          )}

          {activeTab === 'companion' && (
            <CompanionPanel currentPhase={phase} />
          )}

          {activeTab === 'sos' && (
            <>
              <AnamnesisPoll sessionId={currentSession.id} />
              <SOSPanel />
            </>
          )}
        </div>

        {/* Stats Card */}
        {contractions.length > 0 && (
          <Card variant="filled" padding="md" className="space-y-3">
            <h3 className="font-semibold text-dark-100">📈 Estatísticas</h3>
            <div className="grid grid-cols-4 gap-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-400">{contractions.length}</div>
                <div className="text-xs text-dark-400">Contrações</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary-400">
                  {formatDuration(
                    Math.round(contractions.reduce((sum, c) => sum + c.duration, 0) / contractions.length)
                  )}
                </div>
                <div className="text-xs text-dark-400">Duração Média</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent-400">
                  {contractions.length > 1
                    ? formatDuration(
                        Math.round(
                          (new Date(currentSession.startTime).getTime() -
                            new Date(contractions[contractions.length - 1].startTime).getTime()) /
                            contractions.length /
                            1000
                        )
                      )
                    : '-'}
                </div>
                <div className="text-xs text-dark-400">Intervalo Médio</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-warning">{hours}h {minutes}m</div>
                <div className="text-xs text-dark-400">Duração Total</div>
              </div>
            </div>
          </Card>
        )}

        {/* Motivational Message */}
        <Card
          variant="outlined"
          padding="md"
          className="bg-secondary-900/10 border-secondary-700/30 text-center"
        >
          <p className="text-sm text-dark-200 italic">
            "Você é forte. Seu corpo é inteligente. Seu bebé está a caminho. 
            Confie no processo. Confie em si mesma. 💕"
          </p>
        </Card>
      </div>

      {/* End Session Dialog */}
      <Modal
        isOpen={showEndDialog}
        onClose={() => setShowEndDialog(false)}
        title="Finalizar Sessão?"
        size="md"
        closeOnBackdropClick={false}
      >
        <div className="space-y-4">
          <div className="bg-dark-800/50 p-4 rounded-lg space-y-2">
            <p className="text-sm text-dark-200">
              <strong>Resumo da Sessão:</strong>
            </p>
            <div className="text-xs text-dark-400 space-y-1">
              <p>Início: {formatDateTime(currentSession.startTime)}</p>
              <p>Duração: {hours}h {minutes}min</p>
              <p>Contrações: {contractions.length}</p>
              <p>Fase Final: {phase}</p>
            </div>
          </div>

          <p className="text-sm text-dark-300">
            Tem certeza que deseja finalizar o acompanhamento?
          </p>

          <div className="space-y-2">
            <Button
              onClick={handleEndSession}
              variant="success"
              size="md"
              isFullWidth
              leftIcon="✓"
            >
              Sim, Finalizar Parto
            </Button>

            <Button
              onClick={() => setShowEndDialog(false)}
              variant="secondary"
              size="md"
              isFullWidth
            >
              Cancelar
            </Button>

            <button
              onClick={handleAbandonSession}
              className="w-full text-xs text-dark-500 hover:text-error transition-colors"
            >
              Interromper e voltar (perderá dados)
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
