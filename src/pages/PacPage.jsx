import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getPacs, createPac, updatePac, deletePac } from '../services/pacService';

const PacPage = () => {
  const { token } = useAuth();
  const [pacs, setPacs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPac, setCurrentPac] = useState({ id: null, codigo: '', finalizar: false });

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

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentPac({ ...currentPac, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await updatePac(currentPac.id, { codigo: currentPac.codigo, finalizar: currentPac.finalizar }, token);
      } else {
        await createPac({ codigo: currentPac.codigo, finalizar: currentPac.finalizar }, token);
      }
      fetchPacs();
      resetForm();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (pac) => {
    setIsEditing(true);
    setCurrentPac({ id: pac._id, codigo: pac.codigo, finalizar: pac.finalizar });
    setIsFormVisible(true);
  };

  const handleDelete = async (pacId) => {
    if (window.confirm('Are you sure you want to delete this PAC?')) {
      try {
        await deletePac(pacId, token);
        fetchPacs();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const resetForm = () => {
    setIsEditing(false);
    setCurrentPac({ id: null, codigo: '', finalizar: false });
    setIsFormVisible(false);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">PAC Management</h1>
        <button onClick={() => { setIsFormVisible(true); setIsEditing(false); }} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Create PAC
        </button>
      </div>

      {isFormVisible && (
        <div className="mb-4 p-4 bg-gray-100 rounded shadow-md">
          <h2 className="text-xl font-semibold mb-2">{isEditing ? 'Edit PAC' : 'Create PAC'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-2">
              <label htmlFor="codigo" className="block text-sm font-medium text-gray-700">Code</label>
              <input type="text" name="codigo" id="codigo" value={currentPac.codigo} onChange={handleInputChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div className="mb-4 flex items-center">
              <input type="checkbox" name="finalizar" id="finalizar" checked={currentPac.finalizar} onChange={handleInputChange} className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
              <label htmlFor="finalizar" className="ml-2 block text-sm text-gray-900">Finalized</label>
            </div>
            <div className="flex justify-end space-x-2">
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {pacs.map((pac) => (
              <tr key={pac._id}>
                <td className="px-6 py-4 whitespace-nowrap">{pac.codigo}</td>
                <td className="px-6 py-4 whitespace-nowrap">{pac.finalizar ? 'Finalized' : 'Active'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <button onClick={() => handleEdit(pac)} className="text-indigo-600 hover:text-indigo-900">Edit</button>
                  <button onClick={() => handleDelete(pac._id)} className="text-red-600 hover:text-red-900">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PacPage;