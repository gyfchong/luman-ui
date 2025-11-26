export type RegistryItemType =
  | 'registry:ui'
  | 'registry:component'
  | 'registry:block'
  | 'registry:page'
  | 'registry:hook'

export type RegistryItemFileType =
  | 'registry:component'
  | 'registry:ui'
  | 'registry:hook'
  | 'registry:lib'
  | 'registry:style'

export interface RegistryItemFile {
  path: string
  type: RegistryItemFileType
  content?: string
  target?: string
}

export interface RegistryItem {
  name: string
  type: RegistryItemType
  description?: string
  dependencies?: string[]
  devDependencies?: string[]
  registryDependencies?: string[]
  files: RegistryItemFile[]
  tailwind?: {
    config?: {
      theme?: Record<string, any>
      plugins?: string[]
    }
  }
  cssVars?: {
    light?: Record<string, string>
    dark?: Record<string, string>
  }
  meta?: {
    importSpecifier?: string
    displayName?: string
  }
}

export interface Registry {
  [key: string]: RegistryItem
}
