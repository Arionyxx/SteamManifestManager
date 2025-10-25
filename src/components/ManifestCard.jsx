import { useState } from 'react';

export default function ManifestCard({ manifest, onDelete, onView }) {
  const [showContent, setShowContent] = useState(false);
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const formatSize = (bytes) => {
    if (!bytes) return 'N/A';
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(2)} KB`;
    return `${(kb / 1024).toFixed(2)} MB`;
  };

  const decodeContent = (content) => {
    try {
      // Check if content is base64 encoded
      if (content.includes('BASE64')) {
        const parts = content.split(/===.*?===/g).filter(p => p.trim());
        let decoded = '';
        parts.forEach(part => {
          try {
            const base64Content = part.trim();
            decoded += atob(base64Content) + '\n\n';
          } catch (e) {
            decoded += part; // Fallback to original if decode fails
          }
        });
        return decoded;
      }
      return content;
    } catch (e) {
      return content;
    }
  };

  const downloadManifest = () => {
    const decodedContent = decodeContent(manifest.file_content);
    const blob = new Blob([decodedContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${manifest.game_name}_${manifest.manifest_id}.acf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="card bg-base-200 shadow-xl hover:shadow-2xl transition-all">
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

        {showContent && (
          <div className="mt-4">
            <div className="mockup-code max-h-64 overflow-auto">
              <pre className="text-xs"><code>{decodeContent(manifest.file_content)}</code></pre>
            </div>
          </div>
        )}

        <div className="card-actions justify-end mt-4">
          <button 
            className="btn btn-sm btn-ghost"
            onClick={() => setShowContent(!showContent)}
          >
            {showContent ? 'Hide' : 'View'} Content
          </button>
          <button 
            className="btn btn-sm btn-info"
            onClick={downloadManifest}
          >
            Download
          </button>
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
        </div>
      </div>
    </div>
  );
}
