/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string
  readonly VITE_APP_VERSION?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// Service Worker types
interface ServiceWorkerContainer {
  controller: ServiceWorker | null
  ready: Promise<ServiceWorkerRegistration>
  register(scriptURL: string | URL, options?: RegistrationOptions): Promise<ServiceWorkerRegistration>
  getRegistration(clientURL?: string | URL): Promise<ServiceWorkerRegistration | undefined>
  getRegistrations(): Promise<readonly ServiceWorkerRegistration[]>
}

// Vibration API types
interface Navigator {
  vibrate?: (pattern: number | number[]) => boolean
}
