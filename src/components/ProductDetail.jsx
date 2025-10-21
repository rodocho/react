import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function ProductDetail({ onAddToCart }) {
  const { id } = useParams(); 
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(`https://fakestoreapi.com/products/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Producto no encontrado');
        return res.json();
      })
      .then(data => setProduct(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="loading-message">Cargando...</p>;
  if (error) return <p className="error-message">Error: {error}</p>;
  if (!product) return <p>Producto no disponible.</p>;
  
  return (
    <section className="product-detail-section">
      <div className="product-detail-container">
        <img src={product.image} alt={product.title} className="detail-image" />
        <div className="product-info">
          <h1>{product.title}</h1>
          <p className="detail-description">{product.description}</p>
          <p className="detail-price">${product.price.toFixed(2)}</p>
          
          <button 
            className="btn-primary btn-large"
            onClick={() => onAddToCart(product)} 
          >
            Añadir al Carrito
          </button>
        </div>
      </div>
    </section>
  );
}
export default ProductDetail;