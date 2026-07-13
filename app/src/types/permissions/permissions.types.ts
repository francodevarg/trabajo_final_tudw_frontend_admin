export type PermissionMode = 'or' | 'and'

export interface PermissionConfig {
  permissions: string[]
  mode?: PermissionMode
}

export type PermissionValue = string | string[] | PermissionConfig
