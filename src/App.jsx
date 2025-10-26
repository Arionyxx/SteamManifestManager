import { useState, useEffect } from 'react';
import { manifestAPI, connectWebSocket } from './services/api';
import UploadModal from './components/UploadModal';
import EditModal from './components/EditModal';
import ManifestCard from './components/ManifestCard';
import Stats from './components/Stats';
import Auth from './components/Auth';
import Settings from './components/Settings';

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [manifests, setManifests] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingManifest, setEditingManifest] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

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
    localStorage.setItem('theme', theme);
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

  const handleUpdateUser = (updatedUser) => {
    setUser({
      id: updatedUser.id,
      username: updatedUser.username,
      role: updatedUser.role,
      profile_picture: updatedUser.profile_picture
    });
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

  const handleEdit = (manifest) => {
    setEditingManifest(manifest);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (data) => {
    const response = await manifestAPI.update(data.id, {
      game_name: data.game_name,
      notes: data.notes,
      game_image: data.game_image
    }, token);
    
    if (response.success) {
      loadManifests();
      setIsEditModalOpen(false);
    } else {
      throw new Error(response.error);
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
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost">
              <div className="flex items-center gap-2">
                <div className="avatar">
                  <div className="w-8 rounded-full ring ring-primary ring-offset-base-100 ring-offset-1">
                    {user.profile_picture ? (
                      <img src={user.profile_picture} alt="Profile" className="object-cover" />
                    ) : (
                      <div className="bg-primary text-primary-content rounded-full w-full h-full flex items-center justify-center">
                        <span className="text-sm">{user.username.charAt(0).toUpperCase()}</span>
                      </div>
                    )}
                  </div>
                </div>
                <span>{user.username} {isAdmin && '👑'}</span>
              </div>
            </label>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-200 rounded-box w-52">
              <li>
                <a onClick={() => setIsSettingsOpen(true)}>
                  ⚙️ Settings
                </a>
              </li>
              <li>
                <a onClick={handleLogout}>
                  🚪 Logout
                </a>
              </li>
            </ul>
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
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto p-4 space-y-6 flex-grow">
        {/* Stats */}
        <Stats stats={stats} loading={statsLoading} />

        {/* Search */}
        <div className="flex justify-center">
          <div className="form-control w-full max-w-2xl">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                🔍
              </span>
              <input
                type="text"
                placeholder="Search by game name or App ID..."
                className="input input-bordered w-full pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {manifests.map((manifest) => (
              <ManifestCard
                key={manifest.id}
                manifest={manifest}
                onDelete={handleDelete}
                onEdit={handleEdit}
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

      {/* Edit Modal */}
      {isEditModalOpen && (
        <EditModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingManifest(null);
          }}
          manifest={editingManifest}
          onSave={handleSaveEdit}
        />
      )}

      {/* Settings Modal */}
      {isSettingsOpen && (
        <Settings
          user={user}
          token={token}
          onUpdateUser={handleUpdateUser}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}

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
