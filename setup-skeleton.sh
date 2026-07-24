#!/bin/bash

# PARTO MAGNUS - Setup Skeleton Script
# Cria toda a estrutura de pastas e arquivos vazios
# Uso: chmod +x setup-skeleton.sh && ./setup-skeleton.sh

set -e

echo "🚀 PARTO MAGNUS - Criando estrutura do projeto..."
echo ""

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ============================================
# 1. PASTAS PRINCIPAIS
# ============================================
echo -e "${BLUE}📁 Criando pastas principais...${NC}"

mkdir -p src/{components,screens/labor,hooks,services,store,types,utils,assets/{icons,images/positions,audio/{affirmations,breathing-guides,environments,background}},config}
mkdir -p public
mkdir -p tests/{unit,e2e}
mkdir -p scripts

echo -e "${GREEN}✓ Pastas criadas${NC}"

# ============================================
# 2. ARQUIVOS CORE (vazios)
# ============================================
echo -e "${BLUE}📝 Criando arquivos core...${NC}"

# src/
touch src/main.tsx
touch src/App.tsx
touch src/index.css
touch src/vite-env.d.ts

# public/
touch public/index.html
touch public/manifest.json
touch public/favicon.ico
touch public/logo.svg

echo -e "${GREEN}✓ Arquivos core criados${NC}"

# ============================================
# 3. COMPONENTS
# ============================================
echo -e "${BLUE}📝 Criando componentes...${NC}"

touch src/components/Button.tsx
touch src/components/Card.tsx
touch src/components/Modal.tsx
touch src/components/Header.tsx
touch src/components/Badge.tsx
touch src/components/ProgressBar.tsx
touch src/components/Input.tsx

echo -e "${GREEN}✓ Componentes criados${NC}"

# ============================================
# 4. SCREENS
# ============================================
echo -e "${BLUE}📝 Criando telas principais...${NC}"

touch src/screens/Onboarding.tsx
touch src/screens/Anamnesis.tsx
touch src/screens/Home.tsx
touch src/screens/LaborTracking.tsx
touch src/screens/PostPartum.tsx
touch src/screens/History.tsx
touch src/screens/Settings.tsx

# Labor subcomponents
touch src/screens/labor/ContractionCounter.tsx
touch src/screens/labor/PhaseIndicator.tsx
touch src/screens/labor/AnamnesisPoll.tsx
touch src/screens/labor/PositionGuide.tsx
touch src/screens/labor/BreathingGuide.tsx
touch src/screens/labor/MusicPanel.tsx
touch src/screens/labor/SOSPanel.tsx
touch src/screens/labor/CompanionPanel.tsx

echo -e "${GREEN}✓ Telas criadas${NC}"

# ============================================
# 5. HOOKS
# ============================================
echo -e "${BLUE}📝 Criando hooks customizados...${NC}"

touch src/hooks/useLocalStorage.ts
touch src/hooks/useContractionLogic.ts
touch src/hooks/usePhaseDetection.ts
touch src/hooks/useGeolocation.ts
touch src/hooks/useVibration.ts
touch src/hooks/useAudio.ts
touch src/hooks/usePushNotifications.ts

echo -e "${GREEN}✓ Hooks criados${NC}"

# ============================================
# 6. SERVICES
# ============================================
echo -e "${BLUE}📝 Criando serviços...${NC}"

touch src/services/storageService.ts
touch src/services/phaseAlgorithm.ts
touch src/services/anamnesisService.ts
touch src/services/audioService.ts
touch src/services/geolocationService.ts
touch src/services/notificationService.ts
touch src/services/reportService.ts
touch src/services/hospitalService.ts

echo -e "${GREEN}✓ Serviços criados${NC}"

# ============================================
# 7. STORE (ZUSTAND)
# ============================================
echo -e "${BLUE}📝 Criando stores Zustand...${NC}"

touch src/store/appStore.ts
touch src/store/laborStore.ts
touch src/store/userStore.ts

echo -e "${GREEN}✓ Stores criados${NC}"

# ============================================
# 8. TYPES
# ============================================
echo -e "${BLUE}📝 Criando definições de tipos...${NC}"

touch src/types/index.ts
touch src/types/user.ts
touch src/types/labor.ts
touch src/types/hospital.ts
touch src/types/audio.ts

echo -e "${GREEN}✓ Types criados${NC}"

# ============================================
# 9. UTILS
# ============================================
echo -e "${BLUE}📝 Criando utilitários...${NC}"

touch src/utils/constants.ts
touch src/utils/formatting.ts
touch src/utils/validators.ts
touch src/utils/logger.ts
touch src/utils/algorithms.ts

echo -e "${GREEN}✓ Utils criados${NC}"

# ============================================
# 10. CONFIG
# ============================================
echo -e "${BLUE}📝 Criando arquivos de configuração...${NC}"

touch src/config/routes.ts
touch src/config/audio-frequencies.ts
touch src/config/hospitals.ts
touch src/config/theme.ts

echo -e "${GREEN}✓ Configurações criadas${NC}"

# ============================================
# 11. TESTS
# ============================================
echo -e "${BLUE}📝 Criando testes...${NC}"

touch tests/setup.ts
touch tests/unit/phaseAlgorithm.test.ts
touch tests/unit/formatting.test.ts
touch tests/unit/validators.test.ts
touch tests/e2e/onboarding.test.ts

echo -e "${GREEN}✓ Testes criados${NC}"

# ============================================
# 12. ROOT CONFIG FILES
# ============================================
echo -e "${BLUE}📝 Criando arquivos de configuração raiz...${NC}"

touch .gitignore
touch .env.example
touch .env.local
touch vite.config.ts
touch tsconfig.json
touch tailwind.config.js
touch postcss.config.js
touch package.json
touch README.md
touch ARCHITECTURE.md
touch CONTRIBUTING.md

echo -e "${GREEN}✓ Arquivos raiz criados${NC}"

# ============================================
# 13. SCRIPTS
# ============================================
echo -e "${BLUE}📝 Criando scripts úteis...${NC}"

touch scripts/dev.sh
touch scripts/build.sh
touch scripts/generate-frequencies.js

echo -e "${GREEN}✓ Scripts criados${NC}"

# ============================================
# RESUMO FINAL
# ============================================
echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ SKELETON CRIADO COM SUCESSO!${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"
echo ""
echo "📊 Resumo:"
echo "   • Pastas: $(find . -type d | wc -l)"
echo "   • Arquivos: $(find . -type f | wc -l)"
echo ""
echo "🚀 Próximos passos:"
echo "   1. cd parto-magnus"
echo "   2. pnpm install (ou npm install)"
echo "   3. Seguir a ordem de criação de arquivos no PROJECT_STRUCTURE.md"
echo ""
echo "📝 Checklist disponível em: PROJECT_STRUCTURE.md"
echo ""
