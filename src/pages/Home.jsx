import UvuMark from '../components/UvuMark.jsx'
import { student } from '../data/student.js'

export default function Home() {
  return (
    <article className="sign">
      <div className="sign__inner">
        <header className="sign__header">
          <UvuMark />
          <p className="sign__university">{student.university}</p>
          <p className="sign__est">Orem, Utah</p>
        </header>

        <div className="sign__rule" aria-hidden="true">
          <span>&#9650;</span>
        </div>

        <h1 className="sign__name">{student.name}</h1>

        <section className="sign__section" aria-labelledby="major-heading">
          <h2 id="major-heading">Major</h2>
          <p className="sign__major">{student.major}</p>
        </section>

        <section className="sign__section" aria-labelledby="edu-heading">
          <h2 id="edu-heading">Education Trail</h2>
          <ol className="trail">
            {student.education.map((step) => (
              <li
                key={step.degree}
                className={step.done ? 'trail__step is-done' : 'trail__step'}
              >
                <span className="trail__marker" aria-hidden="true">
                  {step.done ? '✓' : '→'}
                </span>
                <span className="trail__degree">{step.degree}</span>
                <span className="trail__status">{step.status}</span>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </article>
  )
}
