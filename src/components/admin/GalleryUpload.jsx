import React, { useRef, useState } from 'react';
import { uploadImage } from '../../api/client';
import { Upload, X } from 'lucide-react';

// Multi-image variant of ImageUpload for product galleries: renders one
// thumbnail per line already in `paths` (newline-delimited string), plus a
// file picker that appends newly uploaded paths to the list. The underlying
// textarea stays editable too, so manual paste/reorder/removal still works.
const GalleryUpload = ({ label, value, onChange, category, textAreaClassName }) => {
    const fileRef = useRef(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');

    const lines = (value || '').split('\n').map((l) => l.trim()).filter(Boolean);

    const handleFiles = async (e) => {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;
        setUploading(true);
        setError('');
        try {
            const uploaded = [];
            for (const file of files) {
                const { path } = await uploadImage(file, category);
                uploaded.push(path);
            }
            const next = [...lines, ...uploaded].join('\n');
            onChange(next);
        } catch (err) {
            setError(err.message);
        } finally {
            setUploading(false);
            if (fileRef.current) fileRef.current.value = '';
        }
    };

    const removeAt = (idx) => {
        const next = lines.filter((_, i) => i !== idx).join('\n');
        onChange(next);
    };

    return (
        <div>
            {label && <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>}
            {lines.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                    {lines.map((src, idx) => (
                        <div key={idx} className="relative h-16 w-16 rounded border border-gray-300 dark:border-gray-600 overflow-hidden group">
                            <img src={src} alt={`gallery-${idx}`} className="h-full w-full object-cover" />
                            <button
                                type="button"
                                onClick={() => removeAt(idx)}
                                className="absolute top-0 right-0 bg-black/60 text-white p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X size={12} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
            <textarea
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                rows={3}
                className={textAreaClassName}
            />
            <div className="flex items-center gap-2 mt-2">
                <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    disabled={uploading}
                    className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-60"
                >
                    <Upload size={14} /> {uploading ? 'Đang tải...' : 'Tải ảnh lên (có thể chọn nhiều)'}
                </button>
                <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple className="hidden" onChange={handleFiles} />
                {error && <span className="text-xs text-red-600 dark:text-red-400">{error}</span>}
            </div>
        </div>
    );
};

export default GalleryUpload;
