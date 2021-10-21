import { Fragment } from 'react'
import type { ChangeEvent, Dispatch, SetStateAction } from 'react'

import Button from 'src/components/button/button.presenter'
import Input from 'src/components/input/input.presenter'

import type {
  FormErrors,
  AddressInputType,
  IsDirtyMap,
} from '../contactForm.types'
import type { Contact } from '../../contactsList/contactsList.presenter'
import './addressArea.styles.css'

interface Props {
  addressInputType: AddressInputType
  selectedContact?: Contact
  editedContact: Contact
  isDirtyMap: IsDirtyMap
  formErrors: FormErrors
  setAddressInputType: Dispatch<SetStateAction<AddressInputType>>
  setEditedContact: Dispatch<SetStateAction<Contact>>
  setIsDirtyMap: Dispatch<SetStateAction<IsDirtyMap>>
}
const AddressArea = ({
  addressInputType,
  selectedContact,
  editedContact,
  isDirtyMap,
  formErrors,
  setAddressInputType,
  setEditedContact,
  setIsDirtyMap,
}: Props): JSX.Element => (
  <Fragment>
    {/* Button to switch between Address and ENS Name */}
    <div className={`address-area--address-type-switch ${addressInputType}`}>
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
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
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
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
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
  </Fragment>
)

export default AddressArea
