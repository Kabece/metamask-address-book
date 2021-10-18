import './avatarPlaceholder.styles.css'

interface Props {
  readonly name: string
}

const getInitials = (name: string) =>
  name
    .split(' ')
    .map((word: string) => word[0].toUpperCase())
    .slice(0, 2)

const AvatarPlaceholder = ({ name }: Props): JSX.Element => (
  <div className="avatar-placeholder">{getInitials(name)}</div>
)

export default AvatarPlaceholder
