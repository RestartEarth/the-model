/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PACK?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
