export const API_ROOT = process.env.NEXT_PUBLIC_API_URL;

let authToken = '';

export function setAuthToken(token: string) {
  authToken = token;
  localStorage.setItem('token', token);
}

export function getAuthToken() {
  if (typeof window !== 'undefined') {
    return authToken || localStorage.getItem('token') || '';
  }
  return authToken || '';
}

interface ApiFetchOptions extends RequestInit {
  responseType?: 'json' | 'blob' | 'text';
}

export async function apiFetch(path: string, options?: ApiFetchOptions) {
  const responseType = options?.responseType || 'json';

  // Check if body is FormData to avoid setting Content-Type
  const isFormData = options?.body instanceof FormData;

  const headers: Record<string, string> = {
    Authorization: `Bearer ${getAuthToken()}`,
    ...(options?.headers || {}),
  };

  // Only set Content-Type for non-FormData requests
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(`${API_ROOT}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    let errorMessage = 'An error occurred';
    let errors = null;
    try {
      const errorData = await res.json();
      errorMessage = errorData.message || errorMessage;
      errors = errorData.errors || null;
      console.error('API Error Response:', errorData);
    } catch (e) {
      try {
        errorMessage = await res.text();
      } catch (_) {}
    }
    const error = new Error(errorMessage) as any;
    error.status = res.status;
    error.errors = errors;
    throw error;
  }

  if (responseType === 'blob') return res.blob();
  if (responseType === 'text') return res.text();
  return res.json();
}