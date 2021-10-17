import * as React from 'react'
import { useEthers } from '@usedapp/core'

import SignIn from 'src/containers/signIn/signIn.container'

function App(): JSX.Element {
  const { account } = useEthers()
  // const etherBalance = useEtherBalance(account)

  return (
    <React.Fragment>{account ? <div>YOOO</div> : <SignIn />}</React.Fragment>
  )

  // return (
  //   <div>
  //     <p>Hello World</p>
  //     <button onClick={() => activateBrowserWallet()} type="button">
  //       Connect
  //     </button>
  //     <div>
  //       {account ? (
  //         <span>Connected with {account}</span>
  //       ) : (
  //         <span>Not connected</span>
  //       )}
  //     </div>
  //     <div>
  //       {etherBalance && (
  //         <span>
  //           ETH Balance: {parseFloat(formatEther(etherBalance)).toFixed(4)}
  //         </span>
  //       )}
  //     </div>
  //     <button onClick={() => deactivate()} type="button">
  //       Disconnect
  //     </button>
  //   </div>
  // )
}

export default App
