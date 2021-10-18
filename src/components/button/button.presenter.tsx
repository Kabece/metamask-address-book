import * as React from 'react'

import './button.styles.css'

type ActionType = 'primary' | 'secondary' | 'tertiary' | 'link'

interface Props {
  readonly children: React.ReactNode
  readonly actionType?: ActionType
  readonly isDisabled?: boolean
  readonly onClick: (event: React.MouseEvent) => void
}

const Button = ({
  children,
  actionType = 'primary',
  isDisabled,
  onClick,
}: Props): JSX.Element => (
  <button
    className={`btn btn--${actionType} ${isDisabled ? 'btn_disabled' : ''}`}
    onClick={onClick}
    type="button"
    disabled={isDisabled}>
    {children}
  </button>
)

export default Button
