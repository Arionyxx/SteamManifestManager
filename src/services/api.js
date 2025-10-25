const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

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
};

export const connectWebSocket = (onMessage) => {
  const wsUrl = import.meta.env.VITE_API_BASE_URL 
    ? import.meta.env.VITE_API_BASE_URL.replace('http', 'ws')
    : `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.hostname}:3001`;
  const ws = new WebSocket(wsUrl);
  
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
