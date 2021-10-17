import * as React from 'react'

import Button from 'src/components/button/button.presenter'
import type { Contact } from '../contactsList/contactsList.presenter'

import './contactForm.styles.css'

interface Props {
  onSave: (contact: Contact) => void
}

const ContactForm = ({ onSave }: Props): JSX.Element => {
  const [name, setName] = React.useState('')
  const [address, setAddress] = React.useState('')

  return (
    <div className="contact-form--container">
      <h1 className="contact-form--header">New Contact</h1>

      <form
        onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault()
        }}
        className="contact-form">
        <label htmlFor="name" className="contact-form--input">
          <span>Name</span>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setName(event.target.value)
            }
          />
        </label>

        <label htmlFor="address" className="contact-form--input">
          <span>Address</span>
          <input
            type="text"
            id="address"
            value={address}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setAddress(event.target.value)
            }
          />
        </label>

        <Button
          label="Save"
          actionType="primary"
          onClick={() => {
            onSave({ name, address })
          }}
        />
      </form>
    </div>
  )
}

export default ContactForm
