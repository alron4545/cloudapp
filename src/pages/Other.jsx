import Panel from '../components/Panel.jsx'

// Each section shows its `items` as a list of tags; add items to fill it in.
const sections = [
  {
    heading: 'Hobbies',
    items: ['Hiking', 'Road tripping', 'Photography', 'Aviation'],
  },
  {
    heading: 'Skills & Tools',
    items: [],
  },
  {
    heading: 'Contact',
    items: [],
  },
]

export default function Other() {
  return (
    <Panel eyebrow="Backcountry" title="Other">
      <div className="cards cards--grid">
        {sections.map((section) => (
          <section key={section.heading} className="card">
            <h2 className="card__title">{section.heading}</h2>
            {section.items.length > 0 && (
              <ul className="tags tags--large">
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>
    </Panel>
  )
}
