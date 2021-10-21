import './notification.styles.css'

interface Props {
  readonly message: string
  readonly type: 'success' | 'warning' | 'error'
}

const Notification = ({ message, type }: Props): JSX.Element => (
  // Using a random key as we want this component to unmount and mount fresh everytime the notification happens
  <div key={Math.random()} className={`notification ${type}`}>
    {message}
  </div>
)

export default Notification
