import { utils, providers, BigNumber } from 'ethers'

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
