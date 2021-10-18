import { useEthers } from '@usedapp/core'

import Button from 'src/components/button/button.presenter'

import './signIn.styles.css'

const SignIn = (): JSX.Element => {
  const { activateBrowserWallet } = useEthers()

  return (
    <section className="sign-in">
      <img
        width="256"
        alt="MetaMask Fox"
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/MetaMask_Fox.svg/256px-MetaMask_Fox.svg.png"
      />

      <h1>Crypto address book</h1>
      <p className="sign-in--text">
        The easiest and quickest way to manage and pay your contacts. <br />{' '}
        Connect yout wallet to begin.
      </p>
      <Button
        actionType="primary"
        onClick={() => {
          activateBrowserWallet()
        }}>
        Connect Wallet
      </Button>
    </section>
  )
}

export default SignIn
