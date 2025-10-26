import { useState } from 'react';

export default function ManifestCard({ manifest, onDelete, onEdit, canDelete = false }) {
  const [imageError, setImageError] = useState(false);
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const formatSize = (bytes) => {
    if (!bytes) return 'N/A';
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(2)} KB`;
    return `${(kb / 1024).toFixed(2)} MB`;
  };

  const downloadManifest = async () => {
    try {
      const content = manifest.file_content;
      
      // Parse sections
      const manifestSection = content.match(/=== MANIFEST FILE \(BASE64\) ===\s*([^=]+)/)?.[1]?.trim();
      const luaSection = content.match(/=== LUA FILE \(BASE64\) ===\s*([^=]+)/)?.[1]?.trim();
      
      if (!manifestSection && !luaSection) {
        alert('No files found to download');
        return;
      }

      // Use JSZip dynamically imported
      const JSZip = (await import('https://cdn.jsdelivr.net/npm/jszip@3.10.1/+esm')).default;
      const zip = new JSZip();
      
      // Add files to zip
      if (manifestSection) {
        const manifestData = atob(manifestSection);
        const depotId = manifest.depot_id || 'unknown';
        const manifestId = manifest.manifest_id || 'unknown';
        zip.file(`${depotId}_${manifestId}.manifest`, manifestData, { binary: true });
      }
      
      if (luaSection) {
        const luaData = atob(luaSection);
        zip.file(`${manifest.game_name}.lua`, luaData, { binary: true });
      }
      
      // Generate and download zip
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${manifest.game_name}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download files');
    }
  };

  // Use custom game image if available, otherwise fallback to Steam CDN
  const gameImageUrl = manifest.game_image || `https://cdn.cloudflare.steamstatic.com/steam/apps/${manifest.app_id}/header.jpg`;

  const handleDelete = async () => {
    if (window.confirm(`Delete ${manifest.game_name}?`)) {
      try {
        await onDelete(manifest.id);
      } catch (error) {
        console.error('Delete error:', error);
        alert('Failed to delete manifest');
      }
    }
  };

  return (
    <div className="group card bg-base-200 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-base-300 hover:border-primary">
      {/* Game Cover Image */}
      <figure className="relative h-40 overflow-hidden bg-base-300">
        {!imageError ? (
          <img 
            src={gameImageUrl} 
            alt={manifest.game_name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            loading="lazy"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
            <div className="text-center p-2">
              <div className="text-3xl mb-1">🎮</div>
              <div className="text-xs font-semibold">{manifest.game_name}</div>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </figure>
      <div className="card-body p-5">
        <h2 className="card-title text-lg mb-3">
          <span className="truncate">{manifest.game_name}</span>
          <div className="badge badge-primary">{manifest.app_id}</div>
        </h2>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between items-center gap-2">
            <span className="text-base-content/60 font-medium">Manifest:</span>
            <span className="font-mono text-sm truncate">{manifest.manifest_id}</span>
          </div>
          
          {manifest.depot_id && (
            <div className="flex justify-between items-center gap-2">
              <span className="text-base-content/60 font-medium">Depot:</span>
              <span className="font-mono text-sm">{manifest.depot_id}</span>
            </div>
          )}
          
          <div className="flex justify-between items-center gap-2">
            <span className="text-base-content/60 font-medium">Size:</span>
            <span className="badge badge-ghost">{formatSize(manifest.file_size)}</span>
          </div>
          
          {manifest.uploader_name && (
            <div className="flex justify-between items-center gap-2">
              <span className="text-base-content/60 font-medium">By:</span>
              <span className="truncate">{manifest.uploader_name}</span>
            </div>
          )}
          
          {manifest.notes && (
            <div className="mt-3 p-3 bg-base-300 rounded text-sm max-h-24 overflow-y-auto">
              <p className="whitespace-pre-wrap break-words">{manifest.notes}</p>
            </div>
          )}
        </div>

        <div className="card-actions justify-end mt-4 gap-2">
          <button 
            className="btn btn-sm btn-info gap-1"
            onClick={downloadManifest}
          >
            ⬇️ Download
          </button>
          {canDelete && (
            <>
              <button 
                className="btn btn-sm btn-warning gap-1"
                onClick={() => onEdit(manifest)}
              >
                ✏️ Edit
              </button>
              <button 
                className="btn btn-sm btn-error gap-1"
                onClick={handleDelete}
              >
                🗑️ Delete
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
