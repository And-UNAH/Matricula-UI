import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getAsignaturas, createAsignatura, updateAsignatura, deleteAsignatura } from '../services/asignaturaService';
import { getPacs } from '../services/pacService';

const AsignaturasPage = () => {
  const { token } = useAuth();
  const [asignaturas, setAsignaturas] = useState([]);
  const [pacs, setPacs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentAsignatura, setCurrentAsignatura] = useState({ id: null, nombre: '', seccion: '', cupos: 0, pacId: '' });

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentAsignatura({ ...currentAsignatura, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const asignaturaData = {
        nombre: currentAsignatura.nombre,
        seccion: currentAsignatura.seccion,
        cupos: parseInt(currentAsignatura.cupos, 10),
        pacId: currentAsignatura.pacId
    };

    try {
      if (isEditing) {
        await updateAsignatura(currentAsignatura.id, asignaturaData, token);
      } else {
        await createAsignatura(asignaturaData, token);
      }
      fetchAsignaturasAndPacs();
      resetForm();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (asignatura) => {
    setIsEditing(true);
    setCurrentAsignatura({ id: asignatura._id, nombre: asignatura.nombre, seccion: asignatura.seccion, cupos: asignatura.cupos, pacId: asignatura.pacId });
    setIsFormVisible(true);
  };

  const handleDelete = async (asignaturaId) => {
    if (window.confirm('Are you sure you want to delete this asignatura?')) {
      try {
        await deleteAsignatura(asignaturaId, token);
        fetchAsignaturasAndPacs();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const resetForm = () => {
    setIsEditing(false);
    setCurrentAsignatura({ id: null, nombre: '', seccion: '', cupos: 0, pacId: '' });
    setIsFormVisible(false);
  };

  const getPacCodeById = (pacId) => {
    const pac = pacs.find(p => p._id === pacId);
    return pac ? pac.codigo : 'N/A';
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Asignaturas Management</h1>
        <button onClick={() => { setIsFormVisible(true); setIsEditing(false); }} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Create Asignatura
        </button>
      </div>

      {isFormVisible && (
        <div className="mb-4 p-4 bg-gray-100 rounded shadow-md">
          <h2 className="text-xl font-semibold mb-2">{isEditing ? 'Edit Asignatura' : 'Create Asignatura'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Name</label>
                    <input type="text" name="nombre" id="nombre" value={currentAsignatura.nombre} onChange={handleInputChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
                <div>
                    <label htmlFor="seccion" className="block text-sm font-medium text-gray-700">Section</label>
                    <input type="text" name="seccion" id="seccion" value={currentAsignatura.seccion} onChange={handleInputChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
                <div>
                    <label htmlFor="cupos" className="block text-sm font-medium text-gray-700">Cupos</label>
                    <input type="number" name="cupos" id="cupos" value={currentAsignatura.cupos} onChange={handleInputChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
                <div>
                    <label htmlFor="pacId" className="block text-sm font-medium text-gray-700">PAC</label>
                    <select name="pacId" id="pacId" value={currentAsignatura.pacId} onChange={handleInputChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                        <option value="">Select a PAC</option>
                        {pacs.map(pac => (
                            <option key={pac._id} value={pac._id}>{pac.codigo}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <button type="button" onClick={resetForm} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Cancel</button>
              <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">{isEditing ? 'Update' : 'Save'}</button>
            </div>
          </form>
        </div>
      )}

      {isLoading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Section</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cupos</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PAC</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {asignaturas.map((asignatura) => (
              <tr key={asignatura._id}>
                <td className="px-6 py-4 whitespace-nowrap">{asignatura.nombre}</td>
                <td className="px-6 py-4 whitespace-nowrap">{asignatura.seccion}</td>
                <td className="px-6 py-4 whitespace-nowrap">{asignatura.cupos}</td>
                <td className="px-6 py-4 whitespace-nowrap">{getPacCodeById(asignatura.pacId)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <button onClick={() => handleEdit(asignatura)} className="text-indigo-600 hover:text-indigo-900">Edit</button>
                  <button onClick={() => handleDelete(asignatura._id)} className="text-red-600 hover:text-red-900">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AsignaturasPage;