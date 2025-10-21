import React from 'react';

function Cart({ cartItems, onClose, setCart, removeFromCart, updateQuantity }) {
  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div id="cart-modal" className="modal" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <span className="close-button" onClick={onClose}>×</span>
        <h2>Carrito de Compras</h2>
        
        <div id="cart-items">
          {cartItems.length === 0 ? (
            <p>El carrito está vacío.</p>
          ) : (
            cartItems.map(item => (
              <div key={item.id} className="cart-item-row">
                <p>{item.title}</p>
                <div className="quantity-controls">
                  <button onClick={() => updateQuantity(item.id, -1)}>-</button> 
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                </div>
                <p className="item-price">${(item.price * item.quantity).toFixed(2)}</p>
                <button 
                    className="btn-remove" 
                    onClick={() => removeFromCart(item.id)}
                >
                    ❌
                </button>
              </div>
            ))
          )}
        </div>
        
        <p>Total: $<span id="cart-total">{total.toFixed(2)}</span></p>
        <div className="cart-buttons">
          <button id="clear-cart" className="btn-secondary" onClick={() => setCart([])}>
            Vaciar Carrito
          </button>
          <button id="checkout-cart" className="btn-primary">
            Finalizar Compra
          </button>
        </div>
      </div>
    </div>
  );
}
export default Cart;