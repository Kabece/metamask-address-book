import * as React from 'react'

import ContactsList from './contactsList/contactsList.presenter'
import ContactForm from './contactForm/contactForm.presenter'
import TransactionForm from './transactionForm/transactionForm.container'
import type { Contact } from './contactsList/contactsList.presenter'

import './addressBook.styles.css'

const sortAlphabetically = (a: Contact, b: Contact) =>
  a.name.localeCompare(b.name)

const filterOutCurrentContact = (currentContact?: Contact) => (
  parsedContact: Contact,
) => parsedContact.name !== currentContact?.name

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
            setSelectedContact(undefined)
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
            formMode="add"
            contacts={parsedContacts}
            onSave={(contact: Contact) => {
              localStorage.setItem(
                'contacts',
                JSON.stringify(
                  [...parsedContacts, contact].sort(sortAlphabetically),
                ),
              )
              setMode('placeholder')
            }}
          />
        )}

        {mode === 'edit' && (
          <ContactForm
            formMode="edit"
            contacts={parsedContacts}
            selectedContact={selectedContact}
            onSave={(contact: Contact) => {
              localStorage.setItem(
                'contacts',
                JSON.stringify(
                  [
                    ...parsedContacts.filter(
                      filterOutCurrentContact(selectedContact),
                    ),
                    contact,
                  ].sort(sortAlphabetically),
                ),
              )
              setMode('placeholder')
            }}
            onDelete={() => {
              localStorage.setItem(
                'contacts',
                JSON.stringify(
                  [
                    ...parsedContacts.filter(
                      filterOutCurrentContact(selectedContact),
                    ),
                  ].sort(sortAlphabetically),
                ),
              )
              setMode('placeholder')
            }}
          />
        )}

        {mode === 'transaction' && selectedContact && (
          <TransactionForm
            contact={selectedContact}
            onEditContact={() => {
              setMode('edit')
            }}
          />
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
