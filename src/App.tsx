import { useState, createContext } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import { useEthers } from '@usedapp/core'

import SignIn from 'src/containers/signIn/signIn.container'
import AddressBook from 'src/containers/addressBook/addressBook.container'
import Notification from 'src/components/notification/notification.presenter'

interface NotificationData {
  readonly message: string
  readonly type: 'success' | 'warning' | 'error'
}

export interface NotificationsContextInterface {
  setNotification?: Dispatch<SetStateAction<NotificationData | undefined>>
}

export const NotificationsContext = createContext<
  NotificationsContextInterface | undefined
>(undefined)

function App(): JSX.Element {
  const [notification, setNotification] = useState<
    NotificationData | undefined
  >()
  const { account } = useEthers()

  return (
    <NotificationsContext.Provider value={{ setNotification }}>
      <div className="main">
        {account ? <AddressBook /> : <SignIn />}
        {notification && (
          <Notification
            message={notification?.message}
            type={notification?.type}
          />
        )}
      </div>
    </NotificationsContext.Provider>
  )
}

export default App
