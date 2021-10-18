import * as React from 'react'
import { useSendTransaction } from '@usedapp/core'
import { utils } from 'ethers'

import AvatarPlaceholder from 'src/components/avatarPlaceholder/avatarPlaceholder.presenter'
import Input from 'src/components/input/input.presenter'
import Button from 'src/components/button/button.presenter'

import type { Contact } from '../contactsList/contactsList.presenter'
import './transactionForm.styles.css'

interface Props {
  readonly contact: Contact
}

const TransactionForm = ({ contact }: Props): JSX.Element => {
  const [amount, setAmount] = React.useState(0)
  const [isMining, setIsMining] = React.useState(false)
  const { sendTransaction, state } = useSendTransaction()

  React.useEffect(() => {
    if (state.status !== 'Mining') {
      setIsMining(false)
      setAmount(0)
    }
  }, [state])

  return (
    <div className="transaction-form">
      <h1>Send to {contact.name}</h1>

      <AvatarPlaceholder name={contact.name} />

      <div className="transaction-form--address">{contact.address}</div>

      <form
        onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault()
        }}
        className="transaction-form--form">
        <Input
          label="Transaction amount"
          id="transactionAmount"
          type="number"
          value={amount}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setAmount(Number.parseFloat(event.target.value))
          }}
        />

        <Button
          label="Send"
          actionType="primary"
          isDisabled={isMining}
          onClick={() => {
            setIsMining(true)
            void sendTransaction({
              to: contact.address,
              value: utils.parseEther(amount.toString()),
            })
          }}
        />
      </form>

      {isMining && (
        <div className="transaction-form--mining-container">
          <div className="transaction-form--mining-loader" />
          <span>Transaction in progress...</span>
        </div>
      )}
    </div>
  )
}

export default TransactionForm
