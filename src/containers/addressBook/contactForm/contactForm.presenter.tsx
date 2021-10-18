import * as React from 'react'

import Button from 'src/components/button/button.presenter'
import Input from 'src/components/input/input.presenter'
import type { Contact } from '../contactsList/contactsList.presenter'

import './contactForm.styles.css'

interface Props {
  readonly isEditMode?: boolean
  readonly contact?: Contact
  readonly onSave: (contact: Contact) => void
  readonly onDelete?: () => void
}

const ContactForm = ({
  isEditMode,
  contact,
  onSave,
  onDelete,
}: Props): JSX.Element => {
  const [name, setName] = React.useState(contact?.name ?? '')
  const [address, setAddress] = React.useState(contact?.address ?? '')

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
          value={name}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setName(event.target.value)
          }}
        />

        <Input
          label="Address"
          id="address"
          type="text"
          value={address}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setAddress(event.target.value)
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
            onClick={() => {
              onSave({ name, address })
            }}>
            Save
          </Button>
        </div>
      </form>
    </div>
  )
}

export default ContactForm
