import { useState, useEffect } from 'react';
import { manifestAPI, connectWebSocket } from './services/api';
import UploadModal from './components/UploadModal';
import ManifestCard from './components/ManifestCard';
import Stats from './components/Stats';
import Auth from './components/Auth';

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [manifests, setManifests] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [theme, setTheme] = useState('dark');

  // Check for existing auth on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const loadManifests = async () => {
    setLoading(true);
    try {
      const response = await manifestAPI.getAll(searchTerm);
      if (response.success) {
        setManifests(response.data);
      }
    } catch (error) {
      console.error('Error loading manifests:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    setStatsLoading(true);
    try {
      const response = await manifestAPI.getStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    loadManifests();
    loadStats();

    // Connect to WebSocket for real-time updates
    const ws = connectWebSocket((data) => {
      if (data.type === 'manifest_update') {
        loadManifests();
        loadStats();
      }
    });

    return () => ws.close();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      loadManifests();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleLogin = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
  };

  const handleUpload = async (formData) => {
    const response = await manifestAPI.upload(formData, token);
    if (response.success) {
      loadManifests();
      loadStats();
    } else {
      throw new Error(response.error);
    }
  };

  const handleDelete = async (id) => {
    const response = await manifestAPI.delete(id, token);
    if (response.success) {
      loadManifests();
      loadStats();
    }
  };

  const themes = ['dark', 'light', 'synthwave', 'cyberpunk', 'mew', 'halloween', '90s'];

  // Show auth screen if not logged in
  if (!user || !token) {
    return <Auth onLogin={handleLogin} />;
  }

  const isAdmin = user.role === 'admin';

  return (
    <div className="min-h-screen bg-base-100 flex flex-col">
      {/* Navbar */}
      <div className="navbar bg-base-300 shadow-lg">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl">🐱 Manifest Mew :3</a>
        </div>
        <div className="flex-none gap-2">
          <div className="badge badge-lg">
            {user.username} {isAdmin && '👑'}
          </div>
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle">
              🎨
            </label>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-200 rounded-box w-52">
              {themes.map((t) => (
                <li key={t}>
                  <a onClick={() => setTheme(t)} className={theme === t ? 'active' : ''}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          {isAdmin && (
            <button 
              className="btn btn-primary"
              onClick={() => setIsUploadModalOpen(true)}
            >
              📤 Upload Manifest
            </button>
          )}
          <button className="btn btn-ghost" onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto p-4 space-y-6 flex-grow">
        {/* Stats */}
        <Stats stats={stats} loading={statsLoading} />

        {/* Search */}
        <div className="form-control w-full">
          <div className="input-group w-full">
            <input
              type="text"
              placeholder="Search by game name or App ID..."
              className="input input-bordered w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="btn btn-square">
              🔍
            </button>
          </div>
        </div>

        {/* Manifests Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : manifests.length === 0 ? (
          <div className="alert alert-info">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>No manifests found. Upload one to get started!</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {manifests.map((manifest) => (
              <ManifestCard
                key={manifest.id}
                manifest={manifest}
                onDelete={handleDelete}
                canDelete={isAdmin}
              />
            ))}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleUpload}
      />

      {/* Footer */}
      <footer className="footer footer-center p-4 bg-base-300 text-base-content mt-auto">
        <div>
          <p>🐱 Manifest Mew :3 - Store and manage your Steam game manifests</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
