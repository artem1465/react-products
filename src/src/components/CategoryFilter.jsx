export default function CategoryFilter({ categories, value, onChange }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="">Wszystkie kategorie</option>
      {categories.map((c) => {
        const slug = typeof c === 'string' ? c : c.slug
        const name = typeof c === 'string' ? c : c.name ?? c.slug
        return (
          <option key={slug} value={slug}>
            {name}
          </option>
        )
      })}
    </select>
  )
}
