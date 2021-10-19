import { utils } from 'ethers'

import type { Contact } from '../contactsList/contactsList.presenter'

interface FormErrors {
  readonly name?: string
  readonly address?: string
  readonly isSaveDisabled: boolean
}

export const validateForm = (
  editedContact: Contact,
  isDirtyMap: { [Property in keyof Contact]: boolean },
  isEditMode: boolean,
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

  // If fields are empty, return error messages
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

  if (editedContact.address === '') {
    formErrors = {
      ...formErrors,
      address:
        isDirtyMap.address && editedContact.address === ''
          ? 'Please enter an address'
          : undefined,
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
  if (!isDirtyMap.name && !isDirtyMap.address) {
    formErrors = {
      ...formErrors,
      isSaveDisabled: true,
    }
  }

  // If the edit form is back to initial values, disable savings
  if (
    isEditMode &&
    editedContact.name === initialContact?.name &&
    editedContact.address === initialContact?.address
  ) {
    formErrors = {
      ...formErrors,
      isSaveDisabled: true,
    }
  }

  return formErrors
}
