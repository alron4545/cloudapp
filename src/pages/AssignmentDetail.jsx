import { Link, useParams } from 'react-router-dom'
import Panel from '../components/Panel.jsx'
import { findAssignment } from '../data/assignments.js'
import NotFound from './NotFound.jsx'

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function Empty({ children }) {
  return <span className="placeholder">{children}</span>
}

function Block({ block }) {
  switch (block.type) {
    case 'p':
      return block.text ? <p>{block.text}</p> : null

    case 'list':
      return (
        <ul className="writeup__list">
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )

    case 'steps':
      return (
        <ol className="writeup__steps">
          {block.items.map((step, i) => (
            <li key={step.title || i}>
              <span className="writeup__step-num" aria-hidden="true">
                {i + 1}
              </span>
              <div>
                <h3>{step.title || `Step ${i + 1}`}</h3>
                {step.body ? <p>{step.body}</p> : <Empty>Describe this step.</Empty>}
                {step.image && (
                  <Block block={{ type: 'image', src: step.image, caption: step.caption }} />
                )}
              </div>
            </li>
          ))}
        </ol>
      )

    case 'code':
      return (
        <figure className="code">
          {block.label && <figcaption>{block.label}</figcaption>}
          {block.code ? (
            <pre>
              <code>{block.code}</code>
            </pre>
          ) : (
            <div className="code__empty">Commands or config go here</div>
          )}
        </figure>
      )

    case 'image':
      return block.src ? (
        <figure className="writeup__figure">
          <img src={block.src} alt={block.caption || ''} loading="lazy" />
          {block.caption && <figcaption>{block.caption}</figcaption>}
        </figure>
      ) : (
        <figure className="writeup__figure writeup__figure--empty">
          <div>Screenshot</div>
          {block.caption && <figcaption>{block.caption}</figcaption>}
        </figure>
      )

    case 'table':
      return (
        <div className="table-wrap">
          <table className="writeup__table">
            <thead>
              <tr>
                {block.headers.map((h) => (
                  <th key={h} scope="col">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, r) => (
                <tr key={r}>
                  {row.map((cell, c) =>
                    c === 0 ? (
                      <th key={c} scope="row">
                        {cell || <Empty>&mdash;</Empty>}
                      </th>
                    ) : (
                      <td key={c}>{cell || <Empty>&mdash;</Empty>}</td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )

    case 'qa':
      return (
        <ul className="writeup__challenges">
          {block.items.map((item, i) => (
            <li key={item.problem || i}>
              <p>
                <strong>Problem:</strong> {item.problem}
              </p>
              <p>
                <strong>Solution:</strong> {item.solution}
              </p>
            </li>
          ))}
        </ul>
      )

    case 'links':
      return block.items.length > 0 ? (
        <ul className="writeup__list">
          {block.items.map((link) => (
            <li key={link.url}>
              <a href={link.url} target="_blank" rel="noreferrer">
                {link.label || link.url}
              </a>
            </li>
          ))}
        </ul>
      ) : null

    default:
      return null
  }
}

function Section({ section, id, number }) {
  const blocks = section.blocks ?? []
  const guide = section.guide ?? []
  const hasText = blocks.some((b) => b.type === 'p' && b.text)
  const hasContent = blocks.some((b) => b.type !== 'p' && b.type !== 'links') ||
    blocks.some((b) => b.type === 'links' && b.items.length > 0)

  return (
    <section className="writeup__section" id={id}>
      <h2>
        {number && <span className="writeup__num">{number}.</span>} {section.title}
      </h2>

      {!hasText && guide.length > 0 && (
        <div className="writeup__guide">
          <p>To cover in this section:</p>
          <ul>
            {guide.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {(hasText || hasContent) && (
        <div className="writeup__body">
          {blocks.map((block, i) => (
            <Block key={i} block={block} />
          ))}
        </div>
      )}
    </section>
  )
}

export default function AssignmentDetail() {
  const { slug } = useParams()
  const item = findAssignment(slug)

  if (!item) return <NotFound />

  const sections = item.sections ?? []
  const numbered = sections.length > 5

  return (
    <Panel eyebrow={`${item.course} · ${item.term}`} title={item.title}>
      <Link to="/assignments" className="back-link">
        <span aria-hidden="true">&larr;</span> All assignments
      </Link>

      <div className="writeup__meta">
        <span className="badge">{item.status}</span>
        {item.tags?.length > 0 && (
          <ul className="tags">
            {item.tags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        )}
      </div>

      {numbered && (
        <nav className="toc" aria-label="Contents">
          <p>Contents</p>
          <ol>
            {sections.map((section) => (
              <li key={section.title}>
                <a href={`#${slugify(section.title)}`}>{section.title}</a>
              </li>
            ))}
          </ol>
        </nav>
      )}

      {sections.map((section, i) => (
        <Section
          key={section.title}
          section={section}
          id={slugify(section.title)}
          number={numbered ? i + 1 : null}
        />
      ))}
    </Panel>
  )
}
