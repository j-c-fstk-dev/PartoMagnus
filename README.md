# PartoMagnus 🤰✨

## Aplicativo de Acompanhamento de Parto Baseado em Evidências Clínicas

PartoMagnus é um app PWA (Progressive Web App) desenvolvido para acompanhar e orientar gestantes e suas famílias durante o trabalho de parto, com base em protocolos clínicos brasileiros e diretrizes da OMS.

### 🎯 Objetivos

- Empoderar gestantes com informação qualificada sobre as fases do parto
- Reduzir hospitalizações prematuras e cesáreas desnecessárias
- Fornecer suporte emocional contínuo através de frequências sonoras curativas
- Monitorar contrações uterinas com algoritmo inteligente de detecção de fases
- Facilitar comunicação com equipe médica através de históricos compartilháveis

### ✨ Funcionalidades Principais

- 📊 **Contador de Contrações Inteligente**: Detecção automática de fases (Latente → Ativa → Transição → Expulsiva)
- 🔴 **Anamnese com Alertas**: Sistema de triagem de risco (vermelho/amarelo/verde)
- 🎵 **Frequências Sonoras Curativas**: 9 frequências Solfeggio (174-963 Hz) para alívio de dor
- 🧘 **Guias de Respiração**: Técnicas guiadas por áudio para cada fase
- 🧘‍♀️ **Posições para o Parto**: Recomendações dinâmicas baseadas em desconforto
- 📱 **Painel do Acompanhante**: Instruções passo-a-passo para o parceiro
- 🚨 **SOS Integrado**: Geolocalização e rotas para hospitais próximos
- 📋 **Histórico e Relatórios**: PDF exportável do parto completo
- 🌙 **Dark Mode 100%**: Penumbra que respeita ritmo circadiano
- 📴 **Offline-First**: Funciona completamente sem internet

### 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS com Dark Mode
- **Build**: Vite
- **State Management**: Zustand
- **Audio**: Tone.js
- **PWA**: Service Worker + Manifest
- **Storage**: localStorage + IndexedDB
- **PDF**: jsPDF + html2canvas
- **Icons**: Lucide React

### 🌍 Contexto Clínico

Baseado em:
- OMS - Recomendações para Parto Normal
- FEBRASGO - Diretrizes de Atenção ao Parto
- Lei Federal 11.108/2005 - Lei do Acompanhante
- Protocolos de Partograma (WHO)
- Estudos sobre Hipnoparto (NICE Guidelines)

### 🚀 Roadmap

- ✅ Fase 1: Config Base (Vite + React + TypeScript)
- ⬜ Fase 2: Types & Utils
- ⬜ Fase 3: App Configuration
- ⬜ Fase 4: State Management (Zustand)
- ⬜ Fase 5: Business Logic Services
- ⬜ Fase 6: Custom Hooks
- ⬜ Fase 7: Base UI Components
- ⬜ Fase 8: Main Screens (Onboarding, Home, Settings)
- ⬜ Fase 9: Labor Tracking (Core Feature)
- ⬜ Fase 10: Tests & Coverage
- ⬜ Fase 11: Documentation & Polish

### 📋 Licença

MIT - Desenvolvido com ❤️ para gestantes brasileiras

### 👥 Contribuição

Veja [CONTRIBUTING.md](CONTRIBUTING.md) para diretrizes.

---

**Pronto para começar?** Clone e rode `npm install && npm run dev`