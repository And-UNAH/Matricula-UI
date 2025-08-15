
const API_URL = import.meta.env.VITE_API_URL;

const getHeaders = (token) => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`,
});

export const getPacs = async (token) => {
  const response = await fetch(`${API_URL}/pac/`, {
    headers: getHeaders(token),
  });
  if (!response.ok) throw new Error('Failed to fetch PACs');
  return response.json();
};

export const createPac = async (pacData, token) => {
  const response = await fetch(`${API_URL}/pac/`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify(pacData),
  });
  if (!response.ok) throw new Error('Failed to create PAC');
  return response.json();
};

export const updatePac = async (pacId, pacData, token) => {
  const response = await fetch(`${API_URL}/pac/${pacId}`,
  {
    method: 'PUT',
    headers: getHeaders(token),
    body: JSON.stringify(pacData),
  });
  if (!response.ok) throw new Error('Failed to update PAC');
  return response.json();
};

export const deletePac = async (pacId, token) => {
  const response = await fetch(`${API_URL}/pac/${pacId}`,
  {
    method: 'DELETE',
    headers: getHeaders(token),
  });
  if (!response.ok) throw new Error('Failed to delete PAC');
  return response.json();
};
