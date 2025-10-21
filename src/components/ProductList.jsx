import React from 'react';
import ProductCard from './ProductCard';

function ProductList({ products, onAddToCart }) {
  return (
    <section id="productos" className="section-products">
      <h2>Nuestros Productos</h2>
      <div id="product-container" className="product-list">
        {products.map(product => (
          <ProductCard 
            key={product.id} 
            product={product} 
            onAddToCart={onAddToCart} 
          />
        ))}
      </div>
    </section>
  );
}
export default ProductList;