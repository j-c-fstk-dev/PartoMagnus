/**
 * History Screen - Previous labor sessions and reports
 */

import React, { useState } from 'react'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { Header } from '@/components/Header'
import { Badge } from '@/components/Badge'
import { Modal } from '@/components/Modal'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { LaborSession } from '@/types/labor'
import { formatDateTime, formatDuration } from '@/utils/formatting'
import { logger } from '@/utils/logger'
import { ReportService } from '@/services/reportService'
import { STORAGE_KEYS } from '@/utils/constants'

export const History: React.FC = () => {
  const [sessions] = useLocalStorage<LaborSession[]>(STORAGE_KEYS.LABOR_SESSIONS_HISTORY, [])
  const [selectedSession, setSelectedSession] = useState<LaborSession | null>(null)
  const [showSessionDetails, setShowSessionDetails] = useState(false)

  const handleDownloadPDF = async (session: LaborSession) => {
    logger.info('History: Downloading PDF', { sessionId: session.id })
    await ReportService.downloadPDF(session, `parto-${session.id.slice(0, 8)}.pdf`)
  }

  const handleSharePDF = async (session: LaborSession) => {
    logger.info('History: Sharing PDF', { sessionId: session.id })
    await ReportService.sharePDF(session)
  }

  const getOutcomeLabel = (outcome?: string): string => {
    const labels: Record<string, string> = {
      vaginal: 'Parto Vaginal',
      cesarean: 'Cesárea',
      vac_extraction: 'Extração a Vácuo',
      forceps: 'Fórceps',
      not_completed: 'Não Concluído',
    }
    return labels[outcome || ''] || 'Não registrado'
  }

  const getOutcomeVariant = (outcome?: string) => {
    switch (outcome) {
      case 'vaginal':
        return 'success'
      case 'cesarean':
        return 'warning'
      default:
        return 'neutral'
    }
  }

  return (
    <div className="min-h-screen bg-dark-950">
      <Header title="Histórico de Partos" subtitle="Seus registros anteriores" />

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        
        {/* Empty State */}
        {sessions.length === 0 ? (
          <Card variant="elevated" padding="lg" className="text-center py-12">
            <div className="text-4xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-dark-100 mb-2">Nenhum parto registrado</h3>
            <p className="text-dark-400 mb-6">
              Comece um novo acompanhamento na home para registrar seu parto.
            </p>
            <Button variant="primary" onClick={() => window.history.back()}>
              Voltar
            </Button>
          </Card>
        ) : (
          <>
            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card variant="outlined" padding="md" className="text-center">
                <div className="text-2xl font-bold text-primary-400">{sessions.length}</div>
                <div className="text-xs text-dark-400">Total de Partos</div>
              </Card>

              <Card variant="outlined" padding="md" className="text-center">
                <div className="text-2xl font-bold text-success">
                  {sessions.filter(s => s.outcome === 'vaginal').length}
                </div>
                <div className="text-xs text-dark-400">Partos Vaginais</div>
              </Card>

              <Card variant="outlined" padding="md" className="text-center">
                <div className="text-2xl font-bold text-warning">
                  {sessions.filter(s => s.outcome === 'cesarean').length}
                </div>
                <div className="text-xs text-dark-400">Cesáreas</div>
              </Card>

              <Card variant="outlined" padding="md" className="text-center">
                <div className="text-2xl font-bold text-secondary-400">
                  {Math.round(
                    sessions.reduce((sum, s) => {
                      const duration = s.endTime
                        ? new Date(s.endTime).getTime() - new Date(s.startTime).getTime()
                        : 0
                      return sum + duration
                    }, 0) / 3600000
                  )}h
                </div>
                <div className="text-xs text-dark-400">Tempo Total</div>
              </Card>
            </div>

            {/* Sessions List */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-dark-100">📅 Registros</h3>
              
              {sessions.map((session) => {
                const duration = session.endTime
                  ? new Date(session.endTime).getTime() - new Date(session.startTime).getTime()
                  : 0

                return (
                  <Card
                    key={session.id}
                    variant="default"
                    padding="md"
                    hoverable
                    clickable
                    onClick={() => {
                      setSelectedSession(session)
                      setShowSessionDetails(true)
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-dark-100">
                            Parto de {formatDateTime(session.startTime).split(' ')[0]}
                          </h4>
                          <Badge variant={getOutcomeVariant(session.outcome)}>
                            {getOutcomeLabel(session.outcome)}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-dark-500">Duração:</span>
                            <span className="text-dark-200 ml-2">
                              {formatDuration(duration / 1000)}
                            </span>
                          </div>

                          {session.contractions.length > 0 && (
                            <div>
                              <span className="text-dark-500">Contrações:</span>
                              <span className="text-dark-200 ml-2">
                                {session.contractions.length}
                              </span>
                            </div>
                          )}

                          {session.babyWeight && (
                            <div>
                              <span className="text-dark-500">Peso do bebê:</span>
                              <span className="text-dark-200 ml-2">
                                {session.babyWeight}g
                              </span>
                            </div>
                          )}

                          {session.babyHeight && (
                            <div>
                              <span className="text-dark-500">Comprimento:</span>
                              <span className="text-dark-200 ml-2">
                                {session.babyHeight}cm
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDownloadPDF(session)
                          }}
                        >
                          📥
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleSharePDF(session)
                          }}
                        >
                          📤
                        </Button>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          </>
        )}
      </div>

      {/* Session Details Modal */}
      <Modal
        isOpen={showSessionDetails}
        onClose={() => setShowSessionDetails(false)}
        title="Detalhes do Parto"
        size="lg"
      >
        {selectedSession && (
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-dark-200 mb-2">Informações Básicas</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-dark-500">Início:</span>
                  <p className="text-dark-200">{formatDateTime(selectedSession.startTime)}</p>
                </div>
                <div>
                  <span className="text-dark-500">Término:</span>
                  <p className="text-dark-200">
                    {selectedSession.endTime
                      ? formatDateTime(selectedSession.endTime)
                      : 'Em andamento'}
                  </p>
                </div>
              </div>
            </div>

            {selectedSession.contractions.length > 0 && (
              <div>
                <h4 className="font-semibold text-dark-200 mb-2">Contrações</h4>
                <div className="text-sm">
                  <p className="text-dark-300">
                    Total: {selectedSession.contractions.length} contrações
                  </p>
                </div>
              </div>
            )}

            {selectedSession.babyWeight || selectedSession.babyHeight ? (
              <div>
                <h4 className="font-semibold text-dark-200 mb-2">Bebê</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {selectedSession.babyWeight && (
                    <div>
                      <span className="text-dark-500">Peso:</span>
                      <p className="text-dark-200">{selectedSession.babyWeight}g</p>
                    </div>
                  )}
                  {selectedSession.babyHeight && (
                    <div>
                      <span className="text-dark-500">Comprimento:</span>
                      <p className="text-dark-200">{selectedSession.babyHeight}cm</p>
                    </div>
                  )}
                </div>
              </div>
            ) : null}

            <div className="flex gap-2 pt-4 border-t border-dark-800">
              <Button
                variant="primary"
                size="sm"
                isFullWidth
                onClick={() => handleDownloadPDF(selectedSession)}
              >
                📥 Baixar PDF
              </Button>
              <Button
                variant="secondary"
                size="sm"
                isFullWidth
                onClick={() => handleSharePDF(selectedSession)}
              >
                📤 Compartilhar
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
