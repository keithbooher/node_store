import React from 'react'
import { Link } from 'react-router-dom'

const ProductCard = ({product}) => {
  return (
    <div key={product._id}>
      <div className="card blue-grey darken-1">
        <div className="card-content white-text">
          <span className="card-title">{product.name}</span>
          <p>{product.description}</p>
        </div>
        <div className="card-action">
          <Link to={`/shop/${product.category.category_path_name}/${product.path_name}`} className="">Go to this product</Link>
        </div>
      </div>
  </div>
  )
}

export default ProductCard