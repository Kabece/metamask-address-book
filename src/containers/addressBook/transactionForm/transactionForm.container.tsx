import React, { useState, useEffect, useMemo, useRef, useContext } from 'react'
import { useSendTransaction, useEthers, useEtherBalance } from '@usedapp/core'
import { useCoingeckoPrice } from '@usedapp/coingecko'
import { utils } from 'ethers'

import AvatarPlaceholder from 'src/components/avatarPlaceholder/avatarPlaceholder.presenter'
import Input from 'src/components/input/input.presenter'
import Button from 'src/components/button/button.presenter'
import Loader from 'src/components/loader/loader.presenter'
import { NotificationsContext } from 'src/app'

import FeeEstimate from './feeEstimate/feeEstimate.presenter'
import {
  validateForm,
  estimateTransactionFee,
  notifyOnSuccessfulTransaction,
} from './transactionForm.helper'
import type { Fee, FormErrors } from './transactionForm.helper'
import type { Contact } from '../contactsList/contactsList.presenter'
import './transactionForm.styles.css'

interface Props {
  readonly contact: Contact
  readonly onEditContact: () => void
}

const TransactionForm = ({ contact, onEditContact }: Props): JSX.Element => {
  const [amount, setAmount] = useState<number | undefined>()
  const [isMining, setIsMining] = useState(false)
  const [isLoadingFee, setIsLoadingFee] = useState(false)
  const [fee, setFee] = useState<Fee | undefined>()
  const notificationsContext = useContext(NotificationsContext)

  const { sendTransaction, state: transactionState } = useSendTransaction()
  const { account } = useEthers()
  const etherBalance = useEtherBalance(account)
  const ethPrice: string | undefined = useCoingeckoPrice('ethereum', 'nzd')

  const isDirty = useRef(false)
  const formErrors: FormErrors = useMemo(
    () => validateForm(isDirty.current, amount, etherBalance),
    [isDirty, amount, etherBalance],
  )

  useEffect(() => {
    if (transactionState.status === 'Success' && amount) {
      notifyOnSuccessfulTransaction(amount, contact.name, notificationsContext)
    }

    if (transactionState.status === 'Exception') {
      console.log('yo', transactionState.errorMessage)
    }

    if (transactionState.status !== 'Mining') {
      setIsMining(false)
      setAmount(0)
      isDirty.current = false
    }
    // We don't want those extra dependencies, it should run only on tx transactionState change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactionState])

  useEffect(() => {
    void (async () => {
      if (amount) {
        setIsLoadingFee(true)
        const transactionFee = await estimateTransactionFee(
          amount,
          contact.address,
          ethPrice,
        )
        setFee(transactionFee)
        setIsLoadingFee(false)
      }
    })()
  }, [amount, contact.address, ethPrice])

  return (
    <div className="transaction-form">
      <div className="transaction-form--contact-data">
        <h1>Send to {contact.name}</h1>
        <div className="transaction-form--address">{contact.address}</div>

        <AvatarPlaceholder name={contact.name} />
        <Button
          actionType="link"
          onClick={() => {
            onEditContact()
          }}>
          edit contact
        </Button>
      </div>

      <form
        onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault()
        }}
        className="transaction-form--form">
        <Input
          label="Transaction amount"
          id="transactionAmount"
          value={amount ?? ''}
          type="number"
          error={formErrors.message}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            const newAmount = Number.parseFloat(event.target.value)
            setAmount(Number.isNaN(newAmount) ? undefined : newAmount)
            isDirty.current = true
          }}
        />

        <div className="transaction-form--fee">
          <FeeEstimate isLoadingFee={isLoadingFee} fee={fee} />
        </div>

        <div>
          <Button
            actionType="primary"
            isDisabled={isMining || formErrors.isSendDisabled}
            onClick={() => {
              setIsMining(true)
              if (amount) {
                void sendTransaction({
                  to: contact.address,
                  value: utils.parseEther(amount.toString()),
                })
              }
            }}>
            Send
          </Button>
        </div>
      </form>

      <div className="transaction-form--mining-loader">
        {isMining && <Loader text="Sending in progress..." />}
      </div>
    </div>
  )
}

export default TransactionForm
