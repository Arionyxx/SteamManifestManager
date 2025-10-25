const API_BASE = '/api';

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

  upload: async (formData) => {
    const response = await fetch(`${API_BASE}/manifests/upload`, {
      method: 'POST',
      body: formData,
    });
    return response.json();
  },

  delete: async (id) => {
    const response = await fetch(`${API_BASE}/manifests/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  },

  getStats: async () => {
    const response = await fetch(`${API_BASE}/manifests/stats`);
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
