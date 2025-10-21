import React from 'react';
import { Link } from 'react-router-dom';

function ProductCard({ product, onAddToCart }) {
  return (
    <div className="product-card">
      <Link to={`/productos/${product.id}`} className="product-link">
        <img src={product.image} alt={product.title} /> 
        <h3>{product.title}</h3>
        <p className="price">${product.price.toFixed(2)}</p>
      </Link>
      
      <button 
        className="btn-primary" 
        onClick={() => onAddToCart(product)}
      >
        Añadir al Carrito
      </button>
    </div>
  );
}
export default ProductCard;