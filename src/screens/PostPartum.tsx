/**
 * PostPartum Screen - After delivery celebration and documentation
 */

import React, { useState } from 'react'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { Header } from '@/components/Header'
import { Input } from '@/components/Input'
import { useLaborStore } from '@/store/laborStore'
import { NAVIGATION } from '@/config/routes'
import { formatDateTime } from '@/utils/formatting'
import { logger } from '@/utils/logger'
import { ReportService } from '@/services/reportService'

export const PostPartum: React.FC = () => {
  const currentSession = useLaborStore(state => state.currentSession)
  const endSession = useLaborStore(state => state.endSession)

  const [babyData, setBabyData] = useState({
    weight: '',
    height: '',
    apgarOne: '',
    apgarFive: '',
  })

  const [userRating, setUserRating] = useState(5)
  const [userNotes, setUserNotes] = useState('')
  const [_showSummary, setShowSummary] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  if (!currentSession) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <Card padding="lg" className="text-center">
          <p className="text-dark-300 mb-4">Nenhuma sessão ativa</p>
          <Button onClick={() => window.location.href = NAVIGATION.home()}>
            Voltar à Home
          </Button>
        </Card>
      </div>
    )
  }

  const handleSaveData = async () => {
    setIsSaving(true)
    try {
      // Update session with baby data and notes
      endSession('vaginal')

      logger.info('PostPartum: Data saved', {
        weight: babyData.weight,
        height: babyData.height,
      })

      setShowSummary(false)
    } catch (error) {
      logger.error('PostPartum: Failed to save data', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDownloadReport = async () => {
    if (currentSession) {
      await ReportService.downloadPDF(currentSession)
    }
  }

  const totalDuration = currentSession.endTime
    ? new Date(currentSession.endTime).getTime() - new Date(currentSession.startTime).getTime()
    : 0

  const totalHours = Math.floor(totalDuration / 3600000)
  const totalMinutes = Math.floor((totalDuration % 3600000) / 60000)

  return (
    <div className="min-h-screen bg-dark-950">
      <Header title="Parabéns! 🎉" subtitle="Seu bebê nasceu!" />

      <div className="max-w-2xl mx-auto p-6 space-y-6">
        
        {/* Celebration Card */}
        <div className="bg-gradient-to-r from-primary-600/20 to-secondary-600/20 border border-primary-700/50 rounded-lg p-8 text-center space-y-4">
          <div className="text-6xl mb-4">👶✨</div>
          <h2 className="text-3xl font-bold text-dark-100">Bem-vindo ao Mundo!</h2>
          <p className="text-lg text-dark-300">
            Você foi incrivelmente corajosa e forte. Seu bebê está aqui! 💕
          </p>
        </div>

        {/* Summary Card */}
        <Card variant="elevated" padding="lg" className="space-y-4">
          <h3 className="text-xl font-semibold text-dark-100">📊 Resumo do Parto</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-dark-800/50 p-3 rounded-lg">
              <span className="text-dark-500 text-sm">Horário de Início</span>
              <p className="text-dark-100 font-semibold">{formatDateTime(currentSession.startTime)}</p>
            </div>

            <div className="bg-dark-800/50 p-3 rounded-lg">
              <span className="text-dark-500 text-sm">Duração Total</span>
              <p className="text-dark-100 font-semibold">
                {totalHours}h {totalMinutes}min
              </p>
            </div>

            <div className="bg-dark-800/50 p-3 rounded-lg">
              <span className="text-dark-500 text-sm">Contrações</span>
              <p className="text-dark-100 font-semibold">{currentSession.contractions.length}</p>
            </div>

            <div className="bg-dark-800/50 p-3 rounded-lg">
              <span className="text-dark-500 text-sm">Desfecho</span>
              <p className="text-success font-semibold">Parto Vaginal</p>
            </div>
          </div>
        </Card>

        {/* Baby Data Form */}
        <Card variant="outlined" padding="lg" className="space-y-4">
          <h3 className="text-xl font-semibold text-dark-100">👶 Dados do Bebê</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Peso (gramas)"
              type="number"
              placeholder="Ex: 3500"
              value={babyData.weight}
              onChange={(e) => setBabyData(prev => ({ ...prev, weight: e.target.value }))}
            />
            <Input
              label="Comprimento (cm)"
              type="number"
              placeholder="Ex: 50"
              value={babyData.height}
              onChange={(e) => setBabyData(prev => ({ ...prev, height: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Apgar 1º minuto"
              type="number"
              min="0"
              max="10"
              placeholder="0-10"
              value={babyData.apgarOne}
              onChange={(e) => setBabyData(prev => ({ ...prev, apgarOne: e.target.value }))}
            />
            <Input
              label="Apgar 5º minuto"
              type="number"
              min="0"
              max="10"
              placeholder="0-10"
              value={babyData.apgarFive}
              onChange={(e) => setBabyData(prev => ({ ...prev, apgarFive: e.target.value }))}
            />
          </div>
        </Card>

        {/* Experience Rating */}
        <Card variant="outlined" padding="lg" className="space-y-4">
          <h3 className="text-xl font-semibold text-dark-100">⭐ Como foi sua experiência?</h3>
          
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setUserRating(star)}
                className={`text-4xl transition-transform ${
                  star <= userRating ? 'scale-125' : 'opacity-50'
                }`}
              >
                ⭐
              </button>
            ))}
          </div>

          <textarea
            value={userNotes}
            onChange={(e) => setUserNotes(e.target.value)}
            placeholder="Deixe uma nota sobre sua experiência (opcional)..."
            className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-lg text-dark-100 placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none h-20"
          />
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={handleSaveData}
            isLoading={isSaving}
            size="lg"
            isFullWidth
            variant="success"
            leftIcon="💾"
          >
            Salvar Dados do Parto
          </Button>

          <Button
            onClick={handleDownloadReport}
            size="lg"
            isFullWidth
            variant="primary"
            leftIcon="📄"
          >
            Baixar Relatório em PDF
          </Button>

          <Button
            onClick={() => window.location.href = NAVIGATION.home()}
            size="lg"
            isFullWidth
            variant="secondary"
          >
            Voltar à Home
          </Button>
        </div>

        {/* Additional Information */}
        <Card variant="outlined" padding="md" className="bg-secondary-900/10 border-secondary-700/30">
          <div className="space-y-2 text-sm">
            <p className="font-semibold text-dark-200">💡 Próximos Passos:</p>
            <ul className="text-dark-400 space-y-1 ml-4">
              <li>✓ Descanso e recuperação (primeiras 6 semanas)</li>
              <li>✓ Acompanhamento puerperal com seu médico</li>
              <li>✓ Aleitamento materno exclusivo (se possível)</li>
              <li>✓ Contato pele a pele com seu bebê</li>
            </ul>
          </div>
        </Card>

        {/* Gratitude */}
        <Card variant="outlined" padding="lg" className="text-center space-y-3">
          <p className="text-dark-200 text-lg italic">
            "Você acabou de realizar um dos feitos mais extraordinários da vida humana. 
            Parabéns pela sua força, resiliência e amor."
          </p>
          <p className="text-dark-400 text-sm">
            — Beregenerative
          </p>
        </Card>

        <div className="h-6" />
      </div>
    </div>
  )
}
