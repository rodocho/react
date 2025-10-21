import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ element: Element, isLoggedIn }) {
  if (isLoggedIn) {
    return <Element />;
  } 
  
  return <Navigate to="/" replace />; 
}

export default ProtectedRoute;