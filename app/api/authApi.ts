export async function fetchWithAuth(url: string, token: string, options: RequestInit = {}) {
  if (!token) {
    throw new Error('No authentication token available');
  }

  // Start with the default headers
  const defaultHeaders = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  // Create a new options object with merged headers
  const mergedOptions = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...(options.headers || {}),
    },
  };

  const response = await fetch(url, mergedOptions);

  if (response.status === 401) {
    // Token might be invalid or expired
    throw new Error('Authentication failed');
  }

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
} 