import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getPacs, createPac, updatePac, deletePac } from '../services/pacService';
import Layout from '../components/Layout';
import PacForm from '../components/PacForm';

const PacPage = () => {
  const { token } = useAuth();
  const [pacs, setPacs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPac, setCurrentPac] = useState(null);
  const [recentlyUpdated, setRecentlyUpdated] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const fetchPacs = async () => {
    try {
      setIsLoading(true);
      const data = await getPacs(token);
      setPacs(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPacs();
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
    setCurrentPac(null);
    setIsEditing(false);
    setShowForm(true);
  };

  const handleEdit = (pac) => {
    setCurrentPac(pac);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = async (pac) => {
    if (window.confirm(`¿Estás seguro de eliminar el PAC "${pac.codigo}"?`)) {
      try {
        await deletePac(pac.codigo, token);
        fetchPacs();
        setSuccessMessage('PAC eliminado exitosamente');
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleFormSuccess = async (formData, isEdit) => {
    try {
        if (isEdit) {
            await updatePac(currentPac.codigo, { codigo: formData.codigo, finalizar: formData.finalizar }, token);
        } else {
            await createPac({ codigo: formData.codigo, finalizar: formData.finalizar }, token);
        }
        fetchPacs();
        const message = isEdit ? 'PAC actualizado exitosamente' : 'PAC creado exitosamente';
        setSuccessMessage(message);
        setShowForm(false);
        setCurrentPac(null);
        setError('');
    } catch (err) {
        setError(err.message);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setCurrentPac(null);
  };

  if (isLoading) {
    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="text-lg text-gray-600">Cargando PACs...</div>
        </div>
    );
  }

  return (
    <>
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Gestión de PACs</h1>
            <button
                onClick={handleCreate}
                className="bg-pink-500 hover:bg-pink-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
                + Nuevo PAC
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
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {pacs.length === 0 ? (
                        <tr>
                            <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
                                No hay PACs registrados
                            </td>
                        </tr>
                    ) : (
                        pacs.map((pac) => (
                            <tr 
                                key={pac._id} 
                                className={`hover:bg-gray-50 transition-colors ${
                                    recentlyUpdated === pac._id 
                                        ? 'bg-green-50 border-l-4 border-green-400' 
                                        : ''
                                }`}
                            >
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{pac.codigo}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                        pac.finalizar 
                                            ? 'bg-red-100 text-red-800' 
                                            : 'bg-green-100 text-green-800'
                                    }`}>
                                        {pac.finalizar ? 'Finalizado' : 'Activo'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        onClick={() => handleEdit(pac)}
                                        className="text-blue-600 hover:text-blue-900 mr-3"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => handleDelete(pac)}
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
            <PacForm
                item={currentPac}
                onSuccess={handleFormSuccess}
                onCancel={handleFormCancel}
            />
        )}
    </>
  );
};

export default PacPage;