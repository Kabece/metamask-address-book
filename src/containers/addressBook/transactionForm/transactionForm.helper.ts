import React, { useEffect, useContext } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import { utils, providers, BigNumber } from 'ethers'
import { useSendTransaction } from '@usedapp/core'
import type { TransactionRequest } from '@ethersproject/abstract-provider'

import { NotificationsContext } from 'src/app'
import type { NotificationsContextInterface } from 'src/app'

export interface Fee {
  eth: string
  nzd?: string
}

export interface FormErrors {
  message?: string
  isSendDisabled?: boolean
}

export const validateForm = (
  isDirty: boolean,
  amount?: number,
  etherBalance?: BigNumber,
): FormErrors => {
  let formErrors: FormErrors = {
    isSendDisabled: false,
  }

  // If amount 0
  if (amount === 0) {
    formErrors = {
      isSendDisabled: true,
    }
  }

  // If amount empty
  if (isDirty && !amount) {
    formErrors = {
      ...formErrors,
      isSendDisabled: true,
      message: 'Please enter amount',
    }
  }

  // If insufficient balance
  if (
    isDirty &&
    etherBalance &&
    amount &&
    utils.parseUnits(amount.toString(), 'ether').gt(etherBalance)
  ) {
    formErrors = {
      isSendDisabled: true,
      message: `Please come back from the moon.`,
    }
  }

  return formErrors
}

export const estimateTransactionFee = async (
  amount: number,
  address: string,
  ethPrice?: string,
): Promise<Fee | undefined> => {
  const etherscanProvider = new providers.EtherscanProvider(
    'rinkeby',
    // In prod would have to hide the API key better
    process.env.REACT_APP_ETHERSCAN_API_KEY,
  )

  try {
    const [estimatedGas, gasPrice] = await Promise.all([
      etherscanProvider.estimateGas({
        to: address,
        value: utils.parseEther(amount.toString()),
      }),
      etherscanProvider.getGasPrice(),
    ])

    const transactionFee = utils.formatEther(estimatedGas.mul(gasPrice))
    const transactionFeeNzd =
      ethPrice &&
      (Number.parseFloat(transactionFee) * Number.parseFloat(ethPrice))
        .toFixed(2)
        .toString()

    return {
      eth: transactionFee,
      nzd: transactionFeeNzd,
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('error while estimating gas', error)
  }

  return undefined
}

export const notifyOnSuccessfulTransaction = (
  amount: number,
  name: string,
  notificationsContext?: NotificationsContextInterface,
): void => {
  if (notificationsContext?.setNotification) {
    notificationsContext?.setNotification({
      message: `Sent ${amount} ETH to ${name}`,
      type: 'success',
    })
  }
}

export const notifyOnFailedTransaction = (
  message: string,
  notificationsContext?: NotificationsContextInterface,
): void => {
  if (notificationsContext?.setNotification) {
    notificationsContext?.setNotification({
      message,
      type: 'error',
    })
  }
}

/**
 * A custom hook wrapping useSendTransaction from @usedapp/core
 * with error handling.
 */
export const useSendTransactionWithErrorHandling = (
  name: string,
  setIsMining: Dispatch<SetStateAction<boolean>>,
  setAmount: Dispatch<SetStateAction<number | undefined>>,
  isDirty: React.MutableRefObject<boolean>,
  amount?: number,
): ((tr: TransactionRequest) => Promise<void>) => {
  const { sendTransaction, state: transactionState } = useSendTransaction()
  const notificationsContext = useContext(NotificationsContext)

  useEffect(() => {
    if (transactionState.status === 'Success' && amount) {
      notifyOnSuccessfulTransaction(amount, name, notificationsContext)
    }

    if (
      transactionState.status === 'Exception' &&
      transactionState.errorMessage?.includes('User denied transaction')
    ) {
      notifyOnFailedTransaction(
        `You're the boss. Transaction rejected.`,
        notificationsContext,
      )
    }

    if (transactionState.status === 'Fail') {
      notifyOnFailedTransaction(
        'Something went wrong. Please try again.',
        notificationsContext,
      )
    }

    if (transactionState.status !== 'Mining') {
      setIsMining(false)
      setAmount(0)
      // eslint-disable-next-line no-param-reassign
      isDirty.current = false
    }
    // We don't want those extra dependencies, it should run only on tx transactionState change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactionState])

  return sendTransaction
}
