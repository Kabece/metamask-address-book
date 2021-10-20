import * as React from 'react'
import { useSendTransaction, useEthers, useEtherBalance } from '@usedapp/core'
import { useCoingeckoPrice } from '@usedapp/coingecko'
import { utils, providers } from 'ethers'

import AvatarPlaceholder from 'src/components/avatarPlaceholder/avatarPlaceholder.presenter'
import Input from 'src/components/input/input.presenter'
import Button from 'src/components/button/button.presenter'
import Loader from 'src/components/loader/loader.presenter'

import { validateForm } from './transactionForm.helper'
import type { Contact } from '../contactsList/contactsList.presenter'
import './transactionForm.styles.css'

const etherscanProvider = new providers.EtherscanProvider(
  'rinkeby',
  // In prod would have to hide the API key better
  process.env.REACT_APP_ETHERSCAN_API_KEY,
)

interface Props {
  readonly contact: Contact
  readonly onEditContact: () => void
}

// eslint-disable-next-line sonarjs/cognitive-complexity
const TransactionForm = ({ contact, onEditContact }: Props): JSX.Element => {
  const [amount, setAmount] = React.useState<number | undefined>()
  const [isDirty, setIsDirty] = React.useState(false)
  const [isMining, setIsMining] = React.useState(false)
  const [isLoadingFee, setIsLoadingFee] = React.useState(false)
  const [fee, setFee] = React.useState<
    { eth: string; nzd?: string } | undefined
  >()

  const { sendTransaction, state } = useSendTransaction()
  const { account } = useEthers()
  // It's correct
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const ethPrice: string | undefined = useCoingeckoPrice('ethereum', 'nzd') as
    | string
    | undefined
  const etherBalance = useEtherBalance(account)
  const formErrors = validateForm(isDirty, amount, etherBalance)

  React.useEffect(() => {
    if (state.status !== 'Mining') {
      setIsMining(false)
      setAmount(0)
    }
  }, [state])

  React.useEffect(() => {
    void (async () => {
      if (amount) {
        setIsLoadingFee(true)
        try {
          const estimatedGas = await etherscanProvider.estimateGas({
            to: contact.address,
            value: utils.parseEther(amount.toString()),
          })
          const gasPrice = await etherscanProvider.getGasPrice()
          const transactionFee = utils.formatEther(estimatedGas.mul(gasPrice))
          setFee({
            eth: transactionFee,
            nzd:
              ethPrice &&
              (Number.parseFloat(transactionFee) * Number.parseFloat(ethPrice))
                .toFixed(2)
                .toString(),
          })
          setIsLoadingFee(false)
        } catch (error) {
          // eslint-disable-next-line no-console
          console.log('error while estimating gas', error)
          setIsLoadingFee(false)
        }
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
            setIsDirty(true)
          }}
        />
        <div className="transaction-form--fee">
          {fee === undefined && !isLoadingFee ? (
            <span>Enter amount to see the estimated tx fee</span>
          ) : (
            <div>
              {isLoadingFee ? (
                <Loader text="Estimating tx fee... " />
              ) : (
                <span>
                  Estimated tx fee: {fee?.eth.slice(0, 8)} ETH,{' '}
                  {fee?.nzd && `$${fee.nzd} NZD`}
                </span>
              )}
            </div>
          )}
        </div>
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
      </form>

      {isMining && <Loader text="Mining in progress..." />}
    </div>
  )
}

export default TransactionForm
