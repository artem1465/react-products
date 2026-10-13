export default function SearchBar({ value, onSearch }) {
  return (
    <input
      type="text"
      className="search"
      placeholder="Szukaj produktu…"
      value={value}
      onChange={(e) => onSearch(e.target.value)}
    />
  )
}
