/**
 * Application routes configuration
 */

export interface Route {
  path: string
  name: string
  component: string
  requiresAuth?: boolean
  title: string
}

export const ROUTES: Route[] = [
  {
    path: '/',
    name: 'home',
    component: 'Home',
    title: 'Home',
  },
  {
    path: '/onboarding',
    name: 'onboarding',
    component: 'Onboarding',
    title: 'Bem-vindo ao Parto Magnus',
  },
  {
    path: '/anamnesis',
    name: 'anamnesis',
    component: 'Anamnesis',
    requiresAuth: true,
    title: 'Anamnese Obstétrica',
  },
  {
    path: '/labor',
    name: 'labor',
    component: 'LaborTracking',
    requiresAuth: true,
    title: 'Acompanhamento de Parto',
  },
  {
    path: '/postpartum',
    name: 'postpartum',
    component: 'PostPartum',
    requiresAuth: true,
    title: 'Pós-Parto',
  },
  {
    path: '/history',
    name: 'history',
    component: 'History',
    requiresAuth: true,
    title: 'Histórico de Partos',
  },
  {
    path: '/settings',
    name: 'settings',
    component: 'Settings',
    requiresAuth: true,
    title: 'Configurações',
  },
]

export const getRoute = (name: string): Route | undefined => {
  return ROUTES.find(route => route.name === name)
}

export const getRouteByPath = (path: string): Route | undefined => {
  return ROUTES.find(route => route.path === path)
}

// Route navigation helpers
export const NAVIGATION = {
  home: () => '/',
  onboarding: () => '/onboarding',
  anamnesis: () => '/anamnesis',
  labor: () => '/labor',
  postpartum: () => '/postpartum',
  history: () => '/history',
  settings: () => '/settings',
} as const
