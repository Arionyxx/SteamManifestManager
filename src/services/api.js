import { API_BASE } from '../config/api.js';

export const manifestAPI = {
  getAll: async (search = '', limit = 50, offset = 0) => {
    const params = new URLSearchParams({ search, limit, offset });
    const response = await fetch(`${API_BASE}/manifests?${params}`);
    return response.json();
  },

  getById: async (id) => {
    const response = await fetch(`${API_BASE}/manifests/${id}`);
    return response.json();
  },

  upload: async (formData, token) => {
    const response = await fetch(`${API_BASE}/manifests/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData,
    });
    
    if (!response.ok) {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      } else {
        const text = await response.text();
        console.error('Server returned HTML instead of JSON:', text);
        throw new Error(`Server error: ${response.status} - ${response.statusText}`);
      }
    }
    
    return response.json();
  },

  delete: async (id, token) => {
    const response = await fetch(`${API_BASE}/manifests/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.json();
  },

  getStats: async () => {
    const response = await fetch(`${API_BASE}/manifests/stats`);
    return response.json();
  },

  update: async (id, data, token) => {
    const response = await fetch(`${API_BASE}/manifests/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    return response.json();
  },
};

export const connectWebSocket = (onMessage) => {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const ws = new WebSocket(`${protocol}//${window.location.hostname}:3001`);
  
  ws.onopen = () => {
    console.log('✅ WebSocket connected');
  };
  
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    onMessage(data);
  };
  
  ws.onerror = (error) => {
    console.error('❌ WebSocket error:', error);
  };
  
  ws.onclose = () => {
    console.log('🔌 WebSocket disconnected');
  };
  
  return ws;
};
