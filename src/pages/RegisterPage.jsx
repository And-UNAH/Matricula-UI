import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/authService';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    identidad: '',
    email: ''
  });
  const [error, setError] = useState(null);
  const [newCredentials, setNewCredentials] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const data = await registerUser(formData);
      setNewCredentials(data);
    } catch (err) {
      setError(err.message);
    }
  };

  if (newCredentials) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-6 text-center bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-green-600">Registration Successful!</h1>
          <p className="text-gray-700">Please save your new institutional credentials. You will use them to log in.</p>
          <div className="p-4 space-y-2 text-left bg-gray-50 rounded-md">
            <p><span className="font-semibold">Institutional Email:</span> {newCredentials.email_institucional}</p>
            <p><span className="font-semibold">Generated Password:</span> {newCredentials.password}</p>
          </div>
          <button
            onClick={() => navigate('/login')}
            className="w-full px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-900">Register</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="nombre" className="text-sm font-medium text-gray-700">First Name</label>
            <input id="nombre" type="text" value={formData.nombre} onChange={handleChange} required className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          <div>
            <label htmlFor="apellido" className="text-sm font-medium text-gray-700">Last Name</label>
            <input id="apellido" type="text" value={formData.apellido} onChange={handleChange} required className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          <div>
            <label htmlFor="identidad" className="text-sm font-medium text-gray-700">Identity Number</label>
            <input id="identidad" type="text" value={formData.identidad} onChange={handleChange} required className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          <div>
            <label htmlFor="email" className="text-sm font-medium text-gray-700">Personal Email</label>
            <input id="email" type="email" value={formData.email} onChange={handleChange} required className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div>
            <button type="submit" className="w-full px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;