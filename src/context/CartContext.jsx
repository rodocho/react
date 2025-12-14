import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';

// 1. Crear el contexto
export const CartContext = createContext();

// 2. Hook personalizado
export const useCart = () => useContext(CartContext);

// Función auxiliar para obtener el total de ítems
const getTotalItems = (cart) => cart.reduce((acc, item) => acc + item.quantity, 0);

// 3. Provider
export const CartProvider = ({ children }) => {
    // Persistencia básica del carrito en localStorage
    const [cart, setCart] = useState(() => {
        const localCart = localStorage.getItem('shoppingCart');
        return localCart ? JSON.parse(localCart) : [];
    });

    useEffect(() => {
        localStorage.setItem('shoppingCart', JSON.stringify(cart));
    }, [cart]);

    const totalItems = getTotalItems(cart);
    const totalAmount = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const addToCart = (product, quantity = 1) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === product.id);
            if (existingItem) {
                const newCart = prevCart.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
                );
                toast.success(`${quantity}x ${product.title} agregado al carrito.`);
                return newCart;
            } else {
                toast.success(`${product.title} añadido al carrito.`);
                return [...prevCart, { ...product, quantity, ...product }];
            }
        });
    };

    const removeFromCart = (id) => {
        setCart(prevCart => prevCart.filter(item => item.id !== id));
        toast.warn("Producto eliminado del carrito.");
    };

    const updateQuantity = (id, newQuantity) => {
        setCart(prevCart => prevCart
            .map(item => {
                if (item.id === id) {
                    return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
                }
                return item;
            })
            .filter(item => item !== null)
        );
    };

    const clearCart = () => {
        setCart([]);
        toast.info("Carrito vaciado.");
    };

    const value = {
        cart,
        totalItems,
        totalAmount,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};