import { Link } from 'react-router-dom'
import Panel from '../components/Panel.jsx'
import { assignments } from '../data/assignments.js'

export default function Assignments() {
  return (
    <Panel eyebrow="Trail Log" title="Assignments">
      {assignments.length === 0 ? (
        <p className="placeholder">No assignments yet.</p>
      ) : (
        <ul className="cards">
          {assignments.map((item) => (
            <li key={item.slug}>
              <Link to={`/assignments/${item.slug}`} className="card card--link">
                <div className="card__top">
                  <h2 className="card__title">{item.title}</h2>
                  <span className="badge">{item.status}</span>
                </div>
                <p className="card__meta">
                  {item.course} &middot; {item.term}
                </p>
                <p className="card__body">{item.description}</p>
                {item.tags?.length > 0 && (
                  <ul className="tags">
                    {item.tags.map((tag) => (
                      <li key={tag}>{tag}</li>
                    ))}
                  </ul>
                )}
                <span className="card__cta">
                  Read the write-up <span aria-hidden="true">&rarr;</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
      <p className="hint">
        Add more entries in <code>src/data/assignments.js</code>.
      </p>
    </Panel>
  )
}
