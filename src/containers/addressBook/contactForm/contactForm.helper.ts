import { utils } from 'ethers'

import type { Contact } from '../contactsList/contactsList.presenter'

export interface FormErrors {
  readonly name?: string
  readonly address?: string
  readonly ensName?: string
  readonly isSaveDisabled: boolean
}

export const validateForm = (
  editedContact: Contact,
  isDirtyMap: { [Property in keyof Contact]: boolean },
  formMode: 'add' | 'edit',
  initialContact?: Contact,
  allContacts?: Contact[],
  // eslint-disable-next-line sonarjs/cognitive-complexity
): FormErrors => {
  let formErrors: FormErrors = {
    isSaveDisabled: false,
  }

  // If an address is invalid, return error message
  if (isDirtyMap.address && !utils.isAddress(editedContact.address)) {
    formErrors = {
      ...formErrors,
      address: 'Please enter a valid Ethereum address',
      isSaveDisabled: true,
    }
  }

  // If name is empty disable saving and show error message if form dirty
  if (editedContact.name === '') {
    formErrors = {
      ...formErrors,
      name:
        isDirtyMap.name && editedContact.name === ''
          ? 'Please enter a name'
          : undefined,
      isSaveDisabled: true,
    }
  }

  if (isDirtyMap.address && editedContact.address === '') {
    formErrors = {
      ...formErrors,
      address:
        editedContact.address === '' ? 'Please enter an address' : undefined,
      isSaveDisabled: true,
    }
  }

  if (isDirtyMap.ensName && editedContact.ensName === '') {
    formErrors = {
      ...formErrors,
      ensName:
        editedContact.ensName === '' ? 'Please enter an ENS name' : undefined,
      isSaveDisabled: true,
    }
  }

  if (editedContact.address === '' && editedContact.ensName === '') {
    formErrors = {
      ...formErrors,
      isSaveDisabled: true,
    }
  }

  // If a contact with the same names exists, return error messae
  if (
    isDirtyMap.name &&
    editedContact.name !== initialContact?.name &&
    allContacts?.find((contact: Contact) => contact.name === editedContact.name)
  ) {
    formErrors = {
      ...formErrors,
      name: `${editedContact.name} already exists`,
      isSaveDisabled: true,
    }
  }

  // If the form has not changed, disable saving
  if (!isDirtyMap.name && !isDirtyMap.address && !isDirtyMap.ensName) {
    formErrors = {
      ...formErrors,
      isSaveDisabled: true,
    }
  }

  // If the edit form is back to initial values, disable savings
  if (
    formMode === 'edit' &&
    editedContact.name === initialContact?.name &&
    editedContact.address === initialContact?.address &&
    editedContact.ensName === initialContact?.ensName
  ) {
    formErrors = {
      ...formErrors,
      isSaveDisabled: true,
    }
  }

  return formErrors
}
