import { useState, useEffect } from 'react';
import { manifestAPI, connectWebSocket } from './services/api';
import UploadModal from './components/UploadModal';
import ManifestCard from './components/ManifestCard';
import Stats from './components/Stats';

function App() {
  const [manifests, setManifests] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [theme, setTheme] = useState('dark');

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

  const handleUpload = async (formData) => {
    const response = await manifestAPI.upload(formData);
    if (response.success) {
      loadManifests();
      loadStats();
    } else {
      throw new Error(response.error);
    }
  };

  const handleDelete = async (id) => {
    const response = await manifestAPI.delete(id);
    if (response.success) {
      loadManifests();
      loadStats();
    }
  };

  const themes = ['dark', 'light', 'synthwave', 'cyberpunk'];

  return (
    <div className="min-h-screen bg-base-100">
      {/* Navbar */}
      <div className="navbar bg-base-300 shadow-lg">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl">🎮 Steam Manifest Manager</a>
        </div>
        <div className="flex-none gap-2">
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
          <button 
            className="btn btn-primary"
            onClick={() => setIsUploadModalOpen(true)}
          >
            📤 Upload Manifest
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto p-4 space-y-6">
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
      <footer className="footer footer-center p-4 bg-base-300 text-base-content mt-10">
        <div>
          <p>🎮 Steam Manifest Manager - Store and manage your Steam game manifests</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
