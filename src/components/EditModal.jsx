import { useState, useEffect } from 'react';

export default function EditModal({ isOpen, onClose, manifest, onSave }) {
  const [formData, setFormData] = useState({
    game_name: '',
    notes: '',
  });
  const [gameImage, setGameImage] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (manifest) {
      setFormData({
        game_name: manifest.game_name || '',
        notes: manifest.notes || '',
      });
      setGameImage(manifest.game_image || '');
      setImagePreview(manifest.game_image || '');
    }
  }, [manifest]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSave({
        id: manifest.id,
        game_name: formData.game_name,
        notes: formData.notes,
        game_image: gameImage,
      });
      onClose();
    } catch (error) {
      alert('Update failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-2xl">
        <h3 className="font-bold text-2xl mb-4">Edit Manifest</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="alert alert-info">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>App ID: {manifest?.app_id} | Manifest ID: {manifest?.manifest_id}</span>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Game Name</span>
            </label>
            <input
              type="text"
              className="input input-bordered"
              value={formData.game_name}
              onChange={(e) => setFormData({ ...formData, game_name: e.target.value })}
              required
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
              rows="4"
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
                  <span className="label-text-alt">Upload new game image to replace current (max 2MB)</span>
                </label>
                {imagePreview && (
                  <button
                    type="button"
                    className="btn btn-sm btn-ghost mt-2"
                    onClick={() => {
                      setGameImage('');
                      setImagePreview('');
                    }}
                  >
                    Remove Image
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="modal-action">
            <button type="button" className="btn" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <span className="loading loading-spinner"></span> : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
