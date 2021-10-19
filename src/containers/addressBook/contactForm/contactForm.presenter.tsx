import * as React from 'react'

import Button from 'src/components/button/button.presenter'
import Input from 'src/components/input/input.presenter'
import type { Contact } from '../contactsList/contactsList.presenter'

import { validateForm } from './contactForm.helper'
import './contactForm.styles.css'

interface Props {
  readonly isEditMode?: boolean
  readonly contacts?: Contact[]
  readonly selectedContact?: Contact
  readonly onSave: (contact: Contact) => void
  readonly onDelete?: () => void
}

const ContactForm = ({
  isEditMode,
  contacts,
  selectedContact,
  onSave,
  onDelete,
}: Props): JSX.Element => {
  const [editedContact, setEditedContact] = React.useState(
    selectedContact ?? {
      name: '',
      address: '',
    },
  )
  const [initialContact] = React.useState(selectedContact)
  const [isDirtyMap, setIsDirtyMap] = React.useState({
    name: false,
    address: false,
  })

  const formErrors = validateForm(
    editedContact,
    isDirtyMap,
    !!isEditMode,
    initialContact,
    contacts,
  )

  return (
    <div className="contact-form--container">
      <h1 className="contact-form--header">
        {isEditMode ? 'Edit' : 'New'} Contact
      </h1>

      <form
        onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault()
        }}
        className="contact-form--form">
        <Input
          label="Name"
          id="name"
          type="text"
          value={editedContact.name}
          error={formErrors.name}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setEditedContact({
              name: event.target.value,
              address: editedContact.address,
            })
            setIsDirtyMap({
              name: true,
              address: isDirtyMap.address,
            })
          }}
        />

        <Input
          label="Address"
          id="address"
          type="text"
          value={editedContact.address}
          error={formErrors.address}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setEditedContact({
              name: editedContact.name,
              address: event.target.value,
            })
            setIsDirtyMap({
              name: isDirtyMap.name,
              address: true,
            })
          }}
        />

        <div className="contact-form--form--actions">
          {isEditMode && (
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
                onSave(editedContact)
              }
            }}>
            Save
          </Button>
        </div>
      </form>
    </div>
  )
}

export default ContactForm
