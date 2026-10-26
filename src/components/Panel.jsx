// Wooden-framed park sign used as the container on every inner page.
export default function Panel({ eyebrow, title, children }) {
  return (
    <article className="sign sign--wide">
      <div className="sign__inner sign__inner--left">
        <header className="panel__header">
          {eyebrow && <p className="panel__eyebrow">{eyebrow}</p>}
          <h1 className="panel__title">{title}</h1>
        </header>
        <div className="sign__rule" aria-hidden="true">
          <span>&#9650;</span>
        </div>
        {children}
      </div>
    </article>
  )
}
