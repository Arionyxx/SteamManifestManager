import { useState } from 'react';

export default function UploadModal({ isOpen, onClose, onUpload }) {
  const [formData, setFormData] = useState({
    game_name: '',
    app_id: '',
    uploader_name: '',
    notes: '',
  });
  const [manifestFile, setManifestFile] = useState(null);
  const [luaFile, setLuaFile] = useState(null);
  const [gameImage, setGameImage] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!manifestFile && !luaFile) {
      alert('Please select at least one file (.manifest or .lua)');
      return;
    }

    setLoading(true);
    const data = new FormData();
    if (manifestFile) data.append('manifest', manifestFile);
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
        notes: '',
      });
      setManifestFile(null);
      setLuaFile(null);
      setGameImage('');
      setImagePreview('');
      onClose();
    } catch (error) {
      alert('Upload failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-2xl">
        <h3 className="font-bold text-2xl mb-4">Upload Steam Manifest</h3>
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
                    if (file.size > 2 * 1024 * 1024) {
                      alert('Image must be smaller than 2MB');
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
                  <span className="label-text-alt">Optional: Upload custom game image (max 2MB)</span>
                </label>
              </div>
            </div>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Manifest File (.manifest, .acf, .txt)</span>
            </label>
            <input
              type="file"
              className="file-input file-input-bordered w-full"
              onChange={(e) => setManifestFile(e.target.files[0])}
              accept=".acf,.txt,.manifest"
            />
            {manifestFile && (
              <label className="label">
                <span className="label-text-alt text-success">✓ {manifestFile.name}</span>
              </label>
            )}
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
