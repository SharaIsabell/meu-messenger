const API_URL = import.meta.env.VITE_API_URL;

export async function api(path, { method = 'GET', body, token } = {}) {
  let response;
  try {
    response = await fetch(`${API_URL}/api${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error('Não foi possível conectar ao servidor.');
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || 'Algo deu errado.');
  return data;
}