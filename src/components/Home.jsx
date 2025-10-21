import React from 'react';
import ProductList from './ProductList'; 

function Home({ products, loading, error, onAddToCart }) {
  if (loading) return <p className="loading-message">Cargando productos...</p>; 
  if (error) return <p className="error-message">{error}</p>; 

  return (
    <section>
        <ProductList products={products} onAddToCart={onAddToCart} />
    </section>
  );
}
export default Home;