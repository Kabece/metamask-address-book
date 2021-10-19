import { utils, BigNumber } from 'ethers'

interface FormErrors {
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
