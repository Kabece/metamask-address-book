import Loader from 'src/components/loader/loader.presenter'

import { Fee } from '../transactionForm.helper'

interface Props {
  fee?: Fee
  isLoadingFee: boolean
}

const FeeEstimate = ({ isLoadingFee, fee }: Props): JSX.Element => {
  if (fee === undefined && !isLoadingFee) {
    return <span>Enter amount to see the estimated tx fee</span>
  }

  if (isLoadingFee) {
    return <Loader text="Estimating tx fee... " />
  }

  return (
    <span>
      Estimated tx fee: {fee?.eth.slice(0, 8)} ETH,{' '}
      {fee?.nzd && `$${fee.nzd} NZD`}
    </span>
  )
}

export default FeeEstimate
