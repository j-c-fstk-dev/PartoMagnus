/**
 * CompanionPanel - Instructions and support for birth companion (partner/doula)
 */

import React, { useState } from 'react'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { Modal } from '@/components/Modal'
import { Badge } from '@/components/Badge'
import { LaborPhase } from '@/types/labor'

interface CompanionTip {
  phase: LaborPhase | 'all'
  emoji: string
  title: string
  description: string
  actions: string[]
}

const COMPANION_TIPS: CompanionTip[] = [
  {
    phase: 'all',
    emoji: '❤️',
    title: 'Apoio Emocional',
    description: 'Sua presença e apoio são fundamentais para o bem-estar dela.',
    actions: [
      'Mantenha contato visual e físico',
      'Sussuure palavras de encorajamento',
      'Esteja presente em todos os momentos',
      'Lembre-a de sua força e capacidade',
    ],
  },
  {
    phase: 'LATENT',
    emoji: '🚶',
    title: 'Fase Latente',
    description: 'Mantenha-a se movendo e distinta das contrações.',
    actions: [
      'Caminhem juntos entre as contrações',
      'Assistam a um filme ou façam atividades leves',
      'Encorajem repouso entre contrações',
      'Ofereçam água e snacks leves',
    ],
  },
  {
    phase: 'ACTIVE',
    emoji: '⚡',
    title: 'Fase Ativa',
    description: 'Aumenta a intensidade - ofereça suporte físico e emocional.',
    actions: [
      'Ofereça massagem nas costas/quadris',
      'Ajude-a com mudanças de posição',
      'Guie a respiração profunda',
      'Aplique compressas quentes/frias conforme desejado',
    ],
  },
  {
    phase: 'TRANSITION',
    emoji: '🔥',
    title: 'Transição',
    description: 'Momento mais intenso - máximo apoio e ânimo.',
    actions: [
      'Não a deixe sozinha por um segundo',
      'Diga que ela é forte e está quase lá',
      'Ofereça água entre contrações',
      'Mantenha a calma (ela espelha sua energia)',
    ],
  },
  {
    phase: 'EXPULSIVE',
    emoji: '👶',
    title: 'Fase Expulsiva',
    description: 'Hora de empurrar - encorajamento total.',
    actions: [
      'Chame seu nome e diga "você consegue!"',
      'Guie a respiração: inspire, puxe, expire',
      'Celebre cada esforço',
      'Lembre que o bebê está chegando',
    ],
  },
]

export const CompanionPanel: React.FC<{ currentPhase?: LaborPhase }> = ({
  currentPhase = 'LATENT',
}) => {
  const [showGuide, setShowGuide] = useState(false)
  const [showMessages, setShowMessages] = useState(false)
  const [showPositions, setShowPositions] = useState(false)

  const relevantTips = COMPANION_TIPS.filter(
    tip => tip.phase === 'all' || tip.phase === currentPhase
  )

  const affirmationMessages = [
    '💪 Você é incrível! Está fazendo um trabalho maravilhoso.',
    '❤️ Eu acredito em você. Você foi feita para isso.',
    '🌟 Cada contração te traz perto. Você está quase lá!',
    '🧘‍♀️ Respira fundo. Seu corpo sabe o que fazer.',
    '👶 Nosso bebé está vindo. Você consegue!',
    '💕 Estou aqui com você. Você não está sozinha.',
    '⭐ Sua coragem é inspiradora. Você é forte.',
    '🌈 A cada momento você fica mais perto do arco-íris.',
    '🕯️ Foco. Você está exatamente onde precisa estar.',
    '💎 Você é um diamante sendo esculpido. Está quase pronto.',
  ]

  const massageTechniques = [
    {
      name: 'Massagem nas Costas',
      description: 'Movimentos circulares nas costas, especialmente na região sagrada.',
      howTo: [
        'Use as palmas das mãos em movimento circular',
        'Aplique pressão firme mas gentil',
        'Foque na região pouco acima das nádegas',
        'Pergunte se quer mais ou menos pressão',
      ],
    },
    {
      name: 'Pressão no Quadril',
      description: 'Compressão firme nos ossos do quadril durante contrações.',
      howTo: [
        'Fique de frente ou de lado para ela',
        'Coloque as mãos nos ossos do quadril',
        'Aplique pressão constante durante contração',
        'Libere entre as contrações',
      ],
    },
    {
      name: 'Massagem nos Ombros',
      description: 'Alívio da tensão nos ombros e pescoço.',
      howTo: [
        'Fique atrás dela',
        'Massageie os ombros e pescoço',
        'Use movimento amassante',
        'Mantenha-a relaxada',
      ],
    },
    {
      name: 'Contrapressão Sacral',
      description: 'Alivia dor nas costas durante transição.',
      howTo: [
        'Coloque os nós dos punhos na base da coluna',
        'Aplique pressão firme',
        'Mantenha durante toda a contração',
        'Muito eficaz para dor nas costas',
      ],
    },
  ]

  const companionPositions = [
    {
      emoji: '🧍‍♀️🧍',
      name: 'Frente a Frente',
      description: 'Contato visual e físico durante as contrações.',
      whenUse: 'Fases latente e ativa',
    },
    {
      emoji: '🧍‍♀️🫂🧍‍♂️',
      name: 'Abraço por Trás',
      description: 'Suporte e calor durante contrações intensas.',
      whenUse: 'Fase ativa e transição',
    },
    {
      emoji: '🧎‍♀️🧎‍♂️',
      name: 'Ambos de Joelhos',
      description: 'Suporte para posição de joelhos ou mãos-joelhos.',
      whenUse: 'Fase ativa',
    },
    {
      emoji: '🛏️��‍♂️',
      name: 'Ela Deitada, Você Apoiando',
      description: 'Massagem e apoio enquanto ela repousa.',
      whenUse: 'Entre contrações',
    },
  ]

  return (
    <div className="space-y-4">
      {/* Main CTA */}
      <Card
        variant="elevated"
        padding="lg"
        className="bg-gradient-to-r from-secondary-600/20 to-accent-600/20 text-center space-y-3"
      >
        <div className="text-4xl">🤝</div>
        <h3 className="text-lg font-bold text-dark-100">Você é Essencial!</h3>
        <p className="text-sm text-dark-200">
          Seu apoio é o maior presente que você pode dar durante este parto.
        </p>
      </Card>

      {/* Quick Access Buttons */}
      <div className="grid grid-cols-2 gap-2">
        <Button
          onClick={() => setShowMessages(true)}
          variant="secondary"
          size="sm"
          isFullWidth
          leftIcon="💬"
        >
          Mensagens
        </Button>
        <Button
          onClick={() => setShowPositions(true)}
          variant="secondary"
          size="sm"
          isFullWidth
          leftIcon="🤲"
        >
          Posições
        </Button>
      </div>

      {/* Current Phase Tips */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-dark-200">💡 Dicas para agora ({currentPhase})</h3>

        {relevantTips.map((tip, index) => (
          <Card key={index} variant="outlined" padding="md">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{tip.emoji}</span>
                <h4 className="font-semibold text-dark-100">{tip.title}</h4>
              </div>
              <p className="text-xs text-dark-400">{tip.description}</p>
              <ul className="text-xs text-dark-300 space-y-1 ml-4">
                {tip.actions.map((action, idx) => (
                  <li key={idx} className="list-disc">{action}</li>
                ))}
              </ul>
            </div>
          </Card>
        ))}
      </div>

      {/* Massage Guide Button */}
      <Button
        onClick={() => setShowGuide(true)}
        variant="primary"
        size="md"
        isFullWidth
        leftIcon="💆"
      >
        Guia de Massagem
      </Button>

      {/* Messages Modal */}
      <Modal
        isOpen={showMessages}
        onClose={() => setShowMessages(false)}
        title="Mensagens de Encorajamento"
        size="md"
      >
        <div className="space-y-3">
          {affirmationMessages.map((message, index) => (
            <Card
              key={index}
              variant="outlined"
              padding="md"
              hoverable
              clickable
              onClick={() => {
                navigator.clipboard.writeText(message)
                alert('Copiado para a área de transferência!')
              }}
            >
              <p className="text-sm text-dark-200 text-center italic">{message}</p>
              <p className="text-xs text-dark-500 text-center mt-2">Clique para copiar</p>
            </Card>
          ))}
        </div>
      </Modal>

      {/* Positions Modal */}
      <Modal
        isOpen={showPositions}
        onClose={() => setShowPositions(false)}
        title="Posições para Acompanhante"
        size="lg"
      >
        <div className="space-y-3">
          {companionPositions.map((position, index) => (
            <Card key={index} variant="outlined" padding="md">
              <div className="space-y-2">
                <div className="text-3xl text-center mb-2">{position.emoji}</div>
                <h4 className="font-semibold text-dark-100">{position.name}</h4>
                <p className="text-xs text-dark-400">{position.description}</p>
                <div className="pt-2 border-t border-dark-700">
                  <Badge variant="secondary" size="sm">{position.whenUse}</Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Modal>

      {/* Massage Guide Modal */}
      <Modal
        isOpen={showGuide}
        onClose={() => setShowGuide(false)}
        title="Guia de Massagem"
        size="lg"
      >
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {massageTechniques.map((technique, index) => (
            <Card key={index} variant="outlined" padding="md">
              <div className="space-y-2">
                <h4 className="font-semibold text-dark-100">{technique.name}</h4>
                <p className="text-xs text-dark-400">{technique.description}</p>
                <div className="bg-dark-800/50 p-2 rounded text-xs text-dark-300 space-y-1">
                  {technique.howTo.map((step, idx) => (
                    <div key={idx} className="flex gap-2">
                      <span className="text-primary-400">→</span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Modal>

      {/* Important Reminders */}
      <Card variant="outlined" padding="md" className="space-y-2 text-xs text-dark-400 bg-secondary-900/10 border-secondary-700/30">
        <p className="font-semibold text-dark-200">⭐ Lembranças Importantes:</p>
        <ul className="space-y-1 ml-4">
          <li>• Ela confia em você - mantenha a calma</li>
          <li>• Siga o ritmo dela, não impor seu próprio ritmo</li>
          <li>• Oferça opções, não ordens</li>
          <li>• Seu ânimo é contagioso - seja positivo</li>
          <li>• Se ela disser não, respeite - ela sabe o que precisa</li>
          <li>• Você está criando uma memória por toda a vida</li>
        </ul>
      </Card>
    </div>
  )
}
