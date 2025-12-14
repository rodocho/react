import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { GlobalStyles } from './styles/GlobalStyles';
import 'react-toastify/dist/ReactToastify.css';
import './index.css'; // Importa el CSS de Bootstrap

const Root = () => (
    <React.StrictMode>
        {/* Requisito 3: Estilos Globales */}
        <GlobalStyles /> 
        
        {/* Requisito 1: Proveedores de Estado Global */}
        <AuthProvider>
            <CartProvider>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </CartProvider>
        </AuthProvider>
        
        {/* Requisito 3: Toastify para notificaciones */}
        <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </React.StrictMode>
);

ReactDOM.createRoot(document.getElementById('root')).render(<Root />);