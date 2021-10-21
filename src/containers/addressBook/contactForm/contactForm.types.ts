import type { Contact } from '../contactsList/contactsList.presenter'

export interface FormErrors {
  readonly name?: string
  readonly address?: string
  readonly ensName?: string
  readonly isSaveDisabled: boolean
}

export type FormMode = 'add' | 'edit'
export type AddressInputType = 'address' | 'ens'

export type IsDirtyMap = { [Property in keyof Contact]: boolean }
