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

  console.log('Making request to:', url);
  console.log('With headers:', mergedOptions.headers);
  
  const response = await fetch(url, mergedOptions);
  console.log('Response status:', response.status);
  console.log('Response headers:', response.headers);

  if (response.status === 401) {
    // Token might be invalid or expired
    throw new Error('Authentication failed');
  }

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Error response:', errorText);
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  try {
    const text = await response.text();
    console.log('Raw response:', text);
    if (!text) {
      throw new Error('Empty response from server');
    }
    return JSON.parse(text);
  } catch (error) {
    console.error('Error parsing response:', error);
    throw new Error('Invalid JSON response from server');
  }
} 