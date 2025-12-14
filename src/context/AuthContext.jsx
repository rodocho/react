import React, { createContext, useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';

// 1. Crear el contexto
export const AuthContext = createContext();

// 2. Hook personalizado para usar el contexto fácilmente
export const useAuth = () => useContext(AuthContext);

// 3. Provider
export const AuthProvider = ({ children }) => {
    // Requisito 1: Usar localStorage para persistir el login
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        return localStorage.getItem('isLoggedIn') === 'true';
    });

    // Sincronizar estado con localStorage
    useEffect(() => {
        localStorage.setItem('isLoggedIn', isLoggedIn);
    }, [isLoggedIn]);

    // Requisito 1: Login simulado
    const login = (username, password) => {
        // Validación simulada
        if (username === 'admin' && password === '1234') {
            setIsLoggedIn(true);
            toast.success("¡Inicio de sesión exitoso!");
            return true;
        } else {
            toast.error("Credenciales incorrectas.");
            return false;
        }
    };

    const logout = () => {
        setIsLoggedIn(false);
        toast.info("Sesión cerrada.");
    };

    const value = {
        isLoggedIn,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};