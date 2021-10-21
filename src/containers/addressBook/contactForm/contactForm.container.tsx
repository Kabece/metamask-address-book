import { useState, useEffect } from 'react'
import type { FormEvent, ChangeEvent } from 'react'

import Button from 'src/components/button/button.presenter'
import Input from 'src/components/input/input.presenter'
import Loader from 'src/components/loader/loader.presenter'
import type { Contact } from '../contactsList/contactsList.presenter'

import AddressArea from './addressArea/addressArea.presenter'
import { validateForm, resolveEnsNameAddress } from './contactForm.helper'
import type {
  FormErrors,
  FormMode,
  IsDirtyMap,
  AddressInputType,
} from './contactForm.types'
import './contactForm.styles.css'

interface Props {
  readonly formMode: FormMode
  readonly contacts?: Contact[]
  readonly selectedContact?: Contact
  readonly onSave: (contact: Contact) => void
  readonly onDelete?: () => void
}

const ContactForm = ({
  formMode,
  contacts,
  selectedContact,
  onSave,
  onDelete,
}: Props): JSX.Element => {
  const [editedContact, setEditedContact] = useState<Contact>(
    selectedContact ?? {
      name: '',
      address: '',
      ensName: '',
    },
  )
  const [isDirtyMap, setIsDirtyMap] = useState<IsDirtyMap>({
    name: false,
    address: false,
    ensName: false,
  })
  const [addressInputType, setAddressInputType] = useState<AddressInputType>(
    'address',
  )
  const [isLoadingEns, setIsLoadingEns] = useState(false)
  const [formErrors, setFormErrors] = useState<FormErrors>({
    isSaveDisabled: false,
  })

  useEffect(() => {
    setFormErrors(
      validateForm(
        editedContact,
        isDirtyMap,
        formMode,
        selectedContact,
        contacts,
      ),
    )
  }, [editedContact, isDirtyMap, formMode, selectedContact, contacts])

  return (
    <div className="contact-form--container">
      <h1 className="contact-form--header">
        {formMode === 'edit' ? 'Edit' : 'New'} Contact
      </h1>

      <form
        onSubmit={(event: FormEvent<HTMLFormElement>) => {
          event.preventDefault()
        }}
        className="contact-form--form">
        <Input
          label="Name"
          id="name"
          type="text"
          value={editedContact.name}
          error={formErrors.name}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            setEditedContact({
              ...editedContact,
              name: event.target.value,
            })
            setIsDirtyMap({
              ...isDirtyMap,
              name: true,
            })
          }}
        />

        <AddressArea
          addressInputType={addressInputType}
          selectedContact={selectedContact}
          editedContact={editedContact}
          isDirtyMap={isDirtyMap}
          formErrors={formErrors}
          setAddressInputType={setAddressInputType}
          setEditedContact={setEditedContact}
          setIsDirtyMap={setIsDirtyMap}
        />

        <div className="contact-form--form--actions">
          {formMode === 'edit' && (
            <Button
              actionType="tertiary"
              onClick={() => {
                if (onDelete) {
                  onDelete()
                }
              }}>
              Delete Contact
            </Button>
          )}

          <Button
            actionType="primary"
            isDisabled={formErrors.isSaveDisabled}
            onClick={() => {
              if (editedContact) {
                // If using ENS Name we have to resolve it to check if it's valid
                // In case of address, the validation is handled on type
                if (addressInputType === 'ens' && editedContact.ensName) {
                  setIsLoadingEns(true)
                  void resolveEnsNameAddress(editedContact.ensName).then(
                    (address?: string) => {
                      if (address) {
                        onSave({
                          ...editedContact,
                          address,
                        })
                      }

                      setFormErrors({
                        ...formErrors,
                        ensName: 'Provided ENS name was not recognised',
                        isSaveDisabled: true,
                      })
                      setIsLoadingEns(false)
                    },
                  )
                } else {
                  onSave(editedContact)
                }
              }
            }}>
            Save
          </Button>

          <div className="contact-form--loader">
            {isLoadingEns && <Loader text="Checking ENS name" />}
          </div>
        </div>
      </form>
    </div>
  )
}

export default ContactForm
