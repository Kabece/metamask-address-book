import { MouseEvent } from 'react'

import './button.styles.css'

type ActionType = 'primary' | 'secondary' | 'tertiary'

interface Props {
  readonly label: string
  readonly actionType?: ActionType
  readonly onClick: (event: MouseEvent) => void
}

const Button = ({
  label,
  actionType = 'primary',
  onClick,
}: Props): JSX.Element => (
  <button className={`btn btn--${actionType}`} onClick={onClick} type="button">
    {label}
  </button>
)

export default Button
