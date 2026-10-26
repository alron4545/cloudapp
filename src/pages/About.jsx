import Panel from '../components/Panel.jsx'
import { student } from '../data/student.js'

export default function About() {
  return (
    <Panel eyebrow="Trailhead" title="About Me">
      <div className="prose">
        <p>
          Hi, I&rsquo;m {student.name}, an {student.major} student at{' '}
          {student.university}. I&rsquo;ve completed my associate degree and
          I&rsquo;m now working toward my bachelor&rsquo;s.
        </p>
      </div>

      <dl className="facts">
        <div>
          <dt>Major</dt>
          <dd>{student.major}</dd>
        </div>
        <div>
          <dt>University</dt>
          <dd>{student.university}</dd>
        </div>
        <div>
          <dt>Degrees</dt>
          <dd>
            {student.education
              .map((step) => `${step.degree} (${step.status.toLowerCase()})`)
              .join(', ')}
          </dd>
        </div>
      </dl>
    </Panel>
  )
}
