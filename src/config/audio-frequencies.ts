/**
 * Audio frequencies and sound configuration
 * Solfeggio frequencies and guided audio tracks
 */

import { AudioFrequencyInfo, Playlist } from '@/types/audio'
import { BreathingTechnique } from '@/types/labor'

// ============ SOLFEGGIO FREQUENCIES ============

export const FREQUENCY_INFO: Record<number, AudioFrequencyInfo> = {
  174: {
    frequency: 174,
    name: 'Alívio de Dor',
    description: 'Frequência para alívio de dor física e emocional',
    benefits: ['Reduz dor', 'Alívio de feridas', 'Sensação de segurança'],
    useCase: 'Durante contrações intensas, especialmente na transição',
    duration: 300, // 5 minutos
  },
  285: {
    frequency: 285,
    name: 'Regeneração de Tecidos',
    description: 'Estimula regeneração celular e cicatrização',
    benefits: ['Regeneração de tecidos', 'Cicatrização', 'Vitalidade'],
    useCase: 'Fase pós-parto para recuperação',
    duration: 300,
  },
  396: {
    frequency: 396,
    name: 'Liberação de Medo',
    description: 'Ajuda a liberar culpa, medo e bloqueios',
    benefits: ['Liberação de culpa', 'Liberação de medo', 'Empoderamento'],
    useCase: 'No início do parto para acalmar e encorajar',
    duration: 300,
  },
  432: {
    frequency: 432,
    name: 'Tom de Cura',
    description: 'Frequência de cura universal (afinação Stradivarius)',
    benefits: ['Cura geral', 'Harmonia', 'Relaxamento profundo'],
    useCase: 'Durante toda labor para baseline calmo',
    duration: 600, // 10 minutos
  },
  528: {
    frequency: 528,
    name: 'Reparação de DNA',
    description: 'Frequência de reparação celular e DNA',
    benefits: ['Reparação de DNA', 'Cura profunda', 'Transformação'],
    useCase: 'Durante transição e expulsivo para força máxima',
    duration: 300,
  },
  639: {
    frequency: 639,
    name: 'Cura Emocional',
    description: 'Harmonia em relacionamentos e comunicação',
    benefits: ['Conexão emocional', 'Comunicação', 'Harmonia'],
    useCase: 'Para conexão com bebê e acompanhante',
    duration: 300,
  },
  741: {
    frequency: 741,
    name: 'Intuição e Despertar',
    description: 'Amplifica intuição e consciência',
    benefits: ['Intuição', 'Clareza', 'Despertar'],
    useCase: 'Fase latente para conectar com corpo',
    duration: 300,
  },
  852: {
    frequency: 852,
    name: 'Retorno à Ordem',
    description: 'Restaura equilíbrio e ordem natural',
    benefits: ['Equilíbrio', 'Clareza de propósito', 'Retorno ao natural'],
    useCase: 'Entre contrações para recuperação',
    duration: 300,
  },
  963: {
    frequency: 963,
    name: 'Elevação de Consciência',
    description: 'Conexão espiritual e elevação',
    benefits: ['Elevação espiritual', 'Luz divina', 'Transcendência'],
    useCase: 'Momento do nascimento para celebração',
    duration: 300,
  },
}

// ============ BREATHING TECHNIQUES ============

export const BREATHING_TECHNIQUES: BreathingTechnique[] = [
  {
    id: 'abdominal',
    name: 'Respiração Abdominal',
    description: 'Respiração profunda pelo abdômen para relaxamento e energia',
    duration: 300,
    technique: 'abdominal',
    audioUrl: '/audio/breathing-guides/abdominal.mp3',
    forPhase: ['LATENT', 'ACTIVE'],
  },
  {
    id: 'horse-lips',
    name: 'Lábios de Cavalo',
    description: 'Vibração nos lábios para relaxar rosto e períneo',
    duration: 180,
    technique: 'horse_lips',
    audioUrl: '/audio/breathing-guides/horse-lips.mp3',
    forPhase: ['ACTIVE', 'TRANSITION'],
  },
  {
    id: 'short-puffs',
    name: 'Sopros Curtos',
    description: 'Sopros curtos para evitar pujo prematuro',
    duration: 120,
    technique: 'short_puffs',
    audioUrl: '/audio/breathing-guides/short-puffs.mp3',
    forPhase: ['TRANSITION'],
  },
  {
    id: 'j-breath',
    name: 'Respiração em J',
    description: 'Respiração dirigida para expulsivo seguro',
    duration: 420,
    technique: 'j_breath',
    audioUrl: '/audio/breathing-guides/j-breath.mp3',
    forPhase: ['EXPULSIVE'],
  },
  {
    id: 'progressive-relaxation',
    name: 'Relaxamento Progressivo',
    description: 'Relaxamento sistemático de cada parte do corpo',
    duration: 600,
    technique: 'relaxation',
    audioUrl: '/audio/breathing-guides/progressive-relaxation.mp3',
    forPhase: ['LATENT'],
  },
]

// ============ PLAYLISTS ============

export const PLAYLISTS: Playlist[] = [
  {
    id: 'latent-phase',
    name: 'Fase Latente',
    description: 'Músicas e frequências para a fase latente - descanse e relax',
    tracks: [
      {
        id: 'freq-432-latent',
        title: '432 Hz - Tom de Cura',
        description: 'Frequência base para relaxamento',
        category: 'frequencies',
        frequency: 432,
        duration: 600,
        audioUrl: '/audio/frequencies/432hz.mp3',
        language: 'pt-BR',
        explicit: false,
        loopable: true,
        volume: 70,
        createdAt: new Date().toISOString(),
      },
    ],
    category: 'frequencies',
    duration: 600,
    recommendedForPhase: ['LATENT'],
    createdBy: 'beregenerative',
    isOfficial: true,
    isCustom: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'active-phase',
    name: 'Fase Ativa',
    description: 'Frequências e respiração guiada para fase ativa',
    tracks: [
      {
        id: 'freq-528-active',
        title: '528 Hz - Reparação de DNA',
        description: 'Força e vitalidade durante fase ativa',
        category: 'frequencies',
        frequency: 528,
        duration: 600,
        audioUrl: '/audio/frequencies/528hz.mp3',
        language: 'pt-BR',
        explicit: false,
        loopable: true,
        volume: 70,
        createdAt: new Date().toISOString(),
      },
    ],
    category: 'frequencies',
    duration: 600,
    recommendedForPhase: ['ACTIVE'],
    createdBy: 'beregenerative',
    isOfficial: true,
    isCustom: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'transition-phase',
    name: 'Transição',
    description: 'Apoio intenso para o momento mais desafiador',
    tracks: [
      {
        id: 'freq-174-transition',
        title: '174 Hz - Alívio de Dor',
        description: 'Alívio durante transição intensa',
        category: 'frequencies',
        frequency: 174,
        duration: 600,
        audioUrl: '/audio/frequencies/174hz.mp3',
        language: 'pt-BR',
        explicit: false,
        loopable: true,
        volume: 70,
        createdAt: new Date().toISOString(),
      },
    ],
    category: 'frequencies',
    duration: 600,
    recommendedForPhase: ['TRANSITION'],
    createdBy: 'beregenerative',
    isOfficial: true,
    isCustom: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

// ============ ENVIRONMENT SOUNDS ============

export const ENVIRONMENT_SOUNDS = {
  rain: {
    id: 'env-rain',
    title: 'Som de Chuva',
    description: 'Som relaxante de chuva para ambientação',
    category: 'environments' as const,
    duration: 3600,
    audioUrl: '/audio/environments/rain.mp3',
    language: 'pt-BR' as const,
    explicit: false,
    loopable: true,
    environmentType: 'rain' as const,
    ambientVolume: 50,
    loopDuration: 600,
    createdAt: new Date().toISOString(),
  },
  forest: {
    id: 'env-forest',
    title: 'Som de Floresta',
    description: 'Som de floresta com pássaros',
    category: 'environments' as const,
    duration: 3600,
    audioUrl: '/audio/environments/forest.mp3',
    language: 'pt-BR' as const,
    explicit: false,
    loopable: true,
    environmentType: 'forest' as const,
    ambientVolume: 50,
    loopDuration: 600,
    createdAt: new Date().toISOString(),
  },
  ocean: {
    id: 'env-ocean',
    title: 'Som de Oceano',
    description: 'Som waves do oceano para tranquilidade',
    category: 'environments' as const,
    duration: 3600,
    audioUrl: '/audio/environments/ocean.mp3',
    language: 'pt-BR' as const,
    explicit: false,
    loopable: true,
    environmentType: 'ocean' as const,
    ambientVolume: 50,
    loopDuration: 600,
    createdAt: new Date().toISOString(),
  },
}

// ============ AFFIRMATIONS ============

export const AFFIRMATIONS = [
  {
    id: 'aff-strength',
    text: 'Você é forte. Seu corpo sabe o que fazer.',
    affirmationType: 'strength' as const,
    voiceType: 'female' as const,
    speed: 'slow' as const,
    title: 'Força',
    description: 'Afirmação de força e poder',
    category: 'affirmations' as const,
    duration: 15,
    audioUrl: '/audio/affirmations/strength.mp3',
    language: 'pt-BR' as const,
    explicit: false,
    loopable: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'aff-safety',
    text: 'Você está segura. Seu bebê está seguro.',
    affirmationType: 'safety' as const,
    voiceType: 'female' as const,
    speed: 'slow' as const,
    title: 'Segurança',
    description: 'Afirmação de segurança e proteção',
    category: 'affirmations' as const,
    duration: 15,
    audioUrl: '/audio/affirmations/safety.mp3',
    language: 'pt-BR' as const,
    explicit: false,
    loopable: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'aff-progress',
    text: 'Cada contração te traz mais perto do seu bebê.',
    affirmationType: 'progress' as const,
    voiceType: 'female' as const,
    speed: 'slow' as const,
    title: 'Progresso',
    description: 'Afirmação de progresso e movimento',
    category: 'affirmations' as const,
    duration: 20,
    audioUrl: '/audio/affirmations/progress.mp3',
    language: 'pt-BR' as const,
    explicit: false,
    loopable: false,
    createdAt: new Date().toISOString(),
  },
]

// Helper functions
export function getFrequencyInfo(frequency: number): AudioFrequencyInfo | undefined {
  return FREQUENCY_INFO[frequency as keyof typeof FREQUENCY_INFO]
}

export function getBreathingTechnique(id: string): BreathingTechnique | undefined {
  return BREATHING_TECHNIQUES.find(t => t.id === id)
}

export function getPlaylist(id: string): Playlist | undefined {
  return PLAYLISTS.find(p => p.id === id)
}

export function getAffirmation(id: string) {
  return AFFIRMATIONS.find(a => a.id === id)
}

export function getAffirmationsByType(type: string) {
  return AFFIRMATIONS.filter(a => a.affirmationType === type)
}
