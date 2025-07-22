export const API_ROOT = process.env.NEXT_PUBLIC_API_URL;

let authToken = ''; // store in memory or localStorage if needed

export function setAuthToken(token: string) {
  authToken = token;
  localStorage.setItem('token', token);
}

export function getAuthToken() {
  if (typeof window !== 'undefined') {
    return authToken || localStorage.getItem('token') || '';
  }
  return authToken || ''; // fallback for server
}


export async function apiFetch(path: string, options?: RequestInit) {
  const res = await fetch(`${API_ROOT}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getAuthToken()}`,
      ...(options?.headers || {}),
    },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const message = errorData?.message || 'An error occurred';
    const error = new Error(message) as any;
    error.status = res.status;
    error.response = errorData;
    throw error;
  }
  return res.json();
}
