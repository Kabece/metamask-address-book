import * as React from 'react'
import classNames from 'classnames'

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
    className={classNames('btn', `btn--${actionType}`, {
      btn__disabled: isDisabled,
    })}
    onClick={onClick}
    type="button"
    disabled={isDisabled}>
    {children}
  </button>
)

export default Button
