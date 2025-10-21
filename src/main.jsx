import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // <--- ¡Esta línea es CLAVE!
import App from './App.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* El error se soluciona si App está DENTRO de BrowserRouter */}
    <BrowserRouter> 
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);