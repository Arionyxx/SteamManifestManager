import { useState } from 'react';

const API_BASE = '/api';

export default function Auth({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    adminSecret: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isLogin ? `${API_BASE}/auth/login` : `${API_BASE}/auth/register`;
      const body = isLogin 
        ? { username: formData.username, password: formData.password }
        : formData;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.error || 'Authentication failed');
        return;
      }

      // Store token and user info
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));
      
      onLogin(data.data.user, data.data.token);
    } catch (error) {
      setError('Connection error. Please try again.');
      console.error('Auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-300">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-3xl justify-center mb-4">
            🎮 Steam Manifest Manager
          </h2>
          
          <div className="tabs tabs-boxed mb-4">
            <a 
              className={`tab ${isLogin ? 'tab-active' : ''}`}
              onClick={() => setIsLogin(true)}
            >
              Login
            </a>
            <a 
              className={`tab ${!isLogin ? 'tab-active' : ''}`}
              onClick={() => setIsLogin(false)}
            >
              Register
            </a>
          </div>

          {error && (
            <div className="alert alert-error mb-4">
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Username</span>
              </label>
              <input
                type="text"
                placeholder="Enter username"
                className="input input-bordered"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                placeholder="Enter password"
                className="input input-bordered"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>

            {!isLogin && (
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Admin Secret (optional)</span>
                </label>
                <input
                  type="password"
                  placeholder="Leave empty for regular user"
                  className="input input-bordered"
                  value={formData.adminSecret}
                  onChange={(e) => setFormData({ ...formData, adminSecret: e.target.value })}
                />
                <label className="label">
                  <span className="label-text-alt">Contact admin for secret key</span>
                </label>
              </div>
            )}

            <button 
              type="submit" 
              className="btn btn-primary w-full"
              disabled={loading}
            >
              {loading ? (
                <span className="loading loading-spinner"></span>
              ) : (
                isLogin ? 'Login' : 'Register'
              )}
            </button>
          </form>

          <div className="divider">Info</div>
          <div className="text-sm text-center opacity-70">
            {isLogin ? (
              <p>Don't have an account? Click Register above</p>
            ) : (
              <p>Admin access requires a secret key from the system administrator</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
