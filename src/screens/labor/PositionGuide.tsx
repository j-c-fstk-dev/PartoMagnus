/**
 * PositionGuide - Visual guide for labor positions
 */

import React, { useState } from 'react'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { Modal } from '@/components/Modal'

interface Position {
  id: string
  name: string
  emoji: string
  description: string
  benefits: string[]
  cautions: string[]
  phases: string[]
}

const POSITIONS: Position[] = [
  {
    id: 'standing',
    name: 'De Pé',
    emoji: '🧍‍♀️',
    description: 'Fica de pé, com apoio do acompanhante ou na cama.',
    benefits: [
      'Usa a gravidade a seu favor',
      'Liberdade de movimento',
      'Facilita o encaixe do bebê',
      'Reduz dor nas costas',
    ],
    cautions: [
      'Cansativo por longos períodos',
      'Tenha apoio disponível',
    ],
    phases: ['Latente', 'Ativa'],
  },
  {
    id: 'walking',
    name: 'Caminhando',
    emoji: '🚶‍♀️',
    description: 'Caminhe lentamente durante e entre as contrações.',
    benefits: [
      'Mantém a progressão do parto',
      'Menos dor',
      'Movimento natural',
      'Encaixe progressivo',
    ],
    cautions: [
      'Pode cansá-la',
      'Tenha monitoramento disponível',
    ],
    phases: ['Prodromal', 'Latente', 'Ativa'],
  },
  {
    id: 'squatting',
    name: 'Agachada',
    emoji: '🧗‍♀️',
    description: 'Agache-se, com apoio nos braços ou com o acompanhante.',
    benefits: [
      'Máxima abertura pélvica',
      'Ótima para a fase expulsiva',
      'Reduz necessidade de episiotomia',
      'Facilita saída do bebê',
    ],
    cautions: [
      'Cansativo',
      'Requer força nas pernas',
      'Melhor com apoio',
    ],
    phases: ['Ativa', 'Transição', 'Expulsiva'],
  },
  {
    id: 'kneeling',
    name: 'De Joelhos',
    emoji: '🧎‍♀️',
    description: 'Fique de joelhos, apoiada em almofadas ou na cama.',
    benefits: [
      'Confortável por mais tempo',
      'Boa para dor nas costas',
      'Facilita massagem',
      'Posição estável',
    ],
    cautions: [
      'Joelhos podem ficar desconfortáveis',
      'Use almofadas',
    ],
    phases: ['Latente', 'Ativa', 'Transição'],
  },
  {
    id: 'hands_knees',
    name: 'Mãos e Joelhos',
    emoji: '🐱',
    description: 'Fique em posição de gato, como em uma posição de ioga.',
    benefits: [
      'Aloja o bebé posteriormente',
      'Excelente para dor nas costas',
      'Facilita a rotação fetal',
      'Relaxante',
    ],
    cautions: [
      'Braços podem cansar',
      'Requer apoio à cintura',
    ],
    phases: ['Ativa', 'Transição'],
  },
  {
    id: 'sitting',
    name: 'Sentada',
    emoji: '🪑',
    description: 'Sente-se numa cadeira, banquinho de parto ou cama.',
    benefits: [
      'Confortável',
      'Usa gravidade',
      'Fácil de descansar',
      'Bom para contrações',
    ],
    cautions: [
      'Pode reduzir abertura pélvica',
      'Menos ideal para progressão',
    ],
    phases: ['Latente', 'Ativa'],
  },
  {
    id: 'reclined',
    name: 'Semi-Recostada',
    emoji: '🛏️',
    description: 'Recostada na cama com almofadas, inclinada a 45 graus.',
    benefits: [
      'Mais confortável para descansar',
      'Boa para monitoramento',
      'Permite repouso entre contrações',
      'Acesso fácil para intervenções',
    ],
    cautions: [
      'Menos uso da gravidade',
      'Pode reduzir progressão',
    ],
    phases: ['Ativa', 'Transição', 'Expulsiva'],
  },
  {
    id: 'side_lying',
    name: 'Deitada de Lado',
    emoji: '😴',
    description: 'Deite-se de lado com almofada entre os joelhos.',
    benefits: [
      'Relaxante',
      'Descansa bem',
      'Bom para descanso',
      'Acesso para massagem',
    ],
    cautions: [
      'Não usa gravidade',
      'Menos ideal para progressão',
    ],
    phases: ['Ativa'],
  },
  {
    id: 'water',
    name: 'Na Água',
    emoji: '🛁',
    description: 'Dentro de uma banheira ou chuveiro quente (se disponível).',
    benefits: [
      'Alívio da dor',
      'Relaxamento',
      'Reduz tensão muscular',
      'Diminui pressão arterial',
    ],
    cautions: [
      'Nem sempre disponível',
      'Monitoramento mais difícil',
      'Temperatura ideal 37°C',
    ],
    phases: ['Latente', 'Ativa', 'Transição'],
  },
]

export const PositionGuide: React.FC = () => {
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  const handleSelectPosition = (position: Position) => {
    setSelectedPosition(position)
    setShowDetails(true)
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card variant="outlined" padding="md" className="bg-primary-900/10 border-primary-700/30">
        <p className="text-sm text-dark-200">
          💡 <strong>Dica:</strong> Mude de posição a cada 30 minutos para facilitar o encaixe e progressão do parto.
        </p>
      </Card>

      {/* Positions Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {POSITIONS.map(position => (
          <button
            key={position.id}
            onClick={() => handleSelectPosition(position)}
            className="p-4 rounded-lg bg-dark-800 border border-dark-700 hover:border-primary-600 hover:bg-dark-700 transition-all space-y-2 text-left"
          >
            <div className="text-3xl">{position.emoji}</div>
            <div>
              <p className="font-semibold text-dark-100 text-sm">{position.name}</p>
              <p className="text-xs text-dark-400">{position.description.substring(0, 40)}...</p>
            </div>
          </button>
        ))}
      </div>

      {/* Position Details Modal */}
      <Modal
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
        title={selectedPosition?.name}
        size="lg"
      >
        {selectedPosition && (
          <div className="space-y-4">
            {/* Emoji & Description */}
            <div className="text-center space-y-2">
              <div className="text-6xl">{selectedPosition.emoji}</div>
              <p className="text-dark-200">{selectedPosition.description}</p>
            </div>

            {/* Phases */}
            <div>
              <p className="text-sm font-semibold text-dark-200 mb-2">Ideal para:</p>
              <div className="flex flex-wrap gap-2">
                {selectedPosition.phases.map(phase => (
                  <span
                    key={phase}
                    className="px-2 py-1 bg-primary-900/30 border border-primary-700/50 rounded text-xs text-primary-300"
                  >
                    {phase}
                  </span>
                ))}
              </div>
            </div>

            {/* Benefits */}
            <div>
              <p className="text-sm font-semibold text-dark-200 mb-2">✓ Benefícios:</p>
              <ul className="space-y-1">
                {selectedPosition.benefits.map((benefit, index) => (
                  <li key={index} className="text-sm text-dark-300 flex gap-2">
                    <span className="text-success">✓</span>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Cautions */}
            <div>
              <p className="text-sm font-semibold text-dark-200 mb-2">⚠️ Cuidados:</p>
              <ul className="space-y-1">
                {selectedPosition.cautions.map((caution, index) => (
                  <li key={index} className="text-sm text-dark-300 flex gap-2">
                    <span className="text-warning">•</span>
                    <span>{caution}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* How To */}
            <Card variant="outlined" padding="md" className="bg-dark-800/50">
              <p className="text-sm font-semibold text-dark-200 mb-2">💡 Como fazer:</p>
              <ol className="text-sm text-dark-300 space-y-1 ml-4 list-decimal">
                <li>Mude lentamente para a nova posição</li>
                <li>Use almofadas ou apoio conforme necessário</li>
                <li>Respire profundamente</li>
                <li>Fique de 20-30 minutos</li>
                <li>Mude novamente se não estiver confortável</li>
              </ol>
            </Card>

            {/* Close Button */}
            <Button onClick={() => setShowDetails(false)} size="sm" isFullWidth>
              Fechar
            </Button>
          </div>
        )}
      </Modal>

      {/* Quick Tips */}
      <Card variant="outlined" padding="md" className="space-y-2">
        <p className="text-xs font-semibold text-dark-200">💪 Lembre-se:</p>
        <ul className="text-xs text-dark-400 space-y-1">
          <li>• Não existe posição "perfeita" - escolha a que se sinta bem</li>
          <li>• Mude de posição regularmente</li>
          <li>• Seu acompanhante pode ajudar com apoio e massagem</li>
          <li>• Confie no seu corpo e seus instintos</li>
        </ul>
      </Card>
    </div>
  )
}
