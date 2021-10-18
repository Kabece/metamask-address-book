import * as React from 'react'

import Button from 'src/components/button/button.presenter'
import Input from 'src/components/input/input.presenter'
import type { Contact } from '../contactsList/contactsList.presenter'

import './contactForm.styles.css'

interface Props {
  readonly onSave: (contact: Contact) => void
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
