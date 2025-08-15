import { useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import { useEffect } from "react"

const Layout = ({ children }) => {
    const navigate = useNavigate()
    const { user, logout, token } = useAuth()

    const handleLogout = () => {
        logout();
        navigate("/login");
    }

    return (
        <div className="min-h-screen bg-green-50">
            <div className="bg-white shadow-lg">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="flex justify-between items-center py-4 border-b border-gray-200">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Sistema de Matrícula 🎓</h1>
                            {user && <p className="text-gray-600">Hola {user.email}</p>}
                        </div>
                        {token &&
                            <button 
                                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
                                onClick={handleLogout}
                            >
                                Cerrar Sesión
                            </button>
                        }
                    </div>

                    {token &&
                        <nav className="py-4">
                            <ul className="flex space-x-8">
                                <li>
                                    <button 
                                        className="flex items-center px-4 py-2 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors font-medium"
                                        onClick={() => navigate('/')}
                                    >
                                        <span className="mr-2">🏠</span>
                                        Inicio
                                    </button>
                                </li>
                                <li>
                                    <button 
                                        className="flex items-center px-4 py-2 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors font-medium"
                                        onClick={() => navigate('/pac')}
                                    >
                                        <span className="mr-2">🏷️</span>
                                        PAC
                                    </button>
                                </li>
                                <li>
                                    <button 
                                        className="flex items-center px-4 py-2 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors font-medium"
                                        onClick={() => navigate('/asignaturas')}
                                    >
                                        <span className="mr-2">📋</span>
                                        Asignaturas
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    }
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-8">
                {children}
            </div>
        </div>
    )
}

export default Layout