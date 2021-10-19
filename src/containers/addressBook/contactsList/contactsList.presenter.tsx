import AvatarPlaceholder from 'src/components/avatarPlaceholder/avatarPlaceholder.presenter'
import Button from 'src/components/button/button.presenter'

import './contactList.styles.css'

export interface Contact {
  readonly name: string
  readonly address: string
  readonly ensName?: string
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

    <Button actionType="link" onClick={onAddNewContact}>
      <div className="contact-list--new-contact">
        <div>+</div>
        <div>New Contact</div>
      </div>
    </Button>

    <div className="contact-list--contacts">
      {contacts.map((contact: Contact) => (
        <Button
          key={contact.name}
          actionType="link"
          onClick={() => {
            onSelectContact(contact)
          }}>
          <AvatarPlaceholder name={contact.name} />
          <span className="contact-card--name">{contact.name}</span>
        </Button>
      ))}
    </div>
  </div>
)

export default ContactsList
