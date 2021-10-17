import { useEthers } from '@usedapp/core'

import SignIn from 'src/containers/signIn/signIn.container'
import AddressBook from 'src/containers/addressBook/addressBook.container'

function App(): JSX.Element {
  const { account } = useEthers()
  // const etherBalance = useEtherBalance(account)

  return <div className="main">{account ? <AddressBook /> : <SignIn />}</div>

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
