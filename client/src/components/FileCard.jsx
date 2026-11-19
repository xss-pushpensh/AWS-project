export default function FileCard({ file, onDownload, onDelete, onShare, isOwner }) {
  const size = (file.size / 1024).toFixed(1);
  return (
    <div className="card p-4 flex flex-col gap-2">
      <div className="flex items-start justify-between">
        <div className="text-3xl">PDF</div>
        <span className="text-xs text-slate-500">{size} KB</span>
      </div>
      <p className="font-medium truncate" title={file.originalName}>{file.originalName}</p>
      <p className="text-xs text-slate-500">
        Shared with {file.sharedWith?.length || 0} user(s)
      </p>
      <div className="flex gap-2 mt-2">
        <button onClick={() => onDownload(file._id)} className="btn btn-primary text-sm flex-1">Download</button>
        {isOwner && (
          <>
            <button onClick={() => onShare(file)} className="btn btn-ghost text-sm">Share</button>
            <button onClick={() => onDelete(file._id)} className="btn btn-danger text-sm">Del</button>
          </>
        )}
      </div>
    </div>
  );
}
