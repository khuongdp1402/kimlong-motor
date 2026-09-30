import React, { useRef, useState } from 'react';
import { uploadImage } from '../../api/client';
import {
    Upload,
    Trash2,
    GripVertical,
    ChevronLeft,
    ChevronRight,
    RefreshCw,
    Star,
    Plus,
} from 'lucide-react';

const GalleryUpload = ({ label = 'Thư viện ảnh', value = '', onChange, category = 'products' }) => {
    const fileRef = useRef(null);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState('');
    const [error, setError] = useState('');
    const [draggedIndex, setDraggedIndex] = useState(null);
    const [dragOverIndex, setDragOverIndex] = useState(null);
    const [isGlobalDragging, setIsGlobalDragging] = useState(false);

    // List of image paths derived from newline string
    const items = (value || '')
        .split('\n')
        .map((l) => l.trim())
        .filter(Boolean);

    const updateItems = (nextItems) => {
        onChange(nextItems.join('\n'));
    };

    const handleUploadFiles = async (files) => {
        if (!files || files.length === 0) return;
        setUploading(true);
        setError('');
        try {
            const uploaded = [];
            for (let i = 0; i < files.length; i++) {
                setUploadProgress(`Đang tải ảnh ${i + 1}/${files.length}...`);
                const { path } = await uploadImage(files[i], category);
                uploaded.push(path);
            }
            updateItems([...items, ...uploaded]);
        } catch (err) {
            setError(err.message || 'Lỗi khi tải ảnh');
        } finally {
            setUploading(false);
            setUploadProgress('');
            if (fileRef.current) fileRef.current.value = '';
        }
    };

    const handleFileInput = (e) => {
        const files = Array.from(e.target.files || []);
        handleUploadFiles(files);
    };

    const handleRemove = (idx) => {
        const next = items.filter((_, i) => i !== idx);
        updateItems(next);
    };

    const handleMove = (fromIndex, toIndex) => {
        if (toIndex < 0 || toIndex >= items.length || fromIndex === toIndex) return;
        const next = [...items];
        const [moved] = next.splice(fromIndex, 1);
        next.splice(toIndex, 0, moved);
        updateItems(next);
    };

    // HTML5 Drag & Drop reordering between items
    const handleDragStart = (e, index) => {
        setDraggedIndex(index);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', String(index));
    };

    const handleDragOverItem = (e, index) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        if (dragOverIndex !== index) {
            setDragOverIndex(index);
        }
    };

    const handleDropItem = (e, targetIndex) => {
        e.preventDefault();
        e.stopPropagation();
        if (draggedIndex === null || draggedIndex === undefined) return;
        handleMove(draggedIndex, targetIndex);
        setDraggedIndex(null);
        setDragOverIndex(null);
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
        setDragOverIndex(null);
    };

    // Drop files from Windows/Desktop into dropzone
    const handleDropFiles = (e) => {
        e.preventDefault();
        setIsGlobalDragging(false);
        const files = Array.from(e.dataTransfer?.files || []).filter((f) =>
            f.type.startsWith('image/')
        );
        if (files.length > 0) {
            handleUploadFiles(files);
        }
    };

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                {label && (
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {label} ({items.length} ảnh)
                    </label>
                )}
                <span className="text-[11px] text-gray-500 dark:text-gray-400">
                    Kéo thả ảnh để thay đổi thứ tự hiển thị
                </span>
            </div>

            <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                multiple
                className="hidden"
                onChange={handleFileInput}
            />

            {/* Grid of gallery images */}
            <div
                onDragOver={(e) => {
                    e.preventDefault();
                    setIsGlobalDragging(true);
                }}
                onDragLeave={() => setIsGlobalDragging(false)}
                onDrop={handleDropFiles}
                className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 p-3 rounded-xl border transition-colors ${
                    isGlobalDragging
                        ? 'border-red-500 bg-red-50/40 dark:bg-red-950/30'
                        : 'border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/40'
                }`}
            >
                {items.map((src, idx) => {
                    const isDraggingThis = draggedIndex === idx;
                    const isTarget = dragOverIndex === idx && !isDraggingThis;

                    return (
                        <div
                            key={idx}
                            draggable
                            onDragStart={(e) => handleDragStart(e, idx)}
                            onDragOver={(e) => handleDragOverItem(e, idx)}
                            onDrop={(e) => handleDropItem(e, idx)}
                            onDragEnd={handleDragEnd}
                            className={`group relative rounded-xl overflow-hidden border bg-white dark:bg-gray-900 shadow-2xs transition-all cursor-grab active:cursor-grabbing select-none ${
                                isDraggingThis
                                    ? 'opacity-40 scale-95 border-dashed border-red-500'
                                    : isTarget
                                      ? 'border-red-500 ring-2 ring-red-400 scale-102'
                                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-400'
                            }`}
                        >
                            {/* Image Aspect Box */}
                            <div className="aspect-16/10 w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                                <img
                                    src={src}
                                    alt={`Ảnh ${idx + 1}`}
                                    className="h-full w-full object-cover pointer-events-none"
                                />
                            </div>

                            {/* Badge order number */}
                            <div className="absolute top-1.5 left-1.5 z-10">
                                {idx === 0 ? (
                                    <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-red-600 text-white text-[10px] font-bold shadow-xs">
                                        <Star size={10} fill="white" />
                                        #1 Bìa
                                    </span>
                                ) : (
                                    <span className="px-1.5 py-0.5 rounded-md bg-black/60 text-white text-[10px] font-medium backdrop-blur-xs">
                                        #{idx + 1}
                                    </span>
                                )}
                            </div>

                            {/* Delete button */}
                            <button
                                type="button"
                                onClick={() => handleRemove(idx)}
                                className="absolute top-1.5 right-1.5 z-10 p-1 rounded-md bg-black/60 hover:bg-red-600 text-white transition-colors cursor-pointer"
                                title="Xóa ảnh này"
                            >
                                <Trash2 size={12} />
                            </button>

                            {/* Bottom bar with move arrows & drag grip */}
                            <div className="p-1.5 bg-white/95 dark:bg-gray-900/95 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs text-gray-500">
                                <button
                                    type="button"
                                    onClick={() => handleMove(idx, idx - 1)}
                                    disabled={idx === 0}
                                    className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 cursor-pointer"
                                    title="Di chuyển sang trái"
                                >
                                    <ChevronLeft size={14} />
                                </button>
                                <div className="flex items-center gap-1 text-[11px] text-gray-400">
                                    <GripVertical size={13} />
                                    <span>Kéo</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleMove(idx, idx + 1)}
                                    disabled={idx === items.length - 1}
                                    className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 cursor-pointer"
                                    title="Di chuyển sang phải"
                                >
                                    <ChevronRight size={14} />
                                </button>
                            </div>
                        </div>
                    );
                })}

                {/* Upload More Card */}
                <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    disabled={uploading}
                    className="aspect-16/10 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-red-500 dark:hover:border-red-400 bg-white/70 dark:bg-gray-900/50 hover:bg-red-50/20 text-gray-600 dark:text-gray-300 transition-all cursor-pointer p-3"
                >
                    {uploading ? (
                        <>
                            <RefreshCw size={20} className="animate-spin text-red-600 mb-1" />
                            <span className="text-[11px] font-medium text-center">{uploadProgress || 'Đang tải...'}</span>
                        </>
                    ) : (
                        <>
                            <div className="h-8 w-8 rounded-full bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center mb-1">
                                <Plus size={18} />
                            </div>
                            <span className="text-xs font-semibold text-gray-700 dark:text-gray-200">
                                Thêm ảnh
                            </span>
                            <span className="text-[10px] text-gray-400 text-center">
                                Chọn nhiều ảnh
                            </span>
                        </>
                    )}
                </button>
            </div>

            {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
        </div>
    );
};

export default GalleryUpload;
