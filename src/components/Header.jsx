import React from 'react';
import { Link } from 'react-router-dom';

function Header({ totalItems, onOpenCart, isLoggedIn, onLogin, onLogout }) {
  return (
    <header>
      <h1><Link to="/">Maked3co</Link></h1>
      <nav>
        <ul>
          <li><Link to="/">Inicio</Link></li>
          <li><Link to="/reseñas">Reseñas</Link></li>
          <li><Link to="/contacto">Contacto</Link></li>
          {isLoggedIn && <li><Link to="/dashboard">Dashboard</Link></li>}
        </ul>
        <div className="auth-buttons">
            <button onClick={isLoggedIn ? onLogout : onLogin}>
                {isLoggedIn ? 'Cerrar Sesión' : 'Iniciar Sesión (Demo)'}
            </button>
        </div>
        <div className="cart-icon" onClick={onOpenCart}>
          🛒 <span id="cart-count">{totalItems}</span>
        </div>
      </nav>
    </header>
  );
}

export default Header;