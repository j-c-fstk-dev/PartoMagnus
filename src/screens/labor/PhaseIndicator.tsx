/**
 * PhaseIndicator - Visual phase progression and information
 */

import React from 'react'
import { Card } from '@/components/Card'
import { Badge } from '@/components/Badge'
import { ProgressBar } from '@/components/ProgressBar'
import { LaborPhase } from '@/types/labor'
import { usePhaseDetection } from '@/hooks/usePhaseDetection'
import { Contraction } from '@/types/labor'

interface PhaseIndicatorProps {
  contractions: Contraction[]
  multiparous?: boolean
  riskFactors?: boolean
}

const PHASE_INFO: Record<LaborPhase, {
  name: string
  emoji: string
  description: string
  avgDuration: string
  characteristics: string[]
  recommendations: string[]
  color: 'primary' | 'secondary' | 'warning' | 'error'
}> = {
  PRODROMAL: {
    name: 'Pré-Parto (Pródromo)',
    emoji: '��',
    description: 'Seu corpo está se preparando. Contrações irregulares e indolores.',
    avgDuration: '1-2 dias',
    characteristics: [
      'Contrações irregulares',
      'Sem dilatação cervical progressiva',
      'Pode haver perda de tampão mucoso',
      'Desconforto abdominal',
    ],
    recommendations: [
      'Descanse bastante',
      'Hidrate-se bem',
      'Caminhe se confortável',
      'Não se preocupe, é normal',
    ],
    color: 'primary',
  },
  LATENT: {
    name: 'Fase Latente',
    emoji: '🌅',
    description: 'Inicio do trabalho de parto. Contrações começam a regularizar.',
    avgDuration: '2-8 horas',
    characteristics: [
      'Contrações a cada 15-30 minutos',
      'Duração: 30-45 segundos',
      'Dilatação: 0-3 cm',
      'Você consegue conversar durante as contrações',
    ],
    recommendations: [
      'Caminhe bastante',
      'Mude de posição frequentemente',
      'Coma e beba regularmente',
      'Relaxe entre as contrações',
    ],
    color: 'primary',
  },
  ACTIVE: {
    name: 'Fase Ativa',
    emoji: '⚡',
    description: 'Trabalho de parto está progredindo. Contrações mais fortes e regulares.',
    avgDuration: '2-5 horas',
    characteristics: [
      'Contrações a cada 3-5 minutos',
      'Duração: 45-60 segundos',
      'Dilatação: 3-7 cm',
      'Dor mais intensa',
      'Dificuldade em falar durante contrações',
    ],
    recommendations: [
      'Use técnicas de respiração',
      'Mude de posição frequentemente',
      'Tenha seu acompanhante perto',
      'Considere analgesia se necessário',
      'Continue se movimentando',
    ],
    color: 'secondary',
  },
  TRANSITION: {
    name: 'Transição',
    emoji: '🔥',
    description: 'O momento mais intenso! Você está muito perto.',
    avgDuration: '0.5-1 hora',
    characteristics: [
      'Contrações a cada 2-3 minutos',
      'Duração: 60-90 segundos',
      'Dilatação: 7-10 cm',
      'Sensação de pressão',
      'Possível necessidade de empurrar',
    ],
    recommendations: [
      'Respire profundamente',
      'Pedidos ao seu acompanhante',
      'Não perca a esperança',
      'Você está quase lá!',
    ],
    color: 'warning',
  },
  EXPULSIVE: {
    name: 'Expulsiva (Puxo)',
    emoji: '👶',
    description: 'Hora de empurrar! Seu bebê está nascendo.',
    avgDuration: '15 min - 2 horas',
    characteristics: [
      'Impulso irresistível de empurrar',
      'Contrações a cada 2-3 minutos',
      'Sensação de queimação',
      'Visualização do bebê',
      'Fase final',
    ],
    recommendations: [
      'Siga seus impulsos naturais',
      'Empurre quando sentir vontade',
      'Descanse entre contrações',
      'Seu bebê está saindo!',
    ],
    color: 'error',
  },
  DEQUITACAO: {
    name: 'Dequitação',
    emoji: '🎉',
    description: 'Expulsão da placenta. Seu bebê já nasceu!',
    avgDuration: '5-30 minutos',
    characteristics: [
      'Bebê nasceu',
      'Contrações leves continuam',
      'Saída da placenta',
      'Sangramento vaginal',
    ],
    recommendations: [
      'Acompanhe seu bebê',
      'Amamentação pode começar',
      'Contato pele a pele',
      'Relaxe e aproveite',
    ],
    color: 'primary',
  },
  COMPLETED: {
    name: 'Parto Concluído',
    emoji: '✨',
    description: 'Parabéns! Seu bebê nasceu com segurança.',
    avgDuration: '-',
    characteristics: [
      'Parto finalizado',
      'Mãe e bebê bem',
      'Placenta expulsa',
    ],
    recommendations: [
      'Descanso',
      'Recuperação',
      'Aleitamento materno',
    ],
    color: 'primary',
  },
}

export const PhaseIndicator: React.FC<PhaseIndicatorProps> = ({
  contractions,
  multiparous = false,
  riskFactors = false,
}) => {
  const { phase, analysis } = usePhaseDetection(contractions, multiparous, riskFactors)

  const phaseData = PHASE_INFO[phase]
  const progress = analysis?.progressPercentage || 0

  return (
    <div className="space-y-4">
      {/* Main Phase Card */}
      <Card
        variant="elevated"
        padding="lg"
        className="bg-gradient-to-br from-dark-900 to-dark-800"
      >
        <div className="space-y-4">
          {/* Phase Header */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="text-5xl">{phaseData.emoji}</div>
              <h2 className="text-2xl font-bold text-dark-100">{phaseData.name}</h2>
            </div>
            <Badge variant={phaseData.color}>{phase}</Badge>
          </div>

          {/* Description */}
          <p className="text-dark-200">{phaseData.description}</p>

          {/* Progress Bar */}
          <ProgressBar
            value={progress}
            showLabel
            label="Progresso"
            variant={phaseData.color}
          />

          {/* Key Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-dark-800/50 p-3 rounded-lg">
              <span className="text-xs text-dark-500">Duração Média</span>
              <p className="text-dark-100 font-semibold">{phaseData.avgDuration}</p>
            </div>

            {analysis && (
              <div className="bg-dark-800/50 p-3 rounded-lg">
                <span className="text-xs text-dark-500">
                  {analysis.timeToActivePhase !== null
                    ? 'Tempo Estimado'
                    : 'Status'}
                </span>
                <p className="text-dark-100 font-semibold">
                  {analysis.timeToActivePhase !== null
                    ? `~${analysis.timeToActivePhase} min`
                    : 'Em progresso'}
                </p>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Characteristics */}
      <Card variant="outlined" padding="md">
        <h4 className="text-sm font-semibold text-dark-200 mb-3">✓ Características desta fase</h4>
        <ul className="space-y-2 text-sm">
          {phaseData.characteristics.map((char, index) => (
            <li key={index} className="flex gap-2 text-dark-300">
              <span className="text-primary-400">•</span>
              <span>{char}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Recommendations */}
      <Card variant="outlined" padding="md" className="bg-primary-900/10 border-primary-700/30">
        <h4 className="text-sm font-semibold text-dark-200 mb-3">💡 Recomendações</h4>
        <ul className="space-y-2 text-sm">
          {phaseData.recommendations.map((rec, index) => (
            <li key={index} className="flex gap-2 text-dark-300">
              <span className="text-primary-400">→</span>
              <span>{rec}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Alert Status */}
      {analysis && (
        <Card
          variant={
            analysis.shouldGoToHospital
              ? 'outlined'
              : 'default'
          }
          padding="md"
          className={
            analysis.shouldGoToHospital
              ? 'bg-warning-900/10 border-warning/50'
              : ''
          }
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">
              {analysis.shouldGoToHospital ? '🏥' : '✓'}
            </span>
            <p className="text-sm text-dark-200">
              {analysis.shouldGoToHospital
                ? 'É recomendado procurar o hospital agora.'
                : 'Você pode continuar monitorando em casa por enquanto.'}
            </p>
          </div>
        </Card>
      )}
    </div>
  )
}
