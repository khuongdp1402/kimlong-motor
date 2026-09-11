import React, { useRef, useState } from 'react';
import { uploadImage } from '../../api/client';
import { Upload, Image as ImageIcon } from 'lucide-react';

// Reusable image field for the admin forms: keeps the plain text/URL input as
// a manual-override fallback, but adds a file picker that uploads to
// POST /api/upload and auto-fills the returned path, plus a small preview.
const ImageUpload = ({ label, value, onChange, category, inputClassName }) => {
    const fileRef = useRef(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');

    const handleFile = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        setError('');
        try {
            const { path } = await uploadImage(file, category);
            onChange(path);
        } catch (err) {
            setError(err.message);
        } finally {
            setUploading(false);
            if (fileRef.current) fileRef.current.value = '';
        }
    };

    return (
        <div>
            {label && <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>}
            <div className="flex items-start gap-3">
                <div className="h-16 w-16 flex-shrink-0 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 overflow-hidden flex items-center justify-center">
                    {value ? (
                        <img src={value} alt="preview" className="h-full w-full object-cover" />
                    ) : (
                        <ImageIcon size={20} className="text-gray-400 dark:text-gray-500" />
                    )}
                </div>
                <div className="flex-1 space-y-2">
                    <input
                        type="text"
                        value={value || ''}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder="/images/... (hoặc dán URL, hoặc tải ảnh lên)"
                        className={inputClassName}
                    />
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => fileRef.current?.click()}
                            disabled={uploading}
                            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-60"
                        >
                            <Upload size={14} /> {uploading ? 'Đang tải...' : 'Tải ảnh lên'}
                        </button>
                        <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={handleFile} />
                        {error && <span className="text-xs text-red-600 dark:text-red-400">{error}</span>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageUpload;
