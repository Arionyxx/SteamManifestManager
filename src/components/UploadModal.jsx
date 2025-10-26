import { useState } from 'react';

export default function UploadModal({ isOpen, onClose, onUpload }) {
  const [formData, setFormData] = useState({
    game_name: '',
    app_id: '',
    uploader_name: '',
    notes: 'This includes manifest and lua files drag to steamtools floating window to add to ur library make sure you have unlock mode on.',
  });
  const [manifestFiles, setManifestFiles] = useState([]);
  const [luaFile, setLuaFile] = useState(null);
  const [gameImage, setGameImage] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (manifestFiles.length === 0 && !luaFile) {
      setError('Please select at least one file (.manifest or .lua)');
      return;
    }
    
    // Check file sizes
    for (const file of manifestFiles) {
      if (file.size > 50 * 1024 * 1024) {
        setError(`File "${file.name}" is too large. Maximum size is 50MB per file.`);
        return;
      }
    }
    if (luaFile && luaFile.size > 50 * 1024 * 1024) {
      setError(`Lua file is too large. Maximum size is 50MB.`);
      return;
    }

    setLoading(true);
    const data = new FormData();
    // Append all manifest files
    manifestFiles.forEach((file) => {
      data.append('manifest', file);
    });
    if (luaFile) data.append('lua', luaFile);
    if (gameImage) data.append('game_image', gameImage);
    Object.keys(formData).forEach(key => {
      if (formData[key]) data.append(key, formData[key]);
    });

    try {
      await onUpload(data);
      setFormData({
        game_name: '',
        app_id: '',
        uploader_name: '',
        notes: 'This includes manifest and lua files drag to steamtools floating window to add to ur library make sure you have unlock mode on.',
      });
      setManifestFiles([]);
      setLuaFile(null);
      setGameImage('');
      setImagePreview('');
      onClose();
    } catch (error) {
      console.error('Upload error:', error);
      setError(error.message || 'Upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-2xl">
        <h3 className="font-bold text-2xl mb-4">Upload Steam Manifest</h3>
        {error && (
          <div className="alert alert-error">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Game Name *</span>
            </label>
            <input
              type="text"
              placeholder="e.g., Counter-Strike: Global Offensive"
              className="input input-bordered"
              value={formData.game_name}
              onChange={(e) => setFormData({ ...formData, game_name: e.target.value })}
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">App ID *</span>
            </label>
            <input
              type="text"
              placeholder="e.g., 730 (CS:GO)"
              className="input input-bordered"
              value={formData.app_id}
              onChange={(e) => setFormData({ ...formData, app_id: e.target.value })}
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Your Name</span>
            </label>
            <input
              type="text"
              placeholder="Optional"
              className="input input-bordered"
              value={formData.uploader_name}
              onChange={(e) => setFormData({ ...formData, uploader_name: e.target.value })}
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Notes</span>
            </label>
            <textarea
              className="textarea textarea-bordered"
              placeholder="Any additional notes..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows="3"
            ></textarea>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Game Cover Image</span>
            </label>
            <div className="flex gap-4 items-start">
              {imagePreview && (
                <div className="avatar">
                  <div className="w-32 h-18 rounded">
                    <img src={imagePreview} alt="Preview" className="object-cover" />
                  </div>
                </div>
              )}
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  className="file-input file-input-bordered w-full"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    if (file.size > 10 * 1024 * 1024) {
                      alert('Image must be smaller than 10MB');
                      return;
                    }
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setGameImage(reader.result);
                      setImagePreview(reader.result);
                    };
                    reader.readAsDataURL(file);
                  }}
                />
                <label className="label">
                  <span className="label-text-alt">Optional: Upload custom game image (max 10MB)</span>
                </label>
              </div>
            </div>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Manifest Files (.manifest, .acf, .txt)</span>
            </label>
            <input
              type="file"
              className="file-input file-input-bordered w-full"
              onChange={(e) => setManifestFiles(Array.from(e.target.files))}
              accept=".acf,.txt,.manifest"
              multiple
            />
            {manifestFiles.length > 0 && (
              <div className="mt-2 space-y-1">
                {manifestFiles.map((file, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="label-text-alt text-success">✓ {file.name}</span>
                    <button
                      type="button"
                      className="btn btn-xs btn-ghost"
                      onClick={() => setManifestFiles(manifestFiles.filter((_, i) => i !== index))}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
            <label className="label">
              <span className="label-text-alt">Select multiple files for games with DLCs</span>
            </label>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Lua File (.lua)</span>
            </label>
            <input
              type="file"
              className="file-input file-input-bordered w-full"
              onChange={(e) => setLuaFile(e.target.files[0])}
              accept=".lua"
            />
            {luaFile && (
              <label className="label">
                <span className="label-text-alt text-success">✓ {luaFile.name}</span>
              </label>
            )}
          </div>

          <div className="modal-action">
            <button type="button" className="btn" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <span className="loading loading-spinner"></span> : 'Upload'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
