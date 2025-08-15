
const API_URL = import.meta.env.VITE_API_URL;

const getHeaders = (token) => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`,
});

export const getAsignaturas = async (token) => {
  const response = await fetch(`${API_URL}/asignaturas/`, {
    headers: getHeaders(token),
  });
  if (!response.ok) throw new Error('Failed to fetch asignaturas');
  return response.json();
};

export const createAsignatura = async (asignaturaData, token) => {
  const response = await fetch(`${API_URL}/asignaturas/`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify(asignaturaData),
  });
  if (!response.ok) throw new Error('Failed to create asignatura');
  return response.json();
};

export const updateAsignatura = async (asignaturaId, asignaturaData, token) => {
  const response = await fetch(`${API_URL}/asignaturas/${asignaturaId}`,
  {
    method: 'PUT',
    headers: getHeaders(token),
    body: JSON.stringify(asignaturaData),
  });
  if (!response.ok) throw new Error('Failed to update asignatura');
  return response.json();
};

export const deleteAsignatura = async (asignaturaId, token) => {
  const response = await fetch(`${API_URL}/asignaturas/${asignaturaId}`,
  {
    method: 'DELETE',
    headers: getHeaders(token),
  });
  if (!response.ok) throw new Error('Failed to delete asignatura');
  return response.json();
};
