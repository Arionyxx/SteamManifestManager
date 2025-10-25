import { useState, useEffect } from 'react';
import { API_BASE } from '../config/api.js';

function Settings({ user, token, onUpdateUser, onClose }) {
  const [username, setUsername] = useState(user.username);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [usernameSuccess, setUsernameSuccess] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [canChangeUsername, setCanChangeUsername] = useState(true);
  const [daysUntilChange, setDaysUntilChange] = useState(0);
  const [profilePicture, setProfilePicture] = useState(user.profile_picture || '');
  const [pictureUrl, setPictureUrl] = useState(user.profile_picture || '');
  const [pictureError, setPictureError] = useState('');
  const [pictureSuccess, setPictureSuccess] = useState('');
  const [pictureLoading, setPictureLoading] = useState(false);
  const isAdmin = user.role === 'admin';

  useEffect(() => {
    // Admins can always change username, regular users need to check cooldown
    if (!isAdmin) {
      fetchProfile();
    }
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch(`${API_BASE}/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setProfilePicture(data.data.profile_picture || '');
        setPictureUrl(data.data.profile_picture || '');
        const lastChanged = data.data.username_changed_at ? new Date(data.data.username_changed_at) : null;
        if (lastChanged) {
          const now = new Date();
          const daysSinceLastChange = (now - lastChanged) / (1000 * 60 * 60 * 24);
          if (daysSinceLastChange < 30) {
            setCanChangeUsername(false);
            setDaysUntilChange(Math.ceil(30 - daysSinceLastChange));
          }
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleUsernameUpdate = async (e) => {
    e.preventDefault();
    setUsernameError('');
    setUsernameSuccess('');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/auth/profile/username`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ newUsername: username })
      });

      const data = await response.json();

      if (data.success) {
        setUsernameSuccess('Username updated successfully!');
        onUpdateUser(data.data);
        localStorage.setItem('user', JSON.stringify({
          id: data.data.id,
          username: data.data.username,
          role: data.data.role
        }));
        // Only set cooldown for non-admin users
        if (!isAdmin) {
          setCanChangeUsername(false);
          setDaysUntilChange(30);
        }
      } else {
        setUsernameError(data.error);
      }
    } catch (error) {
      setUsernameError('Failed to update username');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/auth/profile/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });

      const data = await response.json();

      if (data.success) {
        setPasswordSuccess('Password updated successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPasswordError(data.error);
      }
    } catch (error) {
      setPasswordError('Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      setPictureError('Please select an image file');
      return;
    }

    // Check file size (max 2MB to account for base64 encoding)
    if (file.size > 2 * 1024 * 1024) {
      setPictureError('Image must be smaller than 2MB');
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      setPictureUrl(reader.result);
      setPictureError('');
    };
    reader.onerror = () => {
      setPictureError('Failed to read image file');
    };
    reader.readAsDataURL(file);
  };

  const handleProfilePictureUpdate = async (e) => {
    e.preventDefault();
    setPictureError('');
    setPictureSuccess('');
    setPictureLoading(true);

    try {
      const response = await fetch(`${API_BASE}/auth/profile/picture`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ profilePictureUrl: pictureUrl })
      });

      const data = await response.json();

      if (data.success) {
        setPictureSuccess('Profile picture updated successfully!');
        setProfilePicture(pictureUrl);
        onUpdateUser({
          ...user,
          profile_picture: pictureUrl
        });
        localStorage.setItem('user', JSON.stringify({
          ...user,
          profile_picture: pictureUrl
        }));
      } else {
        setPictureError(data.error);
      }
    } catch (error) {
      setPictureError('Failed to update profile picture');
    } finally {
      setPictureLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-base-200 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">⚙️ Settings</h2>
            <button onClick={onClose} className="btn btn-ghost btn-sm btn-circle">
              ✕
            </button>
          </div>

          {/* User Info */}
          <div className="mb-6 p-4 bg-base-300 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="avatar">
                <div className="w-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  {profilePicture ? (
                    <img src={profilePicture} alt="Profile" className="object-cover" />
                  ) : (
                    <div className="bg-primary text-primary-content rounded-full w-full h-full flex items-center justify-center">
                      <span className="text-xl">{user.username.charAt(0).toUpperCase()}</span>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <p className="font-bold">{user.username}</p>
                <p className="text-sm opacity-70">{user.role === 'admin' ? '👑 Admin' : '👤 User'}</p>
              </div>
            </div>
          </div>

          {/* Update Profile Picture */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-4">Profile Picture</h3>
            <form onSubmit={handleProfilePictureUpdate} className="space-y-4">
              <div className="flex gap-4 items-start">
                <div className="avatar">
                  <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                    {pictureUrl ? (
                      <img src={pictureUrl} alt="Preview" className="object-cover" />
                    ) : (
                      <div className="bg-primary text-primary-content rounded-full w-full h-full flex items-center justify-center">
                        <span className="text-4xl">{user.username.charAt(0).toUpperCase()}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Choose Image</span>
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      className="file-input file-input-bordered w-full"
                      onChange={handleFileSelect}
                      disabled={pictureLoading}
                    />
                    <label className="label">
                      <span className="label-text-alt">Upload an image from your computer (max 2MB, displayed as circle)</span>
                    </label>
                  </div>
                </div>
              </div>
              {pictureError && (
                <div className="alert alert-error">
                  <span>{pictureError}</span>
                </div>
              )}
              {pictureSuccess && (
                <div className="alert alert-success">
                  <span>{pictureSuccess}</span>
                </div>
              )}
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={pictureLoading || pictureUrl === profilePicture}
                >
                  {pictureLoading ? <span className="loading loading-spinner"></span> : 'Update Picture'}
                </button>
                {profilePicture && (
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => {
                      setPictureUrl('');
                      handleProfilePictureUpdate(new Event('submit'));
                    }}
                    disabled={pictureLoading}
                  >
                    Remove Picture
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="divider"></div>

          {/* Update Username */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-4">Change Username</h3>
            <form onSubmit={handleUsernameUpdate} className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">New Username</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={!canChangeUsername || loading}
                  required
                />
                {isAdmin ? (
                  <label className="label">
                    <span className="label-text-alt text-success">
                      👑 As an admin, you can change your username anytime!
                    </span>
                  </label>
                ) : !canChangeUsername && (
                  <label className="label">
                    <span className="label-text-alt text-warning">
                      You can change your username again in {daysUntilChange} days
                    </span>
                  </label>
                )}
              </div>
              {usernameError && (
                <div className="alert alert-error">
                  <span>{usernameError}</span>
                </div>
              )}
              {usernameSuccess && (
                <div className="alert alert-success">
                  <span>{usernameSuccess}</span>
                </div>
              )}
              <button
                type="submit"
                className="btn btn-primary"
                disabled={!canChangeUsername || loading || username === user.username}
              >
                {loading ? <span className="loading loading-spinner"></span> : 'Update Username'}
              </button>
            </form>
          </div>

          <div className="divider"></div>

          {/* Update Password */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-4">Change Password</h3>
            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Current Password</span>
                </label>
                <input
                  type="password"
                  className="input input-bordered w-full"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">New Password</span>
                </label>
                <input
                  type="password"
                  className="input input-bordered w-full"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Confirm New Password</span>
                </label>
                <input
                  type="password"
                  className="input input-bordered w-full"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
              {passwordError && (
                <div className="alert alert-error">
                  <span>{passwordError}</span>
                </div>
              )}
              {passwordSuccess && (
                <div className="alert alert-success">
                  <span>{passwordSuccess}</span>
                </div>
              )}
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? <span className="loading loading-spinner"></span> : 'Update Password'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
