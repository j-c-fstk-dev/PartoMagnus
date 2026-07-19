/**
 * BreathingGuide - Guided breathing techniques during labor
 */

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { Modal } from '@/components/Modal'
import { Badge } from '@/components/Badge'
import { useAudio } from '@/hooks/useAudio'

interface BreathingTechnique {
  id: string
  name: string
  emoji: string
  description: string
  instructions: string[]
  pattern: {
    inhale: number
    hold: number
    exhale: number
    pause: number
  }
  bestFor: string[]
  duration: number // in seconds
}

const TECHNIQUES: BreathingTechnique[] = [
  {
    id: 'box_breathing',
    name: 'Respiração em Caixa',
    emoji: '📦',
    description: 'Padrão quadrado: inspire, segure, expire, segure.',
    instructions: [
      '1. Inspire lentamente contando até 4',
      '2. Segure a respiração contando até 4',
      '3. Expire lentamente contando até 4',
      '4. Segure a respiração contando até 4',
      '5. Repita 5-10 vezes',
    ],
    pattern: {
      inhale: 4,
      hold: 4,
      exhale: 4,
      pause: 4,
    },
    bestFor: ['Fase Latente', 'Reduzir Ansiedade', 'Relaxamento'],
    duration: 120,
  },
  {
    id: '4_7_8_breathing',
    name: 'Respiração 4-7-8',
    emoji: '��️',
    description: 'Inspire curto, segure longo, expire longo para acalmar.',
    instructions: [
      '1. Inspire contando até 4',
      '2. Segure contando até 7',
      '3. Expire contando até 8',
      '4. Repita 4-8 ciclos',
    ],
    pattern: {
      inhale: 4,
      hold: 7,
      exhale: 8,
      pause: 0,
    },
    bestFor: ['Relaxamento', 'Reduzir Dor', 'Ansiedade'],
    duration: 120,
  },
  {
    id: 'ujjayi_breathing',
    name: 'Ujjayi (Respiração do Oceano)',
    emoji: '🌊',
    description: 'Respiração oceânica que cria um som suave.',
    instructions: [
      '1. Feche a boca',
      '2. Inspire pelo nariz com som suave',
      '3. Expire pelo nariz com som suave (como "haaaa")',
      '4. Continue por 2-3 minutos',
      '5. Ouça o som como as ondas do oceano',
    ],
    pattern: {
      inhale: 4,
      hold: 0,
      exhale: 4,
      pause: 0,
    },
    bestFor: ['Durante Contrações', 'Foco', 'Enraizamento'],
    duration: 180,
  },
  {
    id: 'belly_breathing',
    name: 'Respiração Abdominal',
    emoji: '🫀',
    description: 'Respiração profunda movimentando o diafragma.',
    instructions: [
      '1. Sente confortavelmente',
      '2. Coloque uma mão no peito, outra na barriga',
      '3. Inspire pelo nariz, deixando a barriga expandir',
      '4. Expire lentamente pela boca',
      '5. A mão no peito deve se mover pouco',
    ],
    pattern: {
      inhale: 5,
      hold: 0,
      exhale: 5,
      pause: 0,
    },
    bestFor: ['Relaxamento', 'Fase Ativa', 'Oxigenação'],
    duration: 180,
  },
  {
    id: 'alternate_nostril',
    name: 'Nadi Shodhana (Narinas Alternadas)',
    emoji: '👃',
    description: 'Respiração alternando as narinas para equilibrar.',
    instructions: [
      '1. Feche a narina direita com o polegar',
      '2. Inspire pela narina esquerda contando até 4',
      '3. Solte a narina direita, feche a esquerda',
      '4. Expire pela narina direita contando até 4',
      '5. Inspire pela direita',
      '6. Alterne 5-10 ciclos',
    ],
    pattern: {
      inhale: 4,
      hold: 0,
      exhale: 4,
      pause: 0,
    },
    bestFor: ['Equilibrio', 'Foco Mental', 'Reduzir Estresse'],
    duration: 180,
  },
  {
    id: 'pursed_lip',
    name: 'Respiração com Lábios Franzidos',
    emoji: '💋',
    description: 'Expire lentamente com os lábios ligeiramente fechados.',
    instructions: [
      '1. Inspire lentamente pelo nariz contando até 2',
      '2. Expire lentamente pela boca com lábios franzidos contando até 4',
      '3. Repita 5-10 vezes',
      '4. Foco no exhale lento e controlado',
    ],
    pattern: {
      inhale: 2,
      hold: 0,
      exhale: 4,
      pause: 0,
    },
    bestFor: ['Fase Ativa', 'Controle de Dor', 'Foco'],
    duration: 120,
  },
]

export const BreathingGuide: React.FC = () => {
  const [selectedTechnique, setSelectedTechnique] = useState<BreathingTechnique | null>(null)
  const [showTechnique, setShowTechnique] = useState(false)
  const [isGuiding, setIsGuiding] = useState(false)
  const [cycle, setCycle] = useState(0)
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale' | 'pause'>('inhale')
  const [timeLeft, setTimeLeft] = useState(0)

  const { playFrequency, stopFrequency } = useAudio()

  // Animation timer
  useEffect(() => {
    if (!isGuiding || !selectedTechnique) return

    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    }

    // Move to next phase
    const pattern = selectedTechnique.pattern
    if (phase === 'inhale') {
      setPhase('hold')
      setTimeLeft(pattern.hold)
    } else if (phase === 'hold') {
      setPhase('exhale')
      setTimeLeft(pattern.exhale)
    } else if (phase === 'exhale') {
      setPhase('pause')
      setTimeLeft(pattern.pause)
    } else {
      // Complete cycle
      setCycle(cycle + 1)
      setPhase('inhale')
      setTimeLeft(pattern.inhale)
    }
  }, [timeLeft, isGuiding, phase, selectedTechnique, cycle])

  const handleStartGuide = (technique: BreathingTechnique) => {
    setSelectedTechnique(technique)
    setShowTechnique(false)
    setIsGuiding(true)
    setCycle(0)
    setPhase('inhale')
    setTimeLeft(technique.pattern.inhale)
    
    // Play frequency for guidance
    playFrequency(432, technique.duration * 1000)
  }

  const handleStopGuide = () => {
    setIsGuiding(false)
    stopFrequency()
    setCycle(0)
  }

  const getPhaseLabel = () => {
    switch (phase) {
      case 'inhale':
        return '💨 Inspire'
      case 'hold':
        return '⏸️ Segure'
      case 'exhale':
        return '💨 Expire'
      case 'pause':
        return '⏸️ Pausa'
    }
  }

  const getPhaseColor = () => {
    switch (phase) {
      case 'inhale':
        return 'text-secondary-400'
      case 'hold':
        return 'text-primary-400'
      case 'exhale':
        return 'text-accent-400'
      case 'pause':
        return 'text-dark-400'
    }
  }

  if (isGuiding && selectedTechnique) {
    return (
      <div className="fixed inset-0 bg-dark-950/95 z-50 flex flex-col items-center justify-center p-6">
        {/* Guide Display */}
        <div className="text-center space-y-8 w-full max-w-sm">
          {/* Title */}
          <div>
            <div className="text-6xl mb-3">{selectedTechnique.emoji}</div>
            <h2 className="text-2xl font-bold text-dark-100">{selectedTechnique.name}</h2>
          </div>

          {/* Phase Indicator */}
          <div className="space-y-4">
            <div className={`text-5xl font-bold transition-all duration-100 ${getPhaseColor()}`}>
              {getPhaseLabel()}
            </div>

            {/* Timer Circle */}
            <div className="relative w-48 h-48 mx-auto">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r="90"
                  fill="none"
                  stroke="#374151"
                  strokeWidth="2"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="90"
                  fill="none"
                  stroke="#a855f7"
                  strokeWidth="2"
                  strokeDasharray={`${2 * Math.PI * 90}`}
                  strokeDashoffset={
                    2 *
                    Math.PI *
                    90 *
                    (1 - (selectedTechnique.pattern[phase] - timeLeft) / selectedTechnique.pattern[phase])
                  }
                  className="transition-all duration-100"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl font-bold text-primary-400">{timeLeft}</div>
                  <div className="text-sm text-dark-400">segundos</div>
                </div>
              </div>
            </div>

            {/* Cycle Counter */}
            <div className="text-sm text-dark-400">
              Ciclo {cycle + 1} de ~{Math.ceil(selectedTechnique.duration / (selectedTechnique.pattern.inhale + selectedTechnique.pattern.hold + selectedTechnique.pattern.exhale + selectedTechnique.pattern.pause))}
            </div>
          </div>

          {/* Instructions */}
          <Card variant="outlined" padding="md" className="bg-dark-800/50">
            <p className="text-sm text-dark-300 italic">{selectedTechnique.instructions[0]}</p>
          </Card>

          {/* Stop Button */}
          <Button onClick={handleStopGuide} variant="danger" size="lg" isFullWidth>
            ⏹️ Parar
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card variant="outlined" padding="md" className="bg-primary-900/10 border-primary-700/30">
        <p className="text-sm text-dark-200">
          🫁 <strong>Respiração</strong> é sua ferramenta mais poderosa. Use-a para relaxar e lidar com a dor.
        </p>
      </Card>

      {/* Techniques Grid */}
      <div className="grid gap-3">
        {TECHNIQUES.map(technique => (
          <button
            key={technique.id}
            onClick={() => {
              setSelectedTechnique(technique)
              setShowTechnique(true)
            }}
            className="p-4 rounded-lg bg-dark-800 border border-dark-700 hover:border-primary-600 hover:bg-dark-700 transition-all text-left space-y-2"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-3xl">{technique.emoji}</span>
                  <div>
                    <p className="font-semibold text-dark-100">{technique.name}</p>
                    <p className="text-xs text-dark-400">{technique.description}</p>
                  </div>
                </div>
              </div>
              <span className="text-primary-400">→</span>
            </div>
          </button>
        ))}
      </div>

      {/* Technique Details Modal */}
      <Modal
        isOpen={showTechnique}
        onClose={() => setShowTechnique(false)}
        title={selectedTechnique?.name}
        size="lg"
      >
        {selectedTechnique && (
          <div className="space-y-4">
            {/* Emoji */}
            <div className="text-5xl text-center">{selectedTechnique.emoji}</div>

            {/* Description */}
            <p className="text-dark-200 text-center">{selectedTechnique.description}</p>

            {/* Best For */}
            <div>
              <p className="text-sm font-semibold text-dark-200 mb-2">Ideal para:</p>
              <div className="flex flex-wrap gap-2">
                {selectedTechnique.bestFor.map(item => (
                  <Badge key={item} variant="primary" size="sm">
                    {item}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Instructions */}
            <div>
              <p className="text-sm font-semibold text-dark-200 mb-2">Como fazer:</p>
              <ol className="space-y-1 text-sm text-dark-300">
                {selectedTechnique.instructions.map((instruction, index) => (
                  <li key={index} className="ml-4">{instruction}</li>
                ))}
              </ol>
            </div>

            {/* Pattern Info */}
            <Card variant="outlined" padding="md" className="bg-dark-800/50">
              <p className="text-xs text-dark-400 mb-2">Padrão de respiração:</p>
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                <div>
                  <div className="text-lg font-bold text-secondary-400">
                    {selectedTechnique.pattern.inhale}
                  </div>
                  <div className="text-dark-500">Inspire</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-primary-400">
                    {selectedTechnique.pattern.hold}
                  </div>
                  <div className="text-dark-500">Segure</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-accent-400">
                    {selectedTechnique.pattern.exhale}
                  </div>
                  <div className="text-dark-500">Expire</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-dark-500">
                    {selectedTechnique.pattern.pause}
                  </div>
                  <div className="text-dark-500">Pausa</div>
                </div>
              </div>
            </Card>

            {/* CTA */}
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                isFullWidth
                onClick={() => setShowTechnique(false)}
              >
                Fechar
              </Button>
              <Button
                variant="primary"
                size="sm"
                isFullWidth
                onClick={() => handleStartGuide(selectedTechnique)}
              >
                Começar Guia 🎵
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Tips */}
      <Card variant="outlined" padding="md" className="space-y-2">
        <p className="text-xs font-semibold text-dark-200">💡 Dicas:</p>
        <ul className="text-xs text-dark-400 space-y-1">
          <li>• Escolha uma técnica que se sinta bem</li>
          <li>• Respire pelo nariz quando possível</li>
          <li>• A respiração lenta reduz a dor</li>
          <li>• Use frequências de 432 Hz para calma</li>
        </ul>
      </Card>
    </div>
  )
}
