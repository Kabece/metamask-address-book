import { useState, useEffect, useReducer, useContext } from 'react'
import type { FormEvent, ChangeEvent } from 'react'

import Button from 'src/components/button/button.presenter'
import Input from 'src/components/input/input.presenter'
import Loader from 'src/components/loader/loader.presenter'
import { NotificationsContext } from 'src/app'

import AddressArea from './addressArea/addressArea.presenter'
import {
  validateForm,
  resolveEnsNameAddress,
  notifyOnSuccessfulSave,
  notifyOnDelete,
} from './contactForm.helper'
import { reducer, getInitialState, actionCreators } from './contactForm.reducer'
import type { FormErrors, FormMode } from './contactForm.reducer'
import type { Contact } from '../contactsList/contactsList.presenter'
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
  const [state, dispatch] = useReducer(
    reducer,
    getInitialState(selectedContact),
  )
  const [isLoadingEns, setIsLoadingEns] = useState(false)
  const [formErrors, setFormErrors] = useState<FormErrors>({
    isSaveDisabled: false,
  })
  const notificationsContext = useContext(NotificationsContext)

  useEffect(() => {
    setFormErrors(
      validateForm(
        state.editedContact,
        state.isDirtyMap,
        formMode,
        selectedContact,
        contacts,
      ),
    )
  }, [state, formMode, selectedContact, contacts])

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
          value={state.editedContact.name}
          error={formErrors.name}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            dispatch(actionCreators.updateName(event.target.value))
          }}
        />

        <AddressArea
          addressInputType={state.addressInputType}
          selectedContact={selectedContact}
          editedContact={state.editedContact}
          formErrors={formErrors}
          dispatch={dispatch}
        />

        <div className="contact-form--form--actions">
          {formMode === 'edit' && (
            <Button
              actionType="tertiary"
              onClick={() => {
                if (onDelete && selectedContact) {
                  onDelete()
                  notifyOnDelete(selectedContact.name, notificationsContext)
                }
              }}>
              Delete Contact
            </Button>
          )}

          <Button
            actionType="primary"
            isDisabled={formErrors.isSaveDisabled}
            onClick={() => {
              if (state.editedContact) {
                // If using ENS Name we have to resolve it to check if it's valid
                // In case of address, the validation is handled on type
                if (
                  state.addressInputType === 'ensName' &&
                  state.editedContact.ensName
                ) {
                  setIsLoadingEns(true)
                  void resolveEnsNameAddress(state.editedContact.ensName).then(
                    (address?: string) => {
                      if (address) {
                        onSave({
                          ...state.editedContact,
                          address,
                        })
                        notifyOnSuccessfulSave(formMode, notificationsContext)
                      }

                      // If ENS couldn't be resolved
                      setFormErrors({
                        ...formErrors,
                        ensName: 'Provided ENS name was not recognised',
                        isSaveDisabled: true,
                      })
                      setIsLoadingEns(false)
                    },
                  )
                } else {
                  onSave(state.editedContact)
                  notifyOnSuccessfulSave(formMode, notificationsContext)
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
