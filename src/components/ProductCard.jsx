export default function ProductCard({ product }) {
  return (
    <div className="card">
      <img src={product.thumbnail} alt={product.title} />
      <div className="card-body">
        <span className="category">{product.category}</span>
        <h3>{product.title}</h3>
        <p className="price">{product.price} zł</p>
      </div>
    </div>
  )
}
