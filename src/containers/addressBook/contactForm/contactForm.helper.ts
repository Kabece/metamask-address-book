import { utils, providers } from 'ethers'

import type { Contact } from '../contactsList/contactsList.presenter'
import type { FormErrors, FormMode, IsDirtyMap } from './contactForm.types'

export const validateForm = (
  editedContact: Contact,
  isDirtyMap: IsDirtyMap,
  formMode: FormMode,
  initialContact?: Contact,
  allContacts?: Contact[],
  // It's more readable to have all these rules in one place
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

  // If address is empty disable saving and show error message if form dirty
  if (isDirtyMap.address && editedContact.address === '') {
    formErrors = {
      ...formErrors,
      address:
        editedContact.address === '' ? 'Please enter an address' : undefined,
      isSaveDisabled: true,
    }
  }

  // If ensName is empty disable saving and show error message if form dirty
  if (isDirtyMap.ensName && editedContact.ensName === '') {
    formErrors = {
      ...formErrors,
      ensName:
        editedContact.ensName === '' ? 'Please enter an ENS name' : undefined,
      isSaveDisabled: true,
    }
  }

  // Either address or ensName needs to be filled
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

  // If the edit form is back to initial values, disable saving
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

export const resolveEnsNameAddress = async (
  ensName: string,
): Promise<string | undefined> => {
  try {
    const provider = new providers.EtherscanProvider(
      'rinkeby',
      // In prod would have to hide the API key better
      process.env.REACT_APP_ETHERSCAN_API_KEY,
    )
    return provider.resolveName(ensName)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('error while resolving ens name', error)
  }
  return undefined
}
