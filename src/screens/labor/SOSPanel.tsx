/**
 * SOSPanel - Emergency contacts and hospital information
 */

import React, { useState } from 'react'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { Modal } from '@/components/Modal'
import { Badge } from '@/components/Badge'
import { HospitalService } from '@/services/hospitalService'
import { GeolocationService } from '@/services/geolocationService'
import { useGeolocation } from '@/hooks/useGeolocation'
import { logger } from '@/utils/logger'

export const SOSPanel: React.FC = () => {
  const { coords, nearbyHospitals, findNearbyHospitals, isLoading } = useGeolocation(false)
  const [showEmergencyGuide, setShowEmergencyGuide] = useState(false)
  const [showHospitalList, setShowHospitalList] = useState(false)

  const emergencyNumbers = HospitalService.getEmergencyNumbers()

  const handleCallAmbulance = () => {
    if (window.confirm('Chamar ambulância (SAMU)?')) {
      HospitalService.callHospital('ambulance')
      logger.info('SOSPanel: Ambulance call initiated')
    }
  }

  const handleFindNearbyHospitals = async () => {
    await findNearbyHospitals(20)
    setShowHospitalList(true)
  }

  const handleCallHospital = (hospitalId: string) => {
    HospitalService.callHospital(hospitalId)
    logger.info('SOSPanel: Hospital call initiated', { hospitalId })
  }

  return (
    <div className="space-y-4">
      {/* Emergency Banner */}
      <Card
        variant="outlined"
        padding="lg"
        className="bg-error/10 border-error/50 text-center space-y-3"
      >
        <div className="text-4xl">🚨</div>
        <h3 className="text-lg font-bold text-error">Preciso de Ajuda!</h3>
        <p className="text-sm text-dark-200">
          Se houver uma emergência, chame uma ambulância ou vá direto ao hospital.
        </p>
      </Card>

      {/* Emergency Contacts */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-dark-200">📞 Contatos de Emergência</h3>

        <Button
          onClick={handleCallAmbulance}
          size="lg"
          isFullWidth
          variant="danger"
          leftIcon="🚑"
          className="text-lg font-bold h-16"
        >
          {emergencyNumbers.AMBULANCE}
          <span className="block text-xs font-normal">SAMU - Ambulância</span>
        </Button>

        <Button
          onClick={() => alert('Bombeiros: ' + emergencyNumbers.FIRE)}
          size="md"
          isFullWidth
          variant="danger"
          leftIcon="🚒"
        >
          {emergencyNumbers.FIRE} - Bombeiros
        </Button>

        <Button
          onClick={() => alert('Polícia: ' + emergencyNumbers.POLICE)}
          size="md"
          isFullWidth
          variant="danger"
          leftIcon="🚔"
        >
          {emergencyNumbers.POLICE} - Polícia
        </Button>
      </div>

      {/* Find Hospitals */}
      <Card variant="outlined" padding="md">
        <Button
          onClick={handleFindNearbyHospitals}
          isLoading={isLoading}
          size="md"
          isFullWidth
          variant="primary"
          leftIcon="🏥"
        >
          Encontrar Hospitais Próximos
        </Button>
        {coords && (
          <p className="text-xs text-dark-500 mt-2 text-center">
            Localização: {GeolocationService.formatLocation(coords)}
          </p>
        )}
      </Card>

      {/* Emergency Guide */}
      <Button
        onClick={() => setShowEmergencyGuide(true)}
        size="md"
        isFullWidth
        variant="secondary"
        leftIcon="📋"
      >
        Guia de Emergência
      </Button>

      {/* Emergency Guide Modal */}
      <Modal
        isOpen={showEmergencyGuide}
        onClose={() => setShowEmergencyGuide(false)}
        title="Guia de Emergência"
        size="lg"
      >
        <div className="space-y-4 text-sm text-dark-200">
          <div>
            <h4 className="font-bold text-error mb-2">🚨 PROCURE HOSPITAL IMEDIATAMENTE SE:</h4>
            <ul className="space-y-1 ml-4">
              <li>• Sangramento vaginal abundante (mais que um absorvente por hora)</li>
              <li>• Nenhum movimento fetal</li>
              <li>• Dor abdominal constante e severa</li>
              <li>• Febre alta (acima de 38.5°C)</li>
              <li>• Visão turva ou escura</li>
              <li>• Tontura ou desmaio</li>
              <li>• Dificuldade para respirar</li>
              <li>• Convulsões</li>
            </ul>
          </div>

          <div className="border-t border-dark-700 pt-4">
            <h4 className="font-bold text-warning mb-2">⚠️ CONTATE SEU MÉDICO SE:</h4>
            <ul className="space-y-1 ml-4">
              <li>• Sangramento vaginal leve</li>
              <li>• Contrações muito irregulares</li>
              <li>• Falta de progressão por 2+ horas</li>
              <li>• Febre leve (37.8-38.5°C)</li>
              <li>• Dúvidas sobre sintomas</li>
            </ul>
          </div>

          <div className="border-t border-dark-700 pt-4">
            <h4 className="font-bold text-success mb-2">✓ VOCÊ PODE FICAR EM CASA SE:</h4>
            <ul className="space-y-1 ml-4">
              <li>• Contrações regulares mas não tão intensas</li>
              <li>• Consegue falar durante contrações</li>
              <li>• Nenhum sangramento</li>
              <li>• Movimento fetal normal</li>
              <li>• Sem febre</li>
            </ul>
          </div>

          <div className="bg-primary-900/20 border border-primary-700/50 p-3 rounded-lg">
            <p className="text-xs">
              <strong>Lembre-se:</strong> Quando em dúvida, procure atendimento médico. 
              É melhor ir e ser avaliada do que arriscar.
            </p>
          </div>
        </div>
      </Modal>

      {/* Hospitals List Modal */}
      <Modal
        isOpen={showHospitalList}
        onClose={() => setShowHospitalList(false)}
        title="Hospitais Próximos"
        size="lg"
      >
        {nearbyHospitals && nearbyHospitals.length > 0 ? (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {nearbyHospitals.map(hospital => (
              <Card key={hospital.id} variant="outlined" padding="md">
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-dark-100">{hospital.name}</h4>
                      <p className="text-xs text-dark-400">{hospital.address}</p>
                    </div>
                    <Badge variant="primary">{Math.round(hospital.distance)} km</Badge>
                  </div>

                  <div className="text-xs text-dark-400 space-y-1">
                    <p>
                      <strong>Telefone:</strong>{' '}
                      <a href={`tel:${hospital.phone}`} className="text-primary-400 hover:underline">
                        {hospital.phone}
                      </a>
                    </p>
                    <p>
                      <strong>ETA:</strong> ~{GeolocationService.calculateETA(hospital.distance)} min
                    </p>
                    {hospital.rating && (
                      <p>
                        <strong>Avaliação:</strong> ⭐ {hospital.rating}/5
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="primary"
                      isFullWidth
                      onClick={() => handleCallHospital(hospital.id)}
                    >
                      📞 Ligar
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      isFullWidth
                      onClick={() => {
                        if (coords) {
                          const url = GeolocationService.getGoogleMapsURL(
                            hospital.coordinates.latitude,
                            hospital.coordinates.longitude,
                            coords.latitude,
                            coords.longitude
                          )
                          window.open(url, '_blank')
                        }
                      }}
                    >
                      🗺️ Rota
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-dark-300 mb-4">Nenhum hospital encontrado perto de você.</p>
            <Button variant="secondary" size="sm" onClick={() => setShowHospitalList(false)}>
              Fechar
            </Button>
          </div>
        )}
      </Modal>

      {/* Important Info */}
      <Card variant="outlined" padding="md" className="space-y-2 text-xs text-dark-400">
        <p className="font-semibold text-dark-200">ℹ️ Informações Importantes:</p>
        <ul className="space-y-1 ml-4">
          <li>• Mantenha seu acompanhante informado</li>
          <li>• Confie em seus instintos</li>
          <li>• Você tem direito a um acompanhante</li>
          <li>• Este app não substitui avaliação médica</li>
          <li>• Quando em dúvida, procure o hospital</li>
        </ul>
      </Card>
    </div>
  )
}
