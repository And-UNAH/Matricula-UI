import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/authService';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    identidad: '',
    email: ''
  });
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newCredentials, setNewCredentials] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const data = await registerUser(formData);
      setNewCredentials(data);
    } catch (err) {
      setError(err.message);
    } finally {
        setIsSubmitting(false);
    }
  };

  if (newCredentials) {
    return (
        <div className="min-h-screen bg-pink-50 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl text-white">✓</span>
                </div>
                <h1 className="text-2xl font-bold text-gray-800">¡Registro Exitoso!</h1>
                <p className="text-gray-600 mt-2 mb-4">Guarda tus nuevas credenciales para iniciar sesión.</p>
                <div className="p-4 space-y-2 text-left bg-gray-50 rounded-md border border-gray-200">
                    <p><span className="font-semibold">Email Institucional:</span> {newCredentials.email_institucional}</p>
                    <p><span className="font-semibold">Contraseña:</span> {newCredentials.password}</p>
                </div>
                <button
                    onClick={() => navigate('/login')}
                    className="w-full mt-6 px-4 py-2 font-medium text-white bg-pink-500 rounded-md hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                >
                    Ir a Iniciar Sesión
                </button>
            </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-pink-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl text-white">🎓</span>
                </div>
                <h1 className="text-2xl font-bold text-gray-800">Sistema de Matrícula</h1>
                <p className="text-gray-600">Crear cuenta nueva</p>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
                    <div className="flex items-center">
                        <span className="mr-2">❌</span>
                        <span>{error}</span>
                    </div>
                </div>
            )}

            <div className="flex justify-center">
                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                            <input id="nombre" type="text" value={formData.nombre} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500" placeholder="Juan" />
                        </div>
                        <div>
                            <label htmlFor="apellido" className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
                            <input id="apellido" type="text" value={formData.apellido} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500" placeholder="Pérez" />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="identidad" className="block text-sm font-medium text-gray-700 mb-1">Número de Identidad</label>
                        <input id="identidad" type="text" value={formData.identidad} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500" placeholder="0801..." />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Personal</label>
                        <input id="email" type="email" value={formData.email} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500" placeholder="tu@email.com" />
                    </div>
                    <div>
                        <button type="submit" className="w-full px-4 py-2 font-medium text-white bg-pink-500 rounded-md hover:bg-pink-600 disabled:opacity-50" disabled={isSubmitting}>
                            {isSubmitting ? 'Registrando...' : 'Registrar'}
                        </button>
                    </div>
                </form>
            </div>
            <p className="text-center text-sm text-gray-600 mt-4">
                ¿Ya tienes cuenta?{" "}
                <Link to="/login" className="text-pink-500 hover:text-pink-600">
                    Inicia sesión
                </Link>
            </p>
        </div>
    </div>
  );
};

export default RegisterPage;