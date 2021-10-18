import * as React from 'react'

import './input.styles.css'

interface Props {
  readonly label: string
  readonly id: string
  readonly type: 'text' | 'number'
  readonly value: string | number
  readonly onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const Input = ({ label, id, value, type, onChange }: Props): JSX.Element => (
  <label htmlFor={id} className="input">
    <span>{label}</span>
    <input type={type} id={id} value={value} onChange={onChange} />
  </label>
)

export default Input
