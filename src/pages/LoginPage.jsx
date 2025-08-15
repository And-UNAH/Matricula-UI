import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../hooks/useAuth';
import { loginUser } from '../services/authService';

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async () => {
        if (isSubmitting) {
            return;
        }

        setError("");
        setIsSubmitting(true);

        if (!email.trim()) {
            setError('El email es requerido');
            setIsSubmitting(false);
            return;
        }

        if (!email.includes('@') || !email.includes('.')) {
            setError('Por favor ingresa un email válido');
            setIsSubmitting(false);
            return;
        }

        if (!password.trim()) {
            setError('La contraseña es requerida');
            setIsSubmitting(false);
            return;
        }

        try {
            const data = await loginUser({ username: email, password });
            login({ email }, data.access_token);
            navigate("/");
        } catch (error) {
            setError(error.message || 'Error al iniciar sesión. Intenta nuevamente.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-pink-50 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl text-white">🎓</span>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800">Sistema de Matrícula</h1>
                    <p className="text-gray-600">Inicia sesión</p>
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
                    <form
                        className="space-y-4"
                        noValidate
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleLogin();
                        }}
                    >
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email Institucional
                            </label>
                            <input
                                type="email"
                                id="email"
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                                placeholder="tu@email.com"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    if (error) setError('');
                                }}
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Contraseña
                            </label>
                            <input
                                type="password"
                                id="password"
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    if (error) setError('');
                                }}
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-pink-500 text-white py-2 px-4 rounded-md hover:bg-pink-600 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Iniciando sesión..." : "Iniciar Sesión"}
                        </button>
                    </form>
                </div>

                <p className="text-center text-sm text-gray-600 mt-4">
                    ¿No tienes cuenta?{" "}
                    <Link to="/register" className="text-pink-500 hover:text-pink-600">
                        Regístrate
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;