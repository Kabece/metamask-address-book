import { useEthers } from '@usedapp/core'

import SignIn from 'src/containers/signIn/signIn.container'
import AddressBook from 'src/containers/addressBook/addressBook.container'

function App(): JSX.Element {
  const { account } = useEthers()

  return <div className="main">{account ? <AddressBook /> : <SignIn />}</div>
}

export default App
