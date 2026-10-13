import { useEffect, useState } from 'react'
import SearchBar from './components/SearchBar'
import CategoryFilter from './components/CategoryFilter'
import ProductsList from './components/ProductsList'

const LIMITS = [10, 20, 30]

const SORTS = [
  { value: 'default', label: 'Domyślnie' },
  { value: 'price-asc', label: 'Cena: rosnąco' },
  { value: 'price-desc', label: 'Cena: malejąco' },
  { value: 'title', label: 'Nazwa A-Z' },
]

export default function App() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [sort, setSort] = useState('default')
  const [limit, setLimit] = useState(10)
  const [page, setPage] = useState(0)

  // pobieranie kategorii (raz, przy starcie)
  useEffect(() => {
    fetch('https://dummyjson.com/products/categories')
      .then((res) => {
        if (!res.ok) throw new Error('Nie udało się pobrać kategorii')
        return res.json()
      })
      .then((data) => setCategories(data))
      .catch(() => {})
  }, [])

  // pobieranie produktów (przy zmianie szukania / kategorii / limitu / strony)
  useEffect(() => {
    const skip = page * limit
    let url = `https://dummyjson.com/products?limit=${limit}&skip=${skip}`

    if (search.trim() !== '') {
      url = `https://dummyjson.com/products/search?q=${encodeURIComponent(search)}&limit=${limit}&skip=${skip}`
    } else if (category !== '') {
      url = `https://dummyjson.com/products/category/${category}?limit=${limit}&skip=${skip}`
    }

    const controller = new AbortController()
    setLoading(true)
    setError(null)

    fetch(url, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error('Błąd pobierania danych z API')
        return res.json()
      })
      .then((data) => {
        setProducts(data.products)
        setTotal(data.total)
        setLoading(false)
      })
      .catch((err) => {
        if (err.name === 'AbortError') return
        setError(err.message)
        setLoading(false)
      })

    return () => controller.abort()
  }, [search, category, limit, page])

  // sortowanie po stronie klienta
  const sortedProducts = [...products].sort((a, b) => {
    if (sort === 'price-asc') return a.price - b.price
    if (sort === 'price-desc') return b.price - a.price
    if (sort === 'title') return a.title.localeCompare(b.title)
    return 0
  })

  const pageCount = Math.max(1, Math.ceil(total / limit))

  const handleSearch = (value) => {
    setSearch(value)
    setPage(0)
  }

  const handleCategory = (value) => {
    setCategory(value)
    setPage(0)
  }

  const handleLimit = (value) => {
    setLimit(Number(value))
    setPage(0)
  }

  return (
    <div className="container">
      <h1>🛍️ Produkty</h1>

      <div className="controls">
        <SearchBar value={search} onSearch={handleSearch} />
        <CategoryFilter
          categories={categories}
          value={category}
          onChange={handleCategory}
        />
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          {SORTS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        <select value={limit} onChange={(e) => handleLimit(e.target.value)}>
          {LIMITS.map((l) => (
            <option key={l} value={l}>
              {l} na stronę
            </option>
          ))}
        </select>
      </div>

      {loading && <p className="info">Ładowanie produktów…</p>}
      {error && <p className="error">❌ {error}</p>}
      {!loading && !error && sortedProducts.length === 0 && (
        <p className="info">Nie znaleziono produktów.</p>
      )}

      {!loading && !error && sortedProducts.length > 0 && (
        <ProductsList products={sortedProducts} />
      )}

      <div className="pagination">
        <button disabled={page === 0} onClick={() => setPage(page - 1)}>
          ← Poprzednia
        </button>
        <span>
          Strona {page + 1} z {pageCount}
        </span>
        <button disabled={page >= pageCount - 1} onClick={() => setPage(page + 1)}>
          Następna →
        </button>
      </div>
    </div>
  )
}
