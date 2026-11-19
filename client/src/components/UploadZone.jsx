import { useRef, useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function UploadZone({ onUploaded }) {
  const inputRef = useRef();
  const [busy, setBusy] = useState(false);

  const handleFiles = async (files) => {
    if (!files?.length) return;
    setBusy(true);
    try {
      for (const file of files) {
        const fd = new FormData();
        fd.append('file', file);
        await api.post('/files', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      toast.success('Uploaded!');
      onUploaded();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Upload failed');
    } finally { setBusy(false); if (inputRef.current) inputRef.current.value = ''; }
  };

  return (
    <div
      className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition"
      onClick={() => inputRef.current.click()}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
    >
      <input
        ref={inputRef} type="file" hidden multiple
        accept=".pdf,.docx,.jpg,.jpeg,.png"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <p className="text-2xl">UP</p>
      <p className="font-medium mt-2">{busy ? 'Uploading...' : 'Click or drop files here'}</p>
      <p className="text-xs text-slate-500">PDF, DOCX, JPG, PNG | Max 10MB each</p>
    </div>
  );
}
