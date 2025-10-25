import { useState } from 'react';

export default function UploadModal({ isOpen, onClose, onUpload }) {
  const [formData, setFormData] = useState({
    app_id: '',
    game_name: '',
    depot_id: '',
    manifest_id: '',
    uploader_name: '',
    notes: '',
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert('Please select a manifest file');
      return;
    }

    setLoading(true);
    const data = new FormData();
    data.append('manifest', file);
    Object.keys(formData).forEach(key => {
      if (formData[key]) data.append(key, formData[key]);
    });

    try {
      await onUpload(data);
      setFormData({
        app_id: '',
        game_name: '',
        depot_id: '',
        manifest_id: '',
        uploader_name: '',
        notes: '',
      });
      setFile(null);
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

          <div className="grid grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Depot ID</span>
              </label>
              <input
                type="text"
                placeholder="Optional"
                className="input input-bordered"
                value={formData.depot_id}
                onChange={(e) => setFormData({ ...formData, depot_id: e.target.value })}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Manifest ID *</span>
              </label>
              <input
                type="text"
                placeholder="Manifest identifier"
                className="input input-bordered"
                value={formData.manifest_id}
                onChange={(e) => setFormData({ ...formData, manifest_id: e.target.value })}
                required
              />
            </div>
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
              <span className="label-text">Manifest File *</span>
            </label>
            <input
              type="file"
              className="file-input file-input-bordered w-full"
              onChange={(e) => setFile(e.target.files[0])}
              accept=".acf,.txt,.manifest"
              required
            />
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
