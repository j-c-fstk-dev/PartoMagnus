/**
 * Onboarding Screen - Welcome and introduction
 */

import React, { useState } from 'react'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { NAVIGATION } from '@/config/routes'
import { useAppStore } from '@/store/appStore'
import { useUserStore } from '@/store/userStore'
import { useAudio } from '@/hooks/useAudio'
import { logger } from '@/utils/logger'

export const Onboarding: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  const setOnboarding = useAppStore(state => state.setOnboarding)
  const { playFrequency, stopFrequency } = useAudio()

  const setUser = useUserStore(state => state.setUser)
  
  const handleBegin = () => {
    logger.info('Onboarding: User clicked begin')
    
    // Create minimal user to allow progression
    const newUser = {
      id: crypto.randomUUID(),
      name: '',
      birthDate: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setUser(newUser)
    setOnboarding(false)
    window.location.href = NAVIGATION.anamnesis()
  }

  const toggleAudio = () => {
    if (isPlaying) {
      stopFrequency()
      setIsPlaying(false)
    } else {
      playFrequency(432, 10000) // 432 Hz for 10 seconds
      setIsPlaying(true)
    }
  }

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col items-center justify-center p-4">
      {/* Animated Background Gradient */}
      <div className="fixed inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/30 to-secondary-600/30 blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-2xl w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="text-6xl mb-4">🤰✨</div>
          <h1 className="text-4xl md:text-5xl font-bold text-dark-100">
            Parto Magnus
          </h1>
          <p className="text-lg text-dark-400">
            Acompanhamento de Parto Baseado em Evidências
          </p>
        </div>

        {/* Main Message Card */}
        <Card variant="elevated" padding="lg" className="text-center space-y-4">
          <h2 className="text-2xl font-semibold text-dark-100">
            Você é Capaz de Parir
          </h2>
          
          <p className="text-dark-200 leading-relaxed">
            Este app foi criado para acolher você neste momento sagrado de transformação. 
            Aqui você tem <span className="text-primary-400 font-semibold">autonomia</span>, 
            <span className="text-primary-400 font-semibold"> informação</span> e 
            <span className="text-primary-400 font-semibold"> segurança</span>.
          </p>

          <div className="bg-dark-800/50 p-4 rounded-lg border border-primary-700/30">
            <p className="text-dark-100 italic">
              "Seu corpo sabe o que fazer. Cada contração te traz um passo mais perto 
              do abraço do seu bebê."
            </p>
          </div>

          {/* Audio Toggle */}
          <button
            onClick={toggleAudio}
            className="inline-flex items-center gap-2 mx-auto px-4 py-2 rounded-lg hover:bg-dark-800 transition-colors text-sm text-dark-300"
          >
            {isPlaying ? (
              <>
                <span className="animate-pulse">🎵</span>
                Parando música de cura...
              </>
            ) : (
              <>
                <span>🔊</span>
                Tocar frequência de cura (432 Hz)
              </>
            )}
          </button>
        </Card>

        {/* Information Cards */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card variant="outlined" padding="md">
            <div className="text-center space-y-2">
              <div className="text-3xl mb-2">📊</div>
              <h3 className="font-semibold text-dark-100">Baseado em Evidências</h3>
              <p className="text-xs text-dark-400">
                Protocolos clínicos da OMS e FEBRASGO
              </p>
            </div>
          </Card>

          <Card variant="outlined" padding="md">
            <div className="text-center space-y-2">
              <div className="text-3xl mb-2">📱</div>
              <h3 className="font-semibold text-dark-100">Funciona Offline</h3>
              <p className="text-xs text-dark-400">
                Sem preocupação com internet
              </p>
            </div>
          </Card>

          <Card variant="outlined" padding="md">
            <div className="text-center space-y-2">
              <div className="text-3xl mb-2">🌙</div>
              <h3 className="font-semibold text-dark-100">Modo Penumbra</h3>
              <p className="text-xs text-dark-400">
                Respeita seu ritmo circadiano
              </p>
            </div>
          </Card>
        </div>

        {/* CTA Buttons */}
        <div className="space-y-3 pt-4">
          <Button
            onClick={handleBegin}
            size="lg"
            isFullWidth
            leftIcon="🚀"
          >
            Começar Agora
          </Button>

          <p className="text-center text-xs text-dark-500">
            Ao continuar, você concorda com nossos{' '}
            <a href="#" className="text-primary-400 hover:text-primary-300">
              termos
            </a>
          </p>
        </div>

        {/* Footer Info */}
        <div className="text-center text-xs text-dark-500 space-y-1">
          <p>💡 Dica: Use com seu acompanhante para melhor experiência</p>
          <p>Este app não substitui acompanhamento médico profissional</p>
        </div>
      </div>
    </div>
  )
}
