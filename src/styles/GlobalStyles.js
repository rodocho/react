import styled, { createGlobalStyle } from 'styled-components';
import 'bootstrap/dist/css/bootstrap.min.css';

// 1. Estilos Globales para fuente e importación de Bootstrap
export const GlobalStyles = createGlobalStyle`
  body {
    font-family: 'Inter', sans-serif;
    background-color: #f8f9fa; /* Color de fondo ligero */
  }
`;

// 2. Contenedor principal con estilo responsivo
export const MainContainer = styled.div`
  padding: 20px;
  min-height: calc(100vh - 120px); /* Altura mínima para Footer */
`;

// 3. Estilo para Footer
export const FooterContainer = styled.footer`
  background-color: #343a40;
  color: white;
  padding: 15px 0;
  text-align: center;
`;