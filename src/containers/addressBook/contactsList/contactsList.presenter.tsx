import AvatarPlaceholder from 'src/components/avatarPlaceholder/avatarPlaceholder.presenter'

import './contactList.styles.css'

export interface Contact {
  readonly name: string
  readonly address: string
}

interface Props {
  readonly contacts: Contact[]
  readonly onAddNewContact: () => void
  readonly onSelectContact: (contact: Contact) => void
}

const ContactsList = ({
  contacts,
  onAddNewContact,
  onSelectContact,
}: Props): JSX.Element => (
  <div className="contact-list">
    <h1>Address Book</h1>

    <button
      type="button"
      onClick={onAddNewContact}
      className="contact-list--new-contact">
      <div>+</div>
      <div>New Contact</div>
    </button>

    <div className="contact-list--contacts">
      {contacts.map((contact: Contact) => (
        <button
          key={contact.name}
          className="contact-card"
          onClick={() => {
            onSelectContact(contact)
          }}
          type="button">
          <AvatarPlaceholder name={contact.name} />
          <span className="contact-card--name">{contact.name}</span>
        </button>
      ))}
    </div>
  </div>
)

export default ContactsList
