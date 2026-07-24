# 🤰 PartoMagnus (Parto Magnus)

> Acompanhamento de Parto Baseado em Evidências para Gestantes Brasileiras

## 📋 Visão Geral

PartoMagnus é um Progressive Web App (PWA) clínico para acompanhamento de parto em tempo real, desenvolvido com protocolos da OMS e FEBRASGO. Oferece monitoramento de contrações, detecção de fases do trabalho de parto, recomendações de posições, técnicas de respiração, frequências de cura Solfeggio, e suporte de emergência.

**Desenvolvido com:** React 18 + TypeScript + Vite + Zustand + Tailwind CSS

## ✨ Features Principais

### 👶 Pré-Parto
- ✅ Onboarding interativo com frequência 432 Hz
- ✅ Anamnese em 5 passos (dados clínicos completos)
- ✅ Dashboard home com dicas diárias
- ✅ Avaliação de risco (LOW/MEDIUM/HIGH)

### 📊 Monitoramento de Parto (CORE)
- ✅ Contador de contrações com analytics em tempo real
- ✅ Detecção automática de 7 fases do parto (Prodromal → Completed)
- ✅ Análise de padrão de contrações (regularidade, intervalo, intensidade)
- ✅ Recomendações dinâmicas por fase
- ✅ Solfeggio frequencies (174-963 Hz com 9 variações)
- ✅ 6 técnicas de respiração guiada (Box breathing, 4-7-8, Ujjayi, etc)
- ✅ 9 posições de parto com benefícios (Standing, Squatting, Water, etc)
- ✅ Afirmações motivacionais + sons ambientes
- ✅ Avaliação de saúde periódica (AnamnesisPoll)
- ✅ Guia para acompanhante com massagens e posições

### 🚨 Segurança & Emergência
- ✅ Sistema de alerta GREEN/YELLOW/RED
- ✅ Integração com SAMU (Ambulância)
- ✅ Localizador de hospitais próximos via geolocalização
- ✅ Contatos de emergência (Polícia, Bombeiros)
- ✅ Guia de quando ir ao hospital
- ✅ Protocolo 5-1-1 para primíparas / 7-1-1 para multíparas

### 📱 Pós-Parto
- ✅ Documentação do bebê (peso, comprimento, Apgar)
- ✅ Geração de PDF relatório
- ✅ Histórico de partos anteriores
- ✅ Sistema de avaliação

### ⚙️ Configurações
- ✅ Dark mode (padrão)
- ✅ Controle de volume
- ✅ Notificações push
- ✅ Vibração háptica
- ✅ Export/Import de dados (JSON)
- ✅ Privacidade: dados 100% locais

## 🏗️ Arquitetura
src/
├── types/              # TypeScript definitions
├── utils/              # Utilities (constants, formatting, validators, algorithms, logger)
├── config/             # Configuration (routes, hospitals, audio, theme)
├── services/           # Business logic (storage, phase, anamnesis, audio, geolocation, notifications, reports, hospitals)
├── store/              # Zustand state management (app, user, labor)
├── hooks/              # Custom React hooks (useLocalStorage, useContraction, usePhase, useGeo, useVibration, useAudio, usePushNotifications)
├── components/         # Base UI (Button, Card, Modal, Header, Badge, ProgressBar, Input)
├── screens/            # Main screens
│   ├── Onboarding.tsx
│   ├── Anamnesis.tsx
│   ├── Home.tsx
│   ├── Settings.tsx
│   ├── History.tsx
│   ├── PostPartum.tsx
│   └── labor/          # Labor subcomponents
│       ├── ContractionCounter.tsx
│       ├── PhaseIndicator.tsx
│       ├── AnamnesisPoll.tsx
│       ├── PositionGuide.tsx
│       ├── BreathingGuide.tsx
│       ├── MusicPanel.tsx
│       ├── SOSPanel.tsx
│       └── CompanionPanel.tsx
├── LaborTracking.tsx   # Main labor dashboard
├── App.tsx             # Router
└── main.tsx            # Entry point

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📦 Dependencies

**Core:**
- react@18
- typescript@5
- vite@5

**State & Storage:**
- zustand (state management)
- localStorage + IndexedDB (persistence)

**UI & Styling:**
- tailwindcss (dark mode, custom theme)
- clsx (class name utilities)
- lucide-react (icons)

**Audio & Haptics:**
- tone.js (Web Audio API)
- navigator.vibrate (haptic feedback)

**PDF Export:**
- jspdf (PDF generation)
- html2canvas (HTML to image)

**Geolocation:**
- navigator.geolocation (device location)
- Haversine formula (distance calculation)

**PWA:**
- Service Worker (offline support)
- manifest.json (PWA metadata)

## 🎯 Clinical Protocols Implemented

### Fases do Parto (7)
1. **PRODROMAL** - Pré-parto (contrações irregulares)
2. **LATENT** - Fase latente (dilatação 0-3cm)
3. **ACTIVE** - Fase ativa (dilatação 3-7cm)
4. **TRANSITION** - Transição (dilatação 7-10cm)
5. **EXPULSIVE** - Fase expulsiva/puxo
6. **DEQUITACAO** - Expulsão da placenta
7. **COMPLETED** - Parto concluído

### Regras de Hospitalização
- **Primíparas (5-1-1):** Contrações a cada 5 min, duração 1 min, 1 hora regular
- **Multíparas (7-1-1):** Contrações a cada 7 min
- **Fatores de risco:** Hospitalize antes se: sangramento, sofrimento fetal, febre, pressão alta

### Frequências Solfeggio (Hz)
- 174 Hz - Alívio da dor
- 285 Hz - Regeneração tecidual
- 396 Hz - Liberação de culpa
- 432 Hz - **Frequência do coração** (repouso)
- 528 Hz - Transformação/cura
- 639 Hz - Conexão/relacionamentos
- 741 Hz - Despertar intuição
- 852 Hz - Retorno ao espiritual
- 963 Hz - Illuminação

### Técnicas de Respiração (6)
1. Box Breathing (4-4-4-4)
2. 4-7-8 Breathing (inspire-segure-expire)
3. Ujjayi (oceano)
4. Abdominal (diafragma)
5. Nadi Shodhana (narinas alternadas)
6. Pursed Lip (lábios franzidos)

## 🔐 Privacidade & Segurança

- ✅ **100% Offline**: Todos os dados armazenados localmente
- ✅ **LGPD Compliant**: Sem envio de dados pessoais
- ✅ **Criptografia**: localStorage + IndexedDB
- ✅ **PWA**: Funciona sem internet
- ✅ **Open Source**: Código transparente

## 📊 Dados Armazenados

```json
{
  "user": {
    "id": "uuid",
    "name": "string",
    "birthDate": "ISO date",
    "createdAt": "ISO datetime"
  },
  "anamnesis": {
    "currentWeek": "number",
    "estimatedDueDate": "ISO date",
    "numberOfPreviousPregnancies": "number",
    "riskLevel": "low|medium|high",
    "...": "clinical data"
  },
  "laborSession": {
    "id": "uuid",
    "contractions": [{
      "id": "uuid",
      "startTime": "timestamp",
      "duration": "seconds",
      "intensity": "LEVE|MODERADA|FORTE",
      "interval": "seconds"
    }],
    "currentPhase": "LATENT|ACTIVE|...",
    "alerts": [{...}]
  }
}
```

## 🎨 Design System

**Colors:**
- Primary: Purple (#a855f7)
- Secondary: Cyan (#06b6d4)
- Accent: Pink (#ec4899)
- Dark: #0a0e27 (background), #1f2937 (cards)

**Typography:**
- Display: Poppins (headings)
- Body: Inter (text)
- Mono: JetBrains Mono (code)

**Spacing:** 4px unit system (4, 8, 12, 16, 20, 24, 32...)

## 🧪 Testing

```bash
# Unit tests (TODO)
npm run test

# E2E tests (TODO)
npm run test:e2e

# Coverage
npm run coverage
```

## 📱 Browser Support

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🔄 State Management

**Zustand Stores:**
- `useAppStore` - UI state (dark mode, modals, pages)
- `useUserStore` - User profile & anamnesis
- `useLaborStore` - Current labor session & monitoring

All stores persist to localStorage with Zustand middleware.

## 🚢 Deployment

**Recommended:**
- Vercel (serverless, PWA support)
- Netlify (CI/CD, branch previews)
- AWS Amplify (regional CDN)

```bash
# Build
npm run build

# Output: dist/ folder (ready to deploy)
```

## 📞 Support & Contact

- 📧 Email: support@parto-magnus.com (TODO)
- 🐛 Issues: GitHub Issues
- 💬 Feedback: User feedback form in app

## 📄 License

MIT License - Desenvolvido com ❤️ para gestantes brasileiras

## 🙏 Créditos

- **Clinical Guidelines:** OMS, FEBRASGO, WHO
- **UI Design:** Inspiração em apps modernos de saúde
- **Audio:** Solfeggio frequencies da tradição ancestral
- **Icons:** Lucide React

---

**Versão:** 0.1.0 | **Última Atualização:** 2026-07-19 | **Status:** Beta (Em Desenvolvimento)

**⚠️ IMPORTANTE:** Este aplicativo é um suporte clínico e NÃO substitui acompanhamento médico profissional. Sempre consulte seu médico ou parteira para orientações clínicas.

