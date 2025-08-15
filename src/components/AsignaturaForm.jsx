import { useState } from 'react';

const AsignaturaForm = ({ item, pacs, onSuccess, onCancel }) => {
    const [formData, setFormData] = useState({
        nombre: item?.nombre || '',
        seccion: item?.seccion || '',
        cupos: item?.cupos || 0,
        pacId: item?.pacId || ''
    });
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (error) setError('');
    };

    const handleSubmit = async () => {
        if (isSubmitting) return;

        if (!formData.nombre.trim()) {
            setError('El nombre es requerido');
            return;
        }

        if (!formData.seccion.trim()) {
            setError('La sección es requerida');
            return;
        }

        if (!formData.cupos || parseInt(formData.cupos) <= 0) {
            setError('Los cupos deben ser mayor a 0');
            return;
        }

        if (!formData.pacId.trim()) {
            setError('El PAC es requerido');
            return;
        }

        setIsSubmitting(true);

        try {
            setError('');
            onSuccess(formData, !!item);
        } catch (error) {
            console.error('Error al guardar:', error);
            setError(error.message || 'Error al guardar la asignatura');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !isSubmitting) {
            handleSubmit();
        }
        if (e.key === 'Escape') {
            onCancel();
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">
                        {item ? 'Editar Asignatura' : 'Nueva Asignatura'}
                    </h2>

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
                            <div className="flex items-center">
                                <span className="mr-2">❌</span>
                                <span>{error}</span>
                            </div>
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                                Nombre *
                            </label>
                            <input
                                type="text"
                                id="nombre"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                onKeyDown={handleKeyPress}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                                placeholder="Ej: Programación I"
                                maxLength="100"
                                autoFocus={!item}
                            />
                        </div>

                        <div>
                            <label htmlFor="seccion" className="block text-sm font-medium text-gray-700 mb-1">
                                Sección *
                            </label>
                            <input
                                type="text"
                                id="seccion"
                                name="seccion"
                                value={formData.seccion}
                                onChange={handleChange}
                                onKeyDown={handleKeyPress}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                                placeholder="Ej: 0900"
                                maxLength="100"
                            />
                        </div>

                        <div>
                            <label htmlFor="cupos" className="block text-sm font-medium text-gray-700 mb-1">
                                Cupos *
                            </label>
                            <input
                                type="number"
                                id="cupos"
                                name="cupos"
                                value={formData.cupos}
                                onChange={handleChange}
                                onKeyDown={handleKeyPress}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                                placeholder="0"
                                min="1"
                            />
                        </div>

                        <div>
                            <label htmlFor="pacId" className="block text-sm font-medium text-gray-700 mb-1">
                                PAC *
                            </label>
                            <select
                                id="pacId"
                                name="pacId"
                                value={formData.pacId}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                                required
                            >
                                <option value="">Seleccionar PAC...</option>
                                {pacs.map((pac) => (
                                    <option key={pac._id} value={pac._id}>
                                        {pac.codigo}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 mt-6">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                            disabled={isSubmitting}
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="px-4 py-2 text-sm font-medium text-white bg-pink-500 hover:bg-pink-600 rounded-md disabled:opacity-50 transition-colors"
                        >
                            {isSubmitting ? 'Guardando...' : 'Guardar'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AsignaturaForm;