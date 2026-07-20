/**
 * Settings Screen - User preferences and configuration
 */

import React, { useState } from 'react'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { Header } from '@/components/Header'
import { Badge } from '@/components/Badge'
import { useAppStore } from '@/store/appStore'
import { useUserStore } from '@/store/userStore'
import { localStorageService } from '@/services/storageService'
import { logger } from '@/utils/logger'
import { NAVIGATION } from '@/config/routes'

export const Settings: React.FC = () => {
  const isDarkMode = useAppStore(state => state.isDarkMode)
  const setDarkMode = useAppStore(state => state.setDarkMode)
  const preferences = useUserStore(state => state.preferences)
  const updatePreferences = useUserStore(state => state.updatePreferences)
  const clearUser = useUserStore(state => state.clearUser)

  // const [showDataOptions, setShowDataOptions] = useState(false)
  const [showAbout, setShowAbout] = useState(false)

  const handleExportData = () => {
    try {
      const data = localStorageService.exportData()
      const blob = new Blob([data], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `beregenerative-data-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      logger.info('Settings: Data exported')
    } catch (error) {
      logger.error('Settings: Failed to export data', error)
    }
  }

  const handleClearData = () => {
    if (window.confirm('Tem certeza que deseja apagar TODOS os dados? Esta ação não pode ser desfeita.')) {
      localStorageService.clear()
      clearUser()
      logger.info('Settings: All data cleared')
      window.location.href = NAVIGATION.onboarding()
    }
  }

  const handleToggleDarkMode = (enabled: boolean) => {
    setDarkMode(enabled)
    if (preferences) {
      updatePreferences({ darkMode: enabled })
    }
  }

  return (
    <div className="min-h-screen bg-dark-950">
      <Header title="Configurações" subtitle="Personalize sua experiência" />

      <div className="max-w-2xl mx-auto p-6 space-y-6">
        
        {/* Display Settings */}
        <Card variant="outlined" padding="lg" className="space-y-4">
          <h3 className="text-lg font-semibold text-dark-100">🎨 Aparência</h3>
          
          <div className="flex items-center justify-between">
            <span className="text-dark-200">Modo Escuro</span>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isDarkMode}
                onChange={(e) => handleToggleDarkMode(e.target.checked)}
                className="w-5 h-5"
              />
              <span className="text-sm text-dark-400">
                {isDarkMode ? 'Ativado' : 'Desativado'}
              </span>
            </label>
          </div>

          <p className="text-xs text-dark-400 italic">
            Modo escuro reduz a fadiga ocular e preserva o ritmo circadiano durante o parto.
          </p>
        </Card>

        {/* Notification Settings */}
        <Card variant="outlined" padding="lg" className="space-y-4">
          <h3 className="text-lg font-semibold text-dark-100">🔔 Notificações</h3>
          
          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 rounded hover:bg-dark-800 cursor-pointer">
              <span className="text-dark-200">Notificações Push</span>
              <input
                type="checkbox"
                defaultChecked={preferences?.pushNotificationsEnabled ?? true}
                className="w-4 h-4"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded hover:bg-dark-800 cursor-pointer">
              <span className="text-dark-200">Vibração Háptica</span>
              <input
                type="checkbox"
                defaultChecked={preferences?.soundEnabled ?? true}
                className="w-4 h-4"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded hover:bg-dark-800 cursor-pointer">
              <span className="text-dark-200">Sons Ambientes</span>
              <input
                type="checkbox"
                defaultChecked={preferences?.soundEnabled ?? true}
                className="w-4 h-4"
              />
            </label>
          </div>
        </Card>

        {/* Audio Settings */}
        <Card variant="outlined" padding="lg" className="space-y-4">
          <h3 className="text-lg font-semibold text-dark-100">🎵 Áudio</h3>
          
          <div className="space-y-3">
            <div className="space-y-2">
              <label className="text-sm text-dark-300">Volume Geral</label>
              <input
                type="range"
                min="0"
                max="100"
                defaultValue={preferences?.volumeLevel ?? 70}
                className="w-full"
              />
            </div>

            <div className="text-xs text-dark-400 space-y-1">
              <p>📻 Frequências Solfeggio disponíveis:</p>
              <p className="ml-4">174, 285, 396, 432, 528, 639, 741, 852, 963 Hz</p>
            </div>
          </div>
        </Card>

        {/* Privacy Settings */}
        <Card variant="outlined" padding="lg" className="space-y-4">
          <h3 className="text-lg font-semibold text-dark-100">🔐 Privacidade</h3>
          
          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 rounded hover:bg-dark-800 cursor-pointer">
              <span className="text-dark-200">Armazenamento Local</span>
              <Badge variant="success">Seguro</Badge>
            </label>

            <label className="flex items-center justify-between p-3 rounded hover:bg-dark-800 cursor-pointer">
              <span className="text-dark-200">Análise Anônima</span>
              <input
                type="checkbox"
                defaultChecked={preferences?.allowAnalytics ?? false}
                className="w-4 h-4"
              />
            </label>

            <p className="text-xs text-dark-400">
              Todos os seus dados são armazenados localmente no seu dispositivo. 
              Nenhuma informação pessoal é enviada para servidores externos sem seu consentimento.
            </p>
          </div>
        </Card>

        {/* Data Management */}
        <Card variant="outlined" padding="lg" className="space-y-4">
          <h3 className="text-lg font-semibold text-dark-100">💾 Gerenciar Dados</h3>
          
          <div className="space-y-2">
            <Button
              variant="secondary"
              size="sm"
              isFullWidth
              onClick={handleExportData}
              leftIcon="📥"
            >
              Exportar Dados (JSON)
            </Button>
            
            <p className="text-xs text-dark-400">
              Baixe uma cópia de todos os seus dados em formato JSON.
            </p>
          </div>

          <div className="space-y-2">
            <Button
              variant="danger"
              size="sm"
              isFullWidth
              onClick={handleClearData}
              leftIcon="🗑️"
            >
              Apagar Todos os Dados
            </Button>

            <p className="text-xs text-error/70">
              ⚠️ Esta ação não pode ser desfeita. Todos os seus dados serão permanentemente deletados.
            </p>
          </div>
        </Card>

        {/* About */}
        <Card variant="outlined" padding="lg" className="space-y-4">
          <h3 className="text-lg font-semibold text-dark-100">ℹ️ Sobre</h3>
          
          <div className="space-y-2 text-sm text-dark-300">
            <div className="flex justify-between">
              <span>Versão:</span>
              <span className="text-dark-100 font-semibold">0.1.0</span>
            </div>
            <div className="flex justify-between">
              <span>Última atualização:</span>
              <span className="text-dark-100 font-semibold">2026-07-17</span>
            </div>
            <div className="flex justify-between">
              <span>Ambiente:</span>
              <span className="text-dark-100 font-semibold">Web App (PWA)</span>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            isFullWidth
            onClick={() => setShowAbout(!showAbout)}
          >
            Ver Informações Completas
          </Button>

          {showAbout && (
            <div className="mt-4 p-4 bg-dark-800/50 rounded-lg text-xs text-dark-400 space-y-2">
              <p>
                <strong>Beregenerative</strong> é um aplicativo baseado em evidências científicas 
                para o acompanhamento de parto, desenvolvido com protocolos da OMS e FEBRASGO.
              </p>
              <p>
                Este app não substitui o acompanhamento médico profissional. Sempre consulte seu 
                médico ou parteira para orientações clínicas.
              </p>
              <p>
                Desenvolvido com ❤️ para gestantes brasileiras.
              </p>
            </div>
          )}
        </Card>

        {/* Support */}
        <Card variant="outlined" padding="lg" className="space-y-4">
          <h3 className="text-lg font-semibold text-dark-100">💬 Suporte</h3>
          
          <div className="space-y-2">
            <Button variant="secondary" size="sm" isFullWidth>
              📧 Enviar Feedback
            </Button>
            <Button variant="secondary" size="sm" isFullWidth>
              ❓ Perguntas Frequentes
            </Button>
            <Button variant="secondary" size="sm" isFullWidth>
              📚 Documentação
            </Button>
          </div>
        </Card>

        {/* Bottom Spacing */}
        <div className="h-6" />
      </div>
    </div>
  )
}
