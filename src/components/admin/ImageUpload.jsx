import React, { useRef, useState } from 'react';
import { uploadImage } from '../../api/client';
import { Upload, Trash2, RefreshCw, Image as ImageIcon } from 'lucide-react';

const ImageUpload = ({ label = 'Ảnh đại diện', value, onChange, category = 'products' }) => {
    const fileRef = useRef(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [isDragging, setIsDragging] = useState(false);

    const handleFile = async (file) => {
        if (!file) return;
        setUploading(true);
        setError('');
        try {
            const { path } = await uploadImage(file, category);
            onChange(path);
        } catch (err) {
            setError(err.message || 'Lỗi tải ảnh lên');
        } finally {
            setUploading(false);
            if (fileRef.current) fileRef.current.value = '';
        }
    };

    const handleInputChange = (e) => {
        const file = e.target.files?.[0];
        handleFile(file);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer?.files?.[0];
        if (file && file.type.startsWith('image/')) {
            handleFile(file);
        }
    };

    return (
        <div>
            {label && (
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    {label}
                </label>
            )}

            <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={handleInputChange}
            />

            {value ? (
                <div className="relative inline-block group">
                    <div className="h-44 w-72 max-w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 overflow-hidden shadow-xs relative">
                        <img
                            src={value}
                            alt="Ảnh đại diện"
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <button
                                type="button"
                                onClick={() => fileRef.current?.click()}
                                disabled={uploading}
                                className="px-3 py-1.5 rounded-lg bg-white/95 hover:bg-white text-gray-800 text-xs font-semibold shadow-md flex items-center gap-1.5 cursor-pointer transition-colors"
                                title="Đổi ảnh khác"
                            >
                                <RefreshCw size={13} className={uploading ? 'animate-spin' : ''} />
                                <span>{uploading ? 'Đang tải...' : 'Đổi ảnh'}</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => onChange('')}
                                className="p-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white shadow-md cursor-pointer transition-colors"
                                title="Xóa ảnh"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    </div>
                    <div className="text-[11px] text-gray-400 mt-1">
                        * Di chuột lên ảnh để đổi hoặc xóa ảnh
                    </div>
                </div>
            ) : (
                <div
                    onClick={() => fileRef.current?.click()}
                    onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all ${
                        isDragging
                            ? 'border-red-500 bg-red-50/50 dark:bg-red-950/30'
                            : 'border-gray-300 dark:border-gray-600 hover:border-red-400 bg-gray-50/60 dark:bg-gray-800/60 hover:bg-red-50/20'
                    }`}
                >
                    <div className="h-12 w-12 rounded-full bg-red-50 dark:bg-red-950/50 flex items-center justify-center text-red-600 dark:text-red-400 mb-2">
                        {uploading ? <RefreshCw size={22} className="animate-spin" /> : <Upload size={22} />}
                    </div>
                    <div className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-200">
                        {uploading ? 'Đang tải ảnh lên máy chủ...' : 'Nhấn vào đây để tải ảnh hoặc kéo thả ảnh vào'}
                    </div>
                    <div className="text-[11px] text-gray-400 mt-1">
                        Hỗ trợ JPG, PNG, WebP (Khuyến nghị tỉ lệ 16:10 hoặc 16:9)
                    </div>
                </div>
            )}

            {error && <p className="text-xs text-red-600 dark:text-red-400 mt-1">{error}</p>}
        </div>
    );
};

export default ImageUpload;
