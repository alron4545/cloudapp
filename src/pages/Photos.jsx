import Panel from '../components/Panel.jsx'
import { albums } from '../data/photos.json'

const dateFormat = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
})

function formatDate(iso) {
  return iso ? dateFormat.format(new Date(iso)) : ''
}

function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3v12m0 0-5-5m5 5 5-5M4 19h16" />
    </svg>
  )
}

function Album({ album }) {
  const headingId = `album-${album.id}`

  return (
    <section className="album" aria-labelledby={headingId}>
      <header className="album__header">
        {album.group && <p className="album__group">{album.group}</p>}
        <h2 id={headingId} className="album__name">
          {album.name}
        </h2>
        <p className="album__count">
          {album.photos.length} {album.photos.length === 1 ? 'photo' : 'photos'}
        </p>
      </header>

      <ul className="gallery">
        {album.photos.map((photo) => {
          const label = photo.caption || formatDate(photo.taken) || photo.file
          return (
            <li key={photo.src} className="gallery__item">
              <figure>
                <a href={photo.src} target="_blank" rel="noreferrer" className="gallery__open">
                  <img
                    src={photo.thumb}
                    alt={photo.caption || `${album.name} photo`}
                    width={photo.width}
                    height={photo.height}
                    loading="lazy"
                    decoding="async"
                  />
                </a>
                <figcaption>
                  <span>{label}</span>
                  <a
                    href={`/download${photo.src}`}
                    download={photo.file}
                    className="gallery__download"
                    aria-label={`Download ${label}`}
                  >
                    <DownloadIcon />
                    Download
                  </a>
                </figcaption>
              </figure>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

export default function Photos() {
  const hasPhotos = albums.some((album) => album.photos.length > 0)

  return (
    <Panel eyebrow="Scenic Overlook" title="Photos">
      {hasPhotos ? (
        albums.map((album) => <Album key={album.id} album={album} />)
      ) : (
        <>
          <ul className="gallery" aria-label="Empty photo slots">
            {[1, 2, 3].map((n) => (
              <li key={n} className="gallery__item gallery__item--empty">
                <span>Photo {n}</span>
              </li>
            ))}
          </ul>
          <p className="hint">
            Put photos in <code>photos-src/</code> and run <code>npm run photos</code>.
          </p>
        </>
      )}
    </Panel>
  )
}
