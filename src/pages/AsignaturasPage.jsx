import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getAsignaturas, createAsignatura, updateAsignatura, deleteAsignatura } from '../services/asignaturaService';
import { getPacs } from '../services/pacService';
import AsignaturaForm from '../components/AsignaturaForm';

const AsignaturasPage = () => {
  const { token } = useAuth();
  const [asignaturas, setAsignaturas] = useState([]);
  const [pacs, setPacs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentAsignatura, setCurrentAsignatura] = useState(null);
  const [recentlyUpdated, setRecentlyUpdated] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const fetchAsignaturasAndPacs = async () => {
    try {
      setIsLoading(true);
      const [asignaturasData, pacsData] = await Promise.all([
        getAsignaturas(token),
        getPacs(token)
      ]);
      setAsignaturas(asignaturasData);
      setPacs(pacsData);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAsignaturasAndPacs();
  }, [token]);

  useEffect(() => {
    if (recentlyUpdated) {
        const timer = setTimeout(() => {
            setRecentlyUpdated(null);
        }, 2000);
        return () => clearTimeout(timer);
    }
  }, [recentlyUpdated]);

  useEffect(() => {
    if (successMessage) {
        const timer = setTimeout(() => {
            setSuccessMessage('');
        }, 3000);
        return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleCreate = () => {
    setCurrentAsignatura(null);
    setIsEditing(false);
    setShowForm(true);
  };

  const handleEdit = (asignatura) => {
    setCurrentAsignatura(asignatura);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = async (asignatura) => {
    if (window.confirm(`¿Estás seguro de eliminar la asignatura "${asignatura.nombre}"?`)) {
      try {
        await deleteAsignatura(asignatura._id, token);
        fetchAsignaturasAndPacs();
        setSuccessMessage('Asignatura eliminada exitosamente');
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleFormSuccess = async (formData, isEdit) => {
    try {
        const asignaturaData = {
            nombre: formData.nombre,
            seccion: formData.seccion,
            cupos: parseInt(formData.cupos, 10),
            pacId: formData.pacId
        };

        if (isEdit) {
            await updateAsignatura(currentAsignatura._id, asignaturaData, token);
        } else {
            await createAsignatura(asignaturaData, token);
        }
        fetchAsignaturasAndPacs();
        const message = isEdit ? 'Asignatura actualizada exitosamente' : 'Asignatura creada exitosamente';
        setSuccessMessage(message);
        setShowForm(false);
        setCurrentAsignatura(null);
        setError('');
    } catch (err) {
        setError(err.message);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setCurrentAsignatura(null);
  };

  const getPacCodeById = (pacId) => {
    const pac = pacs.find(p => p._id === pacId);
    return pac ? pac.codigo : 'N/A';
  }

  if (isLoading) {
    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="text-lg text-gray-600">Cargando asignaturas...</div>
        </div>
    );
  }

  return (
    <>
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Gestión de Asignaturas</h1>
            <button
                onClick={handleCreate}
                className="bg-pink-500 hover:bg-pink-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
                + Nueva Asignatura
            </button>
        </div>

        {successMessage && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md">
                <div className="flex items-center">
                    <span className="mr-2">✅</span>
                    <span>{successMessage}</span>
                </div>
            </div>
        )}

        {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
                <div className="flex items-center">
                    <span className="mr-2">❌</span>
                    <span>{error}</span>
                </div>
            </div>
        )}

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sección</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cupos</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PAC</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {asignaturas.length === 0 ? (
                        <tr>
                            <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                                No hay asignaturas registradas
                            </td>
                        </tr>
                    ) : (
                        asignaturas.map((asignatura) => (
                            <tr 
                                key={asignatura._id} 
                                className={`hover:bg-gray-50 transition-colors ${
                                    recentlyUpdated === asignatura._id 
                                        ? 'bg-green-50 border-l-4 border-green-400' 
                                        : ''
                                }`}
                            >
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{asignatura.nombre}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{asignatura.seccion}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{asignatura.cupos}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <span className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                        {getPacCodeById(asignatura.pacId)}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        onClick={() => handleEdit(asignatura)}
                                        className="text-blue-600 hover:text-blue-900 mr-3"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => handleDelete(asignatura)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>

        {showForm && (
            <AsignaturaForm
                item={currentAsignatura}
                pacs={pacs}
                onSuccess={handleFormSuccess}
                onCancel={handleFormCancel}
            />
        )}
    </>
  );
};

export default AsignaturasPage;