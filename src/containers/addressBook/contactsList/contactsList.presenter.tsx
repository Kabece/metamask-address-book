import './contactList.styles.css'

const getInitials = (name: string) =>
  name
    .split(' ')
    .map((word: string) => word[0].toUpperCase())
    .slice(0, 2)

export interface Contact {
  name: string
  address: string
}

interface Props {
  contacts: Contact[]
  onAddNewContact: () => void
}

const ContactsList = ({ contacts, onAddNewContact }: Props): JSX.Element => (
  <div>
    <h1 className="contact-list--header">Address Book</h1>

    <button
      type="button"
      onClick={onAddNewContact}
      className="contact-list--new-contact">
      <div>+</div>
      <div>New Contact</div>
    </button>

    <div>
      {contacts.map((contact: Contact) => (
        <div key={contact.name} className="contact-card">
          <div className="contact-card--initials">
            {getInitials(contact.name)}
          </div>
          <span className="contact-card--name">{contact.name}</span>
        </div>
      ))}
    </div>
  </div>
)

export default ContactsList
