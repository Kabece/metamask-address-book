import * as React from 'react'

import './input.styles.css'

interface Props {
  readonly label: string
  readonly id: string
  readonly type: 'text' | 'number'
  readonly value: string | number
  readonly error?: string
  readonly onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const Input = ({
  label,
  id,
  value,
  type,
  error,
  onChange,
}: Props): JSX.Element => (
  <label htmlFor={id} className={`input ${error ? 'input__error' : ''}`}>
    <span>{label}</span>
    <input
      type={type}
      id={id}
      value={value}
      onChange={onChange}
      required={!!error}
    />
    <span>{error}</span>
  </label>
)

export default Input
