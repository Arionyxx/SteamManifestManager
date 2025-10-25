export default function ManifestCard({ manifest, onDelete, canDelete = false }) {
  
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

  // Steam header image URL
  const steamImageUrl = `https://cdn.cloudflare.steamstatic.com/steam/apps/${manifest.app_id}/header.jpg`;

  return (
    <div className="card bg-base-200 shadow-xl hover:shadow-2xl transition-all">
      {/* Game Cover Image */}
      <figure>
        <img 
          src={steamImageUrl} 
          alt={manifest.game_name}
          className="w-full h-48 object-cover"
          onError={(e) => {
            // Fallback to a placeholder if image fails to load
            e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="460" height="215" viewBox="0 0 460 215"%3E%3Crect fill="%23374151" width="460" height="215"/%3E%3Ctext fill="%23ffffff" font-family="sans-serif" font-size="20" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3E' + encodeURIComponent(manifest.game_name) + '%3C/text%3E%3C/svg%3E';
          }}
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title text-xl">
          {manifest.game_name}
          <div className="badge badge-primary">{manifest.app_id}</div>
        </h2>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="font-semibold">Manifest ID:</span>
            <span className="font-mono">{manifest.manifest_id}</span>
          </div>
          
          {manifest.depot_id && (
            <div className="flex justify-between">
              <span className="font-semibold">Depot ID:</span>
              <span className="font-mono">{manifest.depot_id}</span>
            </div>
          )}
          
          <div className="flex justify-between">
            <span className="font-semibold">Size:</span>
            <span>{formatSize(manifest.file_size)}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="font-semibold">Uploaded:</span>
            <span>{formatDate(manifest.uploaded_at)}</span>
          </div>
          
          {manifest.uploader_name && (
            <div className="flex justify-between">
              <span className="font-semibold">By:</span>
              <span>{manifest.uploader_name}</span>
            </div>
          )}
          
          {manifest.notes && (
            <div className="mt-2">
              <span className="font-semibold">Notes:</span>
              <p className="text-xs mt-1 opacity-80">{manifest.notes}</p>
            </div>
          )}
        </div>

        <div className="card-actions justify-end mt-4">
          <button 
            className="btn btn-sm btn-info"
            onClick={downloadManifest}
          >
            Download ZIP
          </button>
          {canDelete && (
            <button 
              className="btn btn-sm btn-error"
              onClick={() => {
                if (confirm('Delete this manifest?')) {
                  onDelete(manifest.id);
                }
              }}
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
