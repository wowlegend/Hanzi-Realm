/// <reference types="vite/client" />

declare module 'canvas-confetti';

interface ImportMetaEnv {
  readonly VITE_AZURE_KEY: string
  readonly VITE_AZURE_REGION: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
