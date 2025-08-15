import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="text-white text-lg font-bold">StudentSys</Link>
        <div>
          {token ? (
            <>
              <Link to="/pac" className="text-gray-300 hover:text-white mr-4">PAC</Link>
              <Link to="/asignaturas" className="text-gray-300 hover:text-white mr-4">Asignaturas</Link>
              <button onClick={handleLogout} className="text-gray-300 hover:text-white">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-300 hover:text-white mr-4">Login</Link>
              <Link to="/register" className="text-gray-300 hover:text-white">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;