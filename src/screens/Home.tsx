/**
 * Home Screen - Main dashboard pre-labor
 */

import React, { useState } from 'react'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { Header } from '@/components/Header'
import { Badge } from '@/components/Badge'
import { Modal } from '@/components/Modal'
import { useUserStore } from '@/store/userStore'
import { useAppStore } from '@/store/appStore'
import { NAVIGATION } from '@/config/routes'
import { formatDate } from '@/utils/formatting'
import { logger } from '@/utils/logger'

export const Home: React.FC = () => {
  const user = useUserStore(state => state.user)
  const anamnesis = useUserStore(state => state.anamnesis)
  const setLaboring = useAppStore(state => state.setLaboring)
  const [showTips, setShowTips] = useState(false)
  const [currentTip, setCurrentTip] = useState(0)

  const tips = [
    '💡 Caminhar 20 minutos por dia ajuda o encaixe do bebê e fortalece as pernas para o parto.',
    '🥗 Comer tâmaras (6 por dia) a partir da 37ª semana pode facilitar a dilatação cervical.',
    '🎵 Frequências sonoras de 432 Hz ajudam no relaxamento durante o trabalho de parto.',
    '💧 Manter-se hidratada é fundamental para a progressão do parto.',
    '🧘‍♀️ Técnicas de respiração abdominal reduzem o estresse e a dor.',
  ]

  const handleStartLabor = () => {
    setLaboring(true)
    logger.info('Home: Started labor monitoring')
    window.location.href = NAVIGATION.labor()
  }

  const handleNextTip = () => {
    setCurrentTip((current) => (current + 1) % tips.length)
  }

  if (!user || !anamnesis) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <Card padding="lg" className="text-center">
          <p className="text-dark-300 mb-4">Carregando dados...</p>
        </Card>
      </div>
    )
  }

  const weeksDifference = Math.floor(
    (new Date(anamnesis.estimatedDueDate).getTime() - new Date().getTime()) / 
    (1000 * 60 * 60 * 24 * 7)
  )

  return (
    <div className="min-h-screen bg-dark-950">
      <Header
        title={`Olá, ${user.name?.split(' ')[0]}! 👶`}
        subtitle="Bem-vindo ao Parto Magnus"
      />

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        
        {/* Welcome Card */}
        <Card variant="elevated" padding="lg">
          <div className="text-center space-y-3">
            <h2 className="text-2xl font-bold text-dark-100">Você está com {anamnesis.currentWeek} semanas</h2>
            <p className="text-dark-400">
              Data prevista: <span className="text-primary-400 font-semibold">{formatDate(anamnesis.estimatedDueDate)}</span>
            </p>
            <p className="text-dark-400">
              {weeksDifference > 0 
                ? `Faltam ${weeksDifference} semana(s) para o termo`
                : 'Você já passou da data prevista - importante contato médico'}
            </p>
            
            {anamnesis.riskLevel !== 'low' && (
              <Badge variant={anamnesis.riskLevel === 'high' ? 'error' : 'warning'}>
                ⚠️ Risco: {anamnesis.riskLevel === 'high' ? 'Alto' : 'Médio'}
              </Badge>
            )}
          </div>
        </Card>

        {/* Risk Level Alert */}
        {anamnesis.riskLevel !== 'low' && (
          <div className={`p-4 rounded-lg border ${
            anamnesis.riskLevel === 'high' 
              ? 'bg-error/10 border-error/50 text-error' 
              : 'bg-warning-900/30 border-warning/50 text-warning'
          }`}>
            <p className="font-semibold mb-2">
              ⚠️ Seu caso requer acompanhamento médico próximo
            </p>
            <p className="text-sm">
              Este app é um suporte, não substitui a equipe de saúde. Mantenha contato regular com seu médico.
            </p>
          </div>
        )}

        {/* Próximos Marcos */}
        <Card variant="outlined" padding="lg" className="space-y-3">
          <h3 className="text-lg font-semibold text-dark-100 flex items-center gap-2">
            📍 Próximos Marcos
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center p-2 rounded hover:bg-dark-800">
              <span className="text-dark-300">37 semanas (Termo)</span>
              <Badge variant="success">✓ Alcançado</Badge>
            </div>
            <div className="flex justify-between items-center p-2 rounded hover:bg-dark-800">
              <span className="text-dark-300">39 semanas (Pico de ocitocina)</span>
              <Badge variant="primary">{Math.max(0, 39 - anamnesis.currentWeek)} semana(s)</Badge>
            </div>
            <div className="flex justify-between items-center p-2 rounded hover:bg-dark-800">
              <span className="text-dark-300">Data prevista do parto</span>
              <Badge variant="primary">{weeksDifference > 0 ? weeksDifference + ' semanas' : 'Em breve'}</Badge>
            </div>
          </div>
        </Card>

        {/* Daily Tip */}
        <Card variant="elevated" padding="lg">
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-dark-100">💡 Dica do Dia</h3>
            <p className="text-dark-200 text-center italic">{tips[currentTip]}</p>
            <Button variant="ghost" size="sm" onClick={handleNextTip} className="mx-auto">
              Próxima Dica →
            </Button>
          </div>
        </Card>

        {/* Preparation Section */}
        <Card variant="outlined" padding="lg">
          <h3 className="text-lg font-semibold text-dark-100 mb-4">🎯 Preparação para o Parto</h3>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="secondary" size="sm">
              📚 Conhecer Fases
            </Button>
            <Button variant="secondary" size="sm">
              🫁 Respiração
            </Button>
            <Button variant="secondary" size="sm">
              🧘‍♀️ Posições
            </Button>
            <Button variant="secondary" size="sm">
              🥗 Alimentação
            </Button>
            <Button variant="secondary" size="sm">
              📋 Lei do Acompanhante
            </Button>
            <Button variant="secondary" size="sm">
              🎵 Frequências
            </Button>
          </div>
        </Card>

        {/* CTA - Start Labor */}
        <div className="space-y-3">
          <Button
            onClick={handleStartLabor}
            size="lg"
            isFullWidth
            leftIcon="🚀"
            className="bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700"
          >
            Iniciar Acompanhamento do Parto
          </Button>
          <p className="text-center text-xs text-dark-500">
            Clique quando começar a sentir contrações regulares
          </p>
        </div>

        {/* Companion Info */}
        {anamnesis.hasCompanion && (
          <Card variant="outlined" padding="md" className="bg-secondary-900/10 border-secondary-700/30">
            <p className="text-sm text-dark-200">
              👥 <span className="font-semibold">Acompanhante:</span> {anamnesis.companionName}
            </p>
          </Card>
        )}
      </div>

      {/* Tips Modal */}
      <Modal
        isOpen={showTips}
        onClose={() => setShowTips(false)}
        title="Dicas para o Parto"
        size="md"
      >
        <div className="space-y-4">
          {tips.map((tip, index) => (
            <p key={index} className="text-dark-200">{tip}</p>
          ))}
        </div>
      </Modal>
    </div>
  )
}
