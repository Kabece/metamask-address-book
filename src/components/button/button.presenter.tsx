import { MouseEvent } from 'react'

import './button.styles.css'

type ActionType = 'primary' | 'secondary' | 'tertiary'

interface Props {
  readonly label: string
  readonly actionType?: ActionType
  readonly isDisabled?: boolean
  readonly onClick: (event: MouseEvent) => void
}

const Button = ({
  label,
  actionType = 'primary',
  isDisabled,
  onClick,
}: Props): JSX.Element => (
  <button
    className={`btn btn--${actionType} ${isDisabled ? 'btn_disabled' : ''}`}
    onClick={onClick}
    type="button"
    disabled={isDisabled}>
    {label}
  </button>
)

export default Button
