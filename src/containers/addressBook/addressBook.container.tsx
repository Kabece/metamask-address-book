import * as React from 'react'

import ContactsList from './contactsList/contactsList.presenter'
import ContactForm from './contactForm/contactForm.presenter'
import TransactionForm from './transactionForm/transactionForm.container'
import type { Contact } from './contactsList/contactsList.presenter'

import './addressBook.styles.css'

type Mode = 'add' | 'edit' | 'transaction' | 'placeholder'

const AddressBook = (): JSX.Element => {
  const [mode, setMode] = React.useState<Mode>('placeholder')
  const [selectedContact, setSelectedContact] = React.useState<
    Contact | undefined
  >()

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
            setMode('add')
          }}
          onSelectContact={(contact: Contact) => {
            setSelectedContact(contact)
            setMode('transaction')
          }}
        />
      </div>

      <div className="address-book--right">
        {mode === 'add' && (
          <ContactForm
            onSave={(contact: Contact) => {
              localStorage.setItem(
                'contacts',
                JSON.stringify([...parsedContacts, contact]),
              )
              setMode('placeholder')
            }}
          />
        )}

        {mode === 'transaction' && selectedContact && (
          <TransactionForm contact={selectedContact} />
        )}

        {mode === 'placeholder' && (
          <div className="work-area-placeholder">
            Select a contact or add a new one to begin.
          </div>
        )}
      </div>
    </div>
  )
}

export default AddressBook
