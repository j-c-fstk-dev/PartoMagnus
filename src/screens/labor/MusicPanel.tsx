/**
 * MusicPanel - Audio and frequency management during labor
 */

import React, { useState } from 'react'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { Badge } from '@/components/Badge'
import { useAudio } from '@/hooks/useAudio'
import { useVibration } from '@/hooks/useVibration'
import { SOLFEGGIO_FREQUENCIES } from '@/utils/constants'
import { logger } from '@/utils/logger'

interface FrequencyInfo {
  name: string
  benefits: string[]
}

export const MusicPanel: React.FC = () => {
  const [isPlayingFrequency, setIsPlayingFrequency] = useState(false)
  const [currentFrequency, setCurrentFrequency] = useState<number | null>(null)
  const [volume, setVolume] = useState(70)
  const [selectedCategory, setSelectedCategory] = useState<'frequencies' | 'affirmations' | 'ambient'>('frequencies')

  const { playFrequency, stopFrequency, setVolume: setAudioVolume } = useAudio()
  const { vibratePulse } = useVibration()

  const handlePlayFrequency = (frequency: number) => {
    if (isPlayingFrequency && currentFrequency === frequency) {
      stopFrequency()
      setIsPlayingFrequency(false)
      setCurrentFrequency(null)
      logger.info('MusicPanel: Frequency stopped', { frequency })
    } else {
      if (isPlayingFrequency) {
        stopFrequency()
      }
      playFrequency(frequency, 300000) // 5 minutes
      setIsPlayingFrequency(true)
      setCurrentFrequency(frequency)
      vibratePulse()
      logger.info('MusicPanel: Frequency started', { frequency })
    }
  }

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume)
    setAudioVolume(newVolume / 100)
  }

  const frequencyEntries = Object.entries(SOLFEGGIO_FREQUENCIES)

  return (
    <div className="space-y-4">
      {/* Volume Control */}
      <Card variant="filled" padding="md" className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-dark-200">🔊 Volume</label>
          <span className="text-sm text-primary-400 font-semibold">{volume}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={(e) => handleVolumeChange(parseInt(e.target.value))}
          className="w-full h-2 bg-dark-700 rounded-lg appearance-none cursor-pointer"
        />
      </Card>

      {/* Category Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setSelectedCategory('frequencies')}
          className={`flex-1 py-2 rounded-lg font-medium text-sm transition-all ${
            selectedCategory === 'frequencies'
              ? 'bg-primary-600 text-dark-100'
              : 'bg-dark-800 text-dark-300 hover:bg-dark-700'
          }`}
        >
          🎵 Frequências
        </button>
        <button
          onClick={() => setSelectedCategory('affirmations')}
          className={`flex-1 py-2 rounded-lg font-medium text-sm transition-all ${
            selectedCategory === 'affirmations'
              ? 'bg-primary-600 text-dark-100'
              : 'bg-dark-800 text-dark-300 hover:bg-dark-700'
          }`}
        >
          💬 Afirmações
        </button>
        <button
          onClick={() => setSelectedCategory('ambient')}
          className={`flex-1 py-2 rounded-lg font-medium text-sm transition-all ${
            selectedCategory === 'ambient'
              ? 'bg-primary-600 text-dark-100'
              : 'bg-dark-800 text-dark-300 hover:bg-dark-700'
          }`}
        >
          🌿 Ambientes
        </button>
      </div>

      {/* Solfeggio Frequencies */}
      {selectedCategory === 'frequencies' && (
        <div className="space-y-3">
          <Card variant="outlined" padding="md" className="bg-primary-900/10 border-primary-700/30">
            <p className="text-xs text-dark-300">
              As frequências Solfeggio são ancestrais e têm propriedades curativas. 
              432 Hz é conhecida como "frequência do coração".
            </p>
          </Card>

          <div className="space-y-2">
            {frequencyEntries.map(([freqStr, info]) => {
              const frequency = parseInt(freqStr) as keyof typeof SOLFEGGIO_FREQUENCIES
              const isPlaying = isPlayingFrequency && currentFrequency === frequency

              return (
                <button
                  key={frequency}
                  onClick={() => handlePlayFrequency(frequency)}
                  className={`w-full p-3 rounded-lg text-left transition-all border ${
                    isPlaying
                      ? 'bg-primary-600/30 border-primary-500 ring-2 ring-primary-500/50'
                      : 'bg-dark-800 border-dark-700 hover:border-primary-500'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-dark-100">{frequency} Hz</span>
                        {isPlaying && <span className="animate-pulse">🎵</span>}
                      </div>
                      <p className="text-xs text-dark-400">{info.name}</p>
                      <p className="text-xs text-dark-500 mt-1">
                        Benefícios: {info.benefits.slice(0, 2).join(', ')}...
                      </p>
                    </div>
                    <Button
                      variant={isPlaying ? 'danger' : 'secondary'}
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handlePlayFrequency(frequency)
                      }}
                    >
                      {isPlaying ? '⏹️' : '▶️'}
                    </Button>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Frequency Info */}
          {currentFrequency && (
            <Card variant="outlined" padding="md" className="space-y-2">
              <h4 className="font-semibold text-dark-200">
                {SOLFEGGIO_FREQUENCIES[currentFrequency as keyof typeof SOLFEGGIO_FREQUENCIES].name}
              </h4>
              <ul className="text-xs text-dark-300 space-y-1">
                {SOLFEGGIO_FREQUENCIES[
                  currentFrequency as keyof typeof SOLFEGGIO_FREQUENCIES
                ].benefits.map((benefit, index) => (
                  <li key={index} className="flex gap-2">
                    <span className="text-primary-400">•</span>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>
      )}

      {/* Affirmations */}
      {selectedCategory === 'affirmations' && (
        <div className="space-y-3">
          <Card variant="outlined" padding="md" className="space-y-2">
            <p className="text-sm font-semibold text-dark-200">💬 Afirmações Motivacionais</p>
            <p className="text-xs text-dark-400">
              Ouça estas mensagens de encorajamento durante seu trabalho de parto.
            </p>
          </Card>

          <div className="space-y-2">
            {[
              {
                text: 'Você é forte e capaz',
                time: '1:23',
              },
              {
                text: 'Cada contração te traz perto do seu bebê',
                time: '2:15',
              },
              {
                text: 'Seu corpo sabe o que fazer',
                time: '1:58',
              },
              {
                text: 'Você merece este parto bonito',
                time: '2:30',
              },
              {
                text: 'Confia em ti mesma e em seu bebê',
                time: '2:08',
              },
            ].map((affirmation, index) => (
              <button
                key={index}
                className="w-full p-3 rounded-lg bg-dark-800 border border-dark-700 hover:border-secondary-500 text-left transition-all"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-dark-100 text-sm">{affirmation.text}</p>
                    <p className="text-xs text-dark-500 mt-1">⏱️ {affirmation.time}</p>
                  </div>
                  <Button variant="secondary" size="sm">
                    ▶️
                  </Button>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Ambient Sounds */}
      {selectedCategory === 'ambient' && (
        <div className="space-y-3">
          <Card variant="outlined" padding="md" className="space-y-2">
            <p className="text-sm font-semibold text-dark-200">🌿 Sons Ambientes</p>
            <p className="text-xs text-dark-400">
              Sons da natureza para relaxamento e concentração.
            </p>
          </Card>

          <div className="space-y-2">
            {[
              {
                name: 'Chuva Relaxante',
                emoji: '🌧️',
                description: 'Som de chuva suave',
              },
              {
                name: 'Floresta Tropical',
                emoji: '🌴',
                description: 'Pássaros e vento',
              },
              {
                name: 'Ondas do Oceano',
                emoji: '🌊',
                description: 'Ondas batendo na praia',
              },
              {
                name: 'Rio Corrente',
                emoji: '💧',
                description: 'Água fluindo suavemente',
              },
              {
                name: 'Floresta Mágica',
                emoji: '🌲',
                description: 'Sons misteriosos da floresta',
              },
            ].map((sound, index) => (
              <button
                key={index}
                className="w-full p-3 rounded-lg bg-dark-800 border border-dark-700 hover:border-secondary-500 text-left transition-all"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl">{sound.emoji}</span>
                      <p className="font-medium text-dark-100 text-sm">{sound.name}</p>
                    </div>
                    <p className="text-xs text-dark-500">{sound.description}</p>
                  </div>
                  <Button variant="secondary" size="sm">
                    ▶️
                  </Button>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Tips */}
      <Card variant="outlined" padding="md" className="space-y-2">
        <p className="text-xs font-semibold text-dark-200">�� Dicas de Áudio:</p>
        <ul className="text-xs text-dark-400 space-y-1">
          <li>• 432 Hz é melhor para relaxamento e encaixe do bebê</li>
          <li>• Altere frequências a cada 30-60 minutos</li>
          <li>• Use fones de ouvido para melhor experiência</li>
          <li>• Sons ambientes ajudam com foco e relaxamento</li>
        </ul>
      </Card>
    </div>
  )
}
