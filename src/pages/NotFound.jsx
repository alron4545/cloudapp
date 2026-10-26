import { Link } from 'react-router-dom'
import Panel from '../components/Panel.jsx'

export default function NotFound() {
  return (
    <Panel eyebrow="Off Trail" title="Page Not Found">
      <p className="prose">
        This trail doesn&rsquo;t go anywhere. <Link to="/">Head back to the trailhead.</Link>
      </p>
    </Panel>
  )
}
