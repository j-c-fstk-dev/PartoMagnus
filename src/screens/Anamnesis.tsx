/**
 * Anamnesis Screen - Collect pregnancy and risk data (5 steps)
 */

import React, { useState } from 'react'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { Input } from '@/components/Input'
import { Header } from '@/components/Header'
import { ProgressBar } from '@/components/ProgressBar'
import { useUserStore } from '@/store/userStore'
import { validateAnamnesisForm } from '@/utils/validators'
import { NAVIGATION } from '@/config/routes'
import { logger } from '@/utils/logger'

type AnamnesisStep = 1 | 2 | 3 | 4 | 5

export const Anamnesis: React.FC = () => {
  const [step, setStep] = useState<AnamnesisStep>(1)
  const [formData, setFormData] = useState({
    name: '',
    birthDate: '',
    currentWeek: 37,
    estimatedDueDate: '',
    numberOfPreviousPregnancies: 0,
    numberOfNormalBirths: 0,
    numberOfCesareans: 0,
    lastPregnancyOutcome: '',
    babyIsHeadDown: null as boolean | null,
    lastUltrasoundNormal: null as boolean | null,
    hasHighBloodPressure: false,
    hasGestationalDiabetes: false,
    hasHIV: false,
    hasHepatitis: false,
    hasGroupBStreptococcus: false,
    hasUterineScar: false,
    preferredBirthLocation: 'hospital_1',
    hasCompanion: false,
    companionName: '',
    companionRelationship: 'partner',
    wantsPushNotifications: true,
    wantsToShareWithDoctor: true,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const setAnamnesis = useUserStore(state => state.setAnamnesis)

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }))
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }))
    }
  }

  const handleNext = () => {
    if (step < 5) {
      setStep((step + 1) as AnamnesisStep)
      window.scrollTo(0, 0)
    }
  }

  const handlePrevious = () => {
    if (step > 1) {
      setStep((step - 1) as AnamnesisStep)
      window.scrollTo(0, 0)
    }
  }

  const handleSubmit = async () => {
    const validation = validateAnamnesisForm({
      currentWeek: formData.currentWeek,
      estimatedDueDate: formData.estimatedDueDate,
      numberOfPreviousPregnancies: formData.numberOfPreviousPregnancies,
      numberOfNormalBirths: formData.numberOfNormalBirths,
    })

    if (!validation.isValid) {
      setErrors(validation.errors)
      return
    }

    setIsLoading(true)
    try {
      // Determine risk level
      let riskLevel: 'low' | 'medium' | 'high' = 'low'
      
      if (
        formData.hasHighBloodPressure ||
        formData.hasGestationalDiabetes ||
        formData.hasUterineScar ||
        formData.numberOfCesareans > 0
      ) {
        riskLevel = 'medium'
      }
      
      if (
        formData.hasHIV ||
        formData.hasHepatitis ||
        !formData.babyIsHeadDown
      ) {
        riskLevel = 'high'
      }

      const anamnesisData = {
        id: crypto.randomUUID(),
        userId: '',
        currentWeek: formData.currentWeek,
        estimatedDueDate: formData.estimatedDueDate,
        numberOfPreviousPregnancies: formData.numberOfPreviousPregnancies,
        numberOfNormalBirths: formData.numberOfNormalBirths,
        numberOfCesareans: formData.numberOfCesareans,
        lastPregnancyOutcome: formData.lastPregnancyOutcome as any,
        babyIsHeadDown: formData.babyIsHeadDown,
        lastUltrasoundNormal: formData.lastUltrasoundNormal,
        hadCTG: false,
        hasHighBloodPressure: formData.hasHighBloodPressure,
        hasGestationalDiabetes: formData.hasGestationalDiabetes,
        hasHIV: formData.hasHIV,
        hasHepatitis: formData.hasHepatitis,
        hasGroupBStreptococcus: formData.hasGroupBStreptococcus,
        hasUterineScar: formData.hasUterineScar,
        preferredBirthLocation: formData.preferredBirthLocation as any,
        hasCompanion: formData.hasCompanion,
        companionName: formData.companionName,
        companionRelationship: formData.companionRelationship as any,
        wantsPushNotifications: formData.wantsPushNotifications,
        wantsToShareWithDoctor: formData.wantsToShareWithDoctor,
        riskLevel,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      setAnamnesis(anamnesisData)
      logger.info('Anamnesis: Completed', { riskLevel })
      
      window.location.href = NAVIGATION.home()
    } catch (error) {
      logger.error('Anamnesis: Failed to save', error)
      setErrors({ form: 'Erro ao salvar dados' })
    } finally {
      setIsLoading(false)
    }
  }

  const progressPercentage = (step / 5) * 100

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-dark-100">Identificação Básica</h2>
            <Input
              label="Nome completo"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Seu nome completo"
              isRequired
            />
            <Input
              label="Data de nascimento"
              type="date"
              value={formData.birthDate}
              onChange={(e) => handleInputChange('birthDate', e.target.value)}
              isRequired
            />
          </div>
        )

      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-dark-100">Dados da Gravidez Atual</h2>
            <Input
              label="Semana gestacional atual"
              type="number"
              min={0}
              max={43}
              value={formData.currentWeek}
              onChange={(e) => handleInputChange('currentWeek', parseInt(e.target.value))}
              isRequired
            />
            <Input
              label="Data prevista do parto (DPP)"
              type="date"
              value={formData.estimatedDueDate}
              onChange={(e) => handleInputChange('estimatedDueDate', e.target.value)}
              isRequired
            />
            <div className="space-y-2">
              <label className="text-sm font-medium text-dark-200">Posição do bebê</label>
              <div className="flex gap-3">
                <Button
                  variant={formData.babyIsHeadDown === true ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => handleInputChange('babyIsHeadDown', true)}
                >
                  ✓ Cabeça para baixo
                </Button>
                <Button
                  variant={formData.babyIsHeadDown === false ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => handleInputChange('babyIsHeadDown', false)}
                >
                  ✗ Outra posição
                </Button>
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-dark-100">Histórico Obstétrico</h2>
            <Input
              label="Número de gestações anteriores"
              type="number"
              min={0}
              value={formData.numberOfPreviousPregnancies}
              onChange={(e) => handleInputChange('numberOfPreviousPregnancies', parseInt(e.target.value))}
            />
            <Input
              label="Número de partos normais anteriores"
              type="number"
              min={0}
              value={formData.numberOfNormalBirths}
              onChange={(e) => handleInputChange('numberOfNormalBirths', parseInt(e.target.value))}
            />
            <Input
              label="Número de cesáreas anteriores"
              type="number"
              min={0}
              value={formData.numberOfCesareans}
              onChange={(e) => handleInputChange('numberOfCesareans', parseInt(e.target.value))}
            />
          </div>
        )

      case 4:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-dark-100">Fatores de Risco</h2>
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-dark-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.hasHighBloodPressure}
                  onChange={(e) => handleInputChange('hasHighBloodPressure', e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-dark-200">Pressão alta</span>
              </label>
              <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-dark-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.hasGestationalDiabetes}
                  onChange={(e) => handleInputChange('hasGestationalDiabetes', e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-dark-200">Diabetes gestacional</span>
              </label>
              <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-dark-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.hasUterineScar}
                  onChange={(e) => handleInputChange('hasUterineScar', e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-dark-200">Cicatriz uterina (cesárea anterior)</span>
              </label>
              <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-dark-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.hasHIV}
                  onChange={(e) => handleInputChange('hasHIV', e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-dark-200">HIV positivo</span>
              </label>
              <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-dark-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.hasHepatitis}
                  onChange={(e) => handleInputChange('hasHepatitis', e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-dark-200">Hepatite</span>
              </label>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-dark-100">Preferências & Confirmação</h2>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-dark-200">Local preferido para parto</label>
              <select
                value={formData.preferredBirthLocation}
                onChange={(e) => handleInputChange('preferredBirthLocation', e.target.value)}
                className="w-full px-4 py-2.5 bg-dark-900 border border-dark-700 rounded-lg text-dark-100"
              >
                <option value="hospital_1">Santa Casa de Pindamonhangaba</option>
                <option value="hospital_2">Hospital 10 de Julho</option>
                <option value="home">Casa (parto domiciliar)</option>
              </select>
            </div>

            <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-dark-800 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.hasCompanion}
                onChange={(e) => handleInputChange('hasCompanion', e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-dark-200">Tenho acompanhante definido</span>
            </label>

            {formData.hasCompanion && (
              <Input
                label="Nome do acompanhante"
                type="text"
                value={formData.companionName}
                onChange={(e) => handleInputChange('companionName', e.target.value)}
                placeholder="Nome de quem te acompanhará"
              />
            )}

            <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-dark-800 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.wantsPushNotifications}
                onChange={(e) => handleInputChange('wantsPushNotifications', e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-dark-200">Desejo receber notificações push motivacionais</span>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-dark-800 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.wantsToShareWithDoctor}
                onChange={(e) => handleInputChange('wantsToShareWithDoctor', e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-dark-200">Desejo compartilhar dados com meu médico</span>
            </label>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-dark-950">
      <Header title="Anamnese Obstétrica" subtitle={`Passo ${step} de 5`} />

      <div className="max-w-2xl mx-auto p-6 space-y-6">
        {/* Progress Bar */}
        <ProgressBar value={progressPercentage} showLabel label={`Progresso: ${step}/5`} />

        {/* Form Card */}
        <Card variant="elevated" padding="lg">
          {renderStep()}
        </Card>

        {/* Navigation Buttons */}
        <div className="flex gap-3 justify-between">
          <Button
            variant="secondary"
            onClick={handlePrevious}
            disabled={step === 1}
          >
            ← Voltar
          </Button>

          {step < 5 ? (
            <Button onClick={handleNext}>
              Próximo →
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              isLoading={isLoading}
              variant="success"
            >
              Concluir ✓
            </Button>
          )}
        </div>

        {/* Error Message */}
        {errors.form && (
          <div className="p-4 bg-error/10 border border-error rounded-lg text-error">
            {errors.form}
          </div>
        )}
      </div>
    </div>
  )
}
