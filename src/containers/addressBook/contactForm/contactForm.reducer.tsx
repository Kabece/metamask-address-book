import type { Contact } from '../contactsList/contactsList.presenter'

export interface FormErrors {
  readonly name?: string
  readonly address?: string
  readonly ensName?: string
  readonly isSaveDisabled: boolean
}

export type FormMode = 'add' | 'edit'
export type AddressInputType = 'address' | 'ensName'

export type IsDirtyMap = { [Property in keyof Contact]: boolean }

interface State {
  editedContact: Contact
  isDirtyMap: IsDirtyMap
  addressInputType: AddressInputType
}

export const getInitialState = (selectedContact?: Contact): State => ({
  editedContact: selectedContact ?? {
    name: '',
    address: '',
    ensName: '',
  },
  isDirtyMap: {
    name: false,
    address: false,
    ensName: false,
  },
  addressInputType: 'address',
})

enum Actions {
  UPDATE_NAME,
  UPDATE_ADDRESS,
  UPDATE_ENS_NAME,
  SELECT_ADDRESS_INPUT_TYPE,
}

export const actionCreators = {
  updateName: (
    name: string,
  ): { type: Actions.UPDATE_NAME; payload: { name: string } } => ({
    type: Actions.UPDATE_NAME as const,
    payload: { name },
  }),
  updateAddress: (
    address: string,
  ): { type: Actions.UPDATE_ADDRESS; payload: { address: string } } => ({
    type: Actions.UPDATE_ADDRESS as const,
    payload: { address },
  }),
  updateEnsName: (
    ensName: string,
  ): { type: Actions.UPDATE_ENS_NAME; payload: { ensName: string } } => ({
    type: Actions.UPDATE_ENS_NAME as const,
    payload: { ensName },
  }),
  selectAddressInputType: (
    addressInputType: AddressInputType,
    selectedContact?: Contact,
  ): {
    type: Actions.SELECT_ADDRESS_INPUT_TYPE
    payload: { addressInputType: AddressInputType; selectedContact?: Contact }
  } => ({
    type: Actions.SELECT_ADDRESS_INPUT_TYPE as const,
    payload: { addressInputType, selectedContact },
  }),
}

export type Action =
  | ReturnType<typeof actionCreators.updateName>
  | ReturnType<typeof actionCreators.updateAddress>
  | ReturnType<typeof actionCreators.updateEnsName>
  | ReturnType<typeof actionCreators.selectAddressInputType>

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case Actions.UPDATE_NAME: {
      const { name } = action.payload
      return {
        ...state,
        editedContact: {
          ...state.editedContact,
          name,
        },
        isDirtyMap: {
          ...state.isDirtyMap,
          name: true,
        },
      }
    }

    case Actions.UPDATE_ADDRESS: {
      const { address } = action.payload
      return {
        ...state,
        editedContact: {
          ...state.editedContact,
          address,
        },
        isDirtyMap: {
          ...state.isDirtyMap,
          address: true,
        },
      }
    }

    case Actions.UPDATE_ENS_NAME: {
      const { ensName } = action.payload
      return {
        ...state,
        editedContact: {
          ...state.editedContact,
          ensName,
        },
        isDirtyMap: {
          ...state.isDirtyMap,
          ensName: true,
        },
      }
    }

    case Actions.SELECT_ADDRESS_INPUT_TYPE: {
      const { addressInputType, selectedContact } = action.payload

      if (addressInputType === 'address') {
        return {
          ...state,
          addressInputType,
          editedContact: {
            ...state.editedContact,
            ensName: selectedContact?.ensName ?? '',
          },
          isDirtyMap: {
            ...state.isDirtyMap,
            ensName: false,
          },
        }
      }

      if (addressInputType === 'ensName') {
        return {
          ...state,
          addressInputType,
          editedContact: {
            ...state.editedContact,
            address: selectedContact?.address ?? '',
          },
          isDirtyMap: {
            ...state.isDirtyMap,
            address: false,
          },
        }
      }

      return state
    }

    default:
      return state
  }
}
