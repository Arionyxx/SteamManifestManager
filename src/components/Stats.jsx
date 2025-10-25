export default function Stats({ stats, loading }) {
  const formatSize = (bytes) => {
    if (!bytes) return '0 B';
    const mb = bytes / (1024 * 1024);
    if (mb < 1024) return `${mb.toFixed(2)} MB`;
    return `${(mb / 1024).toFixed(2)} GB`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="stats stats-vertical lg:stats-horizontal shadow w-full">
        <div className="stat">
          <div className="stat-title">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="stats stats-vertical lg:stats-horizontal shadow w-full bg-base-200">
      <div className="stat">
        <div className="stat-figure text-primary">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
        </div>
        <div className="stat-title">Total Manifests</div>
        <div className="stat-value text-primary">{stats?.total_manifests || 0}</div>
      </div>

      <div className="stat">
        <div className="stat-figure text-secondary">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
          </svg>
        </div>
        <div className="stat-title">Unique Games</div>
        <div className="stat-value text-secondary">{stats?.unique_games || 0}</div>
      </div>

      <div className="stat">
        <div className="stat-title">Total Storage</div>
        <div className="stat-value">{formatSize(stats?.total_size)}</div>
      </div>

      <div className="stat">
        <div className="stat-title">Last Upload</div>
        <div className="stat-value text-sm">{formatDate(stats?.last_upload)}</div>
      </div>
    </div>
  );
}
