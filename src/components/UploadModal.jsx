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
        <h3 className="font-bold text-2xl mb-4">🔐 Upload Steam Depot Manifest</h3>
        <div className="alert alert-info mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <span className="text-sm">Upload .manifest files from Steam/depots/ folder. Format: depotid_manifestid.manifest</span>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">App ID *</span>
            </label>
            <input
              type="text"
              placeholder="e.g., 730 (CS:GO), 440 (TF2)"
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
                <span className="label-text">Depot ID *</span>
                <span className="label-text-alt">From filename</span>
              </label>
              <input
                type="text"
                placeholder="e.g., 3716601"
                className="input input-bordered"
                value={formData.depot_id}
                onChange={(e) => setFormData({ ...formData, depot_id: e.target.value })}
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Manifest ID *</span>
                <span className="label-text-alt">From filename</span>
              </label>
              <input
                type="text"
                placeholder="e.g., 3930318588611247096"
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
              <span className="label-text">Notes / Depot Key</span>
              <span className="label-text-alt">Optional but recommended</span>
            </label>
            <textarea
              className="textarea textarea-bordered"
              placeholder="Depot decryption key, build version, notes...\ne.g., Depot Key: 1A2B3C4D5E6F7890ABCDEF1234567890"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows="3"
            ></textarea>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Manifest File *</span>
              <span className="label-text-alt">.manifest files only</span>
            </label>
            <input
              type="file"
              className="file-input file-input-bordered w-full"
              onChange={(e) => setFile(e.target.files[0])}
              accept=".manifest"
              required
            />
            <label className="label">
              <span className="label-text-alt">Find in: C:\Program Files (x86)\Steam\depots\</span>
            </label>
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
