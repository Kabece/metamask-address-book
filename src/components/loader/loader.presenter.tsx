import './loader.styles.css'

interface Props {
  readonly text: string
}

const Loader = ({ text }: Props): JSX.Element => (
  <div className="loader--container">
    <div className="loader--spinner" />
    <span>{text}</span>
  </div>
)

export default Loader
