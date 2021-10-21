import { Fragment } from 'react'
import type { ChangeEvent, Dispatch } from 'react'

import Button from 'src/components/button/button.presenter'
import Input from 'src/components/input/input.presenter'

import { actionCreators } from '../contactForm.reducer'
import type {
  Action,
  FormErrors,
  AddressInputType,
} from '../contactForm.reducer'
import type { Contact } from '../../contactsList/contactsList.presenter'
import './addressArea.styles.css'

interface Props {
  readonly addressInputType: AddressInputType
  readonly selectedContact?: Contact
  readonly editedContact: Contact
  readonly formErrors: FormErrors
  readonly dispatch: Dispatch<Action>
}
const AddressArea = ({
  addressInputType,
  selectedContact,
  editedContact,
  formErrors,
  dispatch,
}: Props): JSX.Element => (
  <Fragment>
    {/* Button to switch between Address and ENS Name */}
    <div className={`address-area--address-type-switch ${addressInputType}`}>
      <Button
        actionType="link"
        onClick={() => {
          dispatch(
            actionCreators.selectAddressInputType('address', selectedContact),
          )
        }}>
        Address
      </Button>
      <Button
        actionType="link"
        onClick={() => {
          dispatch(
            actionCreators.selectAddressInputType('ensName', selectedContact),
          )
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
          dispatch(actionCreators.updateAddress(event.target.value))
        }}
      />
    )}

    {addressInputType === 'ensName' && (
      <Input
        label="ENS Name"
        id="ensName"
        type="text"
        value={editedContact.ensName ?? ''}
        error={formErrors.ensName}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          dispatch(actionCreators.updateEnsName(event.target.value))
        }}
      />
    )}
  </Fragment>
)

export default AddressArea
