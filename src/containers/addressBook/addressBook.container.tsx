import * as React from 'react'

import ContactsList from './contactsList/contactsList.presenter'
import ContactForm from './contactForm/contactForm.presenter'
import type { Contact } from './contactsList/contactsList.presenter'

import './addressBook.styles.css'

const AddressBook = (): JSX.Element => {
  const [isAddingNewContact, setIsAddingNewContact] = React.useState(false)
  const storedContacts = localStorage.getItem('contacts')
  const parsedContacts = storedContacts
    ? (JSON.parse(storedContacts) as Contact[])
    : []

  return (
    <div className="address-book">
      <div className="address-book--left">
        <ContactsList
          contacts={parsedContacts}
          onAddNewContact={() => {
            setIsAddingNewContact(true)
          }}
        />
      </div>

      <div className="address-book--right">
        {isAddingNewContact && (
          <ContactForm
            onSave={(contact: Contact) => {
              localStorage.setItem(
                'contacts',
                JSON.stringify([...parsedContacts, contact]),
              )
              setIsAddingNewContact(false)
            }}
          />
        )}

        {!isAddingNewContact && (
          <div className="work-area-placeholder">
            Select a contact or add a new one to begin.
          </div>
        )}
      </div>
    </div>
  )
}

export default AddressBook
