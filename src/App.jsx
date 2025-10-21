import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import './styles.css'; 

// Importa todos los componentes (deben estar en src/components/)
import Header from './components/Header';
import Home from './components/Home';
import ProductDetail from './components/ProductDetail';
import Cart from './components/Cart';
import ProtectedRoute from './components/ProtectedRoute';
import UserDashboard from './components/UserDashboard';
import Contact from './components/Contact';
import Reviews from './components/Reviews';

function App() {
  // Requisito 2: Estado para productos, carga y error de la API
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Requisito 1: Estado para el carrito
  const [cart, setCart] = useState([]); 
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Requisito 4: Simulación de autenticación
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Requisito 2: useEffect para llamar a la API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://fakestoreapi.com/products'); 
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError("Error al cargar productos: " + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Lógica de Carrito
  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1, ...product }];
      }
    });
  };

  const removeFromCart = (id) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  const updateQuantity = (id, change) => {
    setCart(prevCart => prevCart
      .map(item => {
        if (item.id === id) {
          const newQuantity = item.quantity + change;
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
        }
        return item;
      })
      .filter(item => item !== null)
    );
  };
  
  // Lógica de autenticación
  const handleLogin = () => setIsLoggedIn(true);
  const handleLogout = () => setIsLoggedIn(false);
  const totalItemsInCart = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <>
      <Header 
        totalItems={totalItemsInCart} 
        onOpenCart={() => setIsCartOpen(true)} 
        isLoggedIn={isLoggedIn}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />

      <main>
        <Routes>
          <Route 
            path="/" 
            element={<Home 
                      products={products} 
                      loading={loading} 
                      error={error} 
                      onAddToCart={addToCart} 
                    />} 
          />
          
          <Route 
            path="/productos/:id" 
            element={<ProductDetail onAddToCart={addToCart} />} 
          />
          
          <Route path="/reseñas" element={<Reviews />} />
          <Route path="/contacto" element={<Contact />} />

          <Route 
            path="/dashboard" 
            element={<ProtectedRoute element={UserDashboard} isLoggedIn={isLoggedIn} />} 
          />

          <Route path="*" element={<h2>404 - Página no encontrada</h2>} />
        </Routes>
      </main>

      <footer>
         <p>© 2025 Maked3co. Todos los derechos reservados.</p>
      </footer>
      
      {isCartOpen && (
        <Cart 
          cartItems={cart} 
          onClose={() => setIsCartOpen(false)} 
          setCart={setCart}
          removeFromCart={removeFromCart} 
          updateQuantity={updateQuantity} 
        />
      )}
    </>
  );
}

export default App;