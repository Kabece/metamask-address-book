import * as React from 'react'
import { providers } from 'ethers'

import Button from 'src/components/button/button.presenter'
import Input from 'src/components/input/input.presenter'
import Loader from 'src/components/loader/loader.presenter'
import type { Contact } from '../contactsList/contactsList.presenter'

import { validateForm } from './contactForm.helper'
import type { FormErrors } from './contactForm.helper'
import './contactForm.styles.css'

interface Props {
  readonly formMode: 'add' | 'edit'
  readonly contacts?: Contact[]
  readonly selectedContact?: Contact
  readonly onSave: (contact: Contact) => void
  readonly onDelete?: () => void
}

const ContactForm = ({
  formMode,
  contacts,
  selectedContact,
  onSave,
  onDelete,
}: // FIXME:
// eslint-disable-next-line sonarjs/cognitive-complexity
Props): JSX.Element => {
  const [editedContact, setEditedContact] = React.useState(
    selectedContact ?? {
      name: '',
      address: '',
      ensName: '',
    },
  )
  const [isDirtyMap, setIsDirtyMap] = React.useState({
    name: false,
    address: false,
    ensName: false,
  })
  const [addressInputType, setAddressInputType] = React.useState<
    'address' | 'ens'
  >('address')
  const [isLoadingEns, setIsLoadingEns] = React.useState(false)
  const [formErrors, setFormErrors] = React.useState<FormErrors>({
    isSaveDisabled: false,
  })

  React.useEffect(() => {
    setFormErrors(
      validateForm(
        editedContact,
        isDirtyMap,
        formMode,
        selectedContact,
        contacts,
      ),
    )
  }, [editedContact, isDirtyMap, formMode, selectedContact, contacts])

  return (
    <div className="contact-form--container">
      <h1 className="contact-form--header">
        {formMode === 'edit' ? 'Edit' : 'New'} Contact
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
              ...editedContact,
              name: event.target.value,
            })
            setIsDirtyMap({
              ...isDirtyMap,
              name: true,
            })
          }}
        />

        <div
          className={`contact-form--address-type-switch ${addressInputType}`}>
          <Button
            actionType="link"
            onClick={() => {
              setAddressInputType('address')
              setEditedContact({
                ...editedContact,
                ensName: selectedContact?.ensName ?? '',
              })
              setIsDirtyMap({
                ...isDirtyMap,
                ensName: false,
              })
            }}>
            Address
          </Button>
          <Button
            actionType="link"
            onClick={() => {
              setAddressInputType('ens')
              setEditedContact({
                ...editedContact,
                address: selectedContact?.address ?? '',
              })
              setIsDirtyMap({
                ...isDirtyMap,
                address: false,
              })
            }}>
            ENS
          </Button>
        </div>

        {addressInputType === 'address' && (
          <Input
            label="Address"
            id="address"
            type="text"
            value={editedContact.address}
            error={formErrors.address}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setEditedContact({
                ...editedContact,
                address: event.target.value,
              })
              setIsDirtyMap({
                ...isDirtyMap,
                address: true,
              })
            }}
          />
        )}
        {addressInputType === 'ens' && (
          <Input
            label="ENS Name"
            id="ensName"
            type="text"
            value={editedContact.ensName ?? ''}
            error={formErrors.ensName}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setEditedContact({
                ...editedContact,
                ensName: event.target.value,
              })
              setIsDirtyMap({
                ...isDirtyMap,
                ensName: true,
              })
            }}
          />
        )}
        <div className="contact-form--form--actions">
          {formMode === 'edit' && (
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
                if (addressInputType === 'ens' && editedContact.ensName) {
                  setIsLoadingEns(true)
                  const provider = new providers.EtherscanProvider(
                    'rinkeby',
                    // In prod would have to hide the API key better
                    process.env.REACT_APP_ETHERSCAN_API_KEY,
                  )
                  void provider
                    .resolveName(editedContact.ensName)
                    .then((address: string) => {
                      if (address) {
                        onSave({
                          ...editedContact,
                          address,
                        })
                      }
                      setFormErrors({
                        ...formErrors,
                        ensName: 'Provided ENS name was not recognised',
                        isSaveDisabled: true,
                      })
                      setIsLoadingEns(false)
                    })
                    // eslint-disable-next-line no-console
                    .catch((error) =>
                      console.log('error while resolving ens name', error),
                    )
                } else {
                  onSave(editedContact)
                }
              }
            }}>
            Save
          </Button>

          <div className="contact-form--loader">
            {isLoadingEns && <Loader text="Checking ENS name" />}
          </div>
        </div>
      </form>
    </div>
  )
}

export default ContactForm
