import { useEtherBalance, useEthers } from '@usedapp/core'
import { formatEther } from '@ethersproject/units'

function App(): JSX.Element {
  const { activateBrowserWallet, account, deactivate } = useEthers()
  const etherBalance = useEtherBalance(account)

  return (
    <div>
      <p>Hello World</p>
      <button onClick={() => activateBrowserWallet()} type="button">
        Connect
      </button>
      <div>
        {account ? (
          <span>Connected with {account}</span>
        ) : (
          <span>Not connected</span>
        )}
      </div>
      <div>
        {etherBalance && (
          <span>
            ETH Balance: {parseFloat(formatEther(etherBalance)).toFixed(4)}
          </span>
        )}
      </div>
      <button onClick={() => deactivate()} type="button">
        Disconnect
      </button>
    </div>
  )
}

export default App
