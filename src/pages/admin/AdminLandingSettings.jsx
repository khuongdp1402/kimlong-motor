import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Check } from 'lucide-react';
import { getLandingBanner, putLandingBanner, getLandingSocial, putLandingSocial } from '../../api/client';
import { businessInfo } from '../../data/hongthuong-data';

// Defaults to the real Kim Long Motor channels (same ones used site-wide via
// businessInfo) so the admin sees actual data here instead of blank fields
// until they choose to override it.
const emptySocial = { youtubeUrl: businessInfo.youtubeUrl, tiktokUrl: businessInfo.tiktokUrl, youtubeVideos: [] };

// Static, non-video images available for the banner — pre-composed 9:16 crops
// (vehicle on top, clear space at the bottom for the text panel) generated
// from the originals in public/media/showcase. "No video" per the client's brief.
const MEDIA_IMAGES = [
    '/media/showcase/img_sciene1_9x16.jpg',
    '/media/showcase/img_sciene2_9x16.jpg',
    '/media/showcase/img_sciene3_9x16.jpg',
];

const emptySlide = { image: MEDIA_IMAGES[0], title: '', subtitle: '' };

const inputClass = 'block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500';

// Editable list of video URLs (used for both YouTube and TikTok) — add,
// edit, remove, one field per URL.
const VideoListField = ({ label, placeholder, videos, onChange }) => (
    <div>
        <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
            <button
                type="button"
                onClick={() => onChange([...videos, ''])}
                className="flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-800 dark:text-red-400"
            >
                <Plus size={14} /> Thêm video
            </button>
        </div>
        <div className="space-y-2">
            {videos.map((url, i) => (
                <div key={i} className="flex items-center gap-2">
                    <input
                        value={url}
                        onChange={(e) => onChange(videos.map((v, j) => (j === i ? e.target.value : v)))}
                        placeholder={placeholder}
                        className={inputClass}
                    />
                    <button
                        type="button"
                        onClick={() => onChange(videos.filter((_, j) => j !== i))}
                        className="shrink-0 text-red-600 hover:text-red-800 dark:text-red-400"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            ))}
            {videos.length === 0 && <p className="text-xs text-gray-400 dark:text-gray-500">Chưa có video nào.</p>}
        </div>
    </div>
);

const AdminLandingSettings = () => {
    const [slides, setSlides] = useState([]);
    const [social, setSocial] = useState(emptySocial);
    const [loading, setLoading] = useState(true);
    const [savingSlides, setSavingSlides] = useState(false);
    const [savingSocial, setSavingSocial] = useState(false);
    const [savedFlash, setSavedFlash] = useState('');

    useEffect(() => {
        Promise.all([getLandingBanner(), getLandingSocial()])
            .then(([landingBanner, landingSocial]) => {
                setSlides(Array.isArray(landingBanner) && landingBanner.length ? landingBanner : [emptySlide]);
                setSocial({
                    youtubeUrl: landingSocial?.youtubeUrl || businessInfo.youtubeUrl,
                    tiktokUrl: landingSocial?.tiktokUrl || businessInfo.tiktokUrl,
                    youtubeVideos: landingSocial?.youtubeVideos || [],
                });
            })
            .finally(() => setLoading(false));
    }, []);

    const flash = (label) => {
        setSavedFlash(label);
        setTimeout(() => setSavedFlash(''), 2000);
    };

    const updateSlide = (idx, patch) => {
        setSlides((prev) => prev.map((s, i) => (i === idx ? { ...s, ...patch } : s)));
    };

    const addSlide = () => setSlides((prev) => [...prev, { ...emptySlide }]);
    const removeSlide = (idx) => setSlides((prev) => prev.filter((_, i) => i !== idx));

    const handleSaveSlides = async () => {
        setSavingSlides(true);
        try {
            await putLandingBanner(slides);
            flash('slides');
        } catch (err) {
            alert(err.message);
        } finally {
            setSavingSlides(false);
        }
    };

    const handleSaveSocial = async () => {
        setSavingSocial(true);
        try {
            await putLandingSocial(social);
            flash('social');
        } catch (err) {
            alert(err.message);
        } finally {
            setSavingSocial(false);
        }
    };

    if (loading) return <p className="text-gray-500 dark:text-gray-400">Đang tải...</p>;

    return (
        <div className="space-y-10">
            <section>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Banner trang chủ</h2>
                    <button
                        onClick={addSlide}
                        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                        <Plus size={16} /> Thêm banner
                    </button>
                </div>

                <div className="space-y-4">
                    {slides.map((slide, idx) => (
                        <div key={idx} className="bg-white dark:bg-gray-800 rounded-lg shadow p-5 grid grid-cols-1 md:grid-cols-[220px_1fr] gap-5">
                            <div>
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Chọn ảnh</p>
                                <div className="grid grid-cols-3 gap-2">
                                    {MEDIA_IMAGES.map((img) => (
                                        <button
                                            key={img}
                                            type="button"
                                            onClick={() => updateSlide(idx, { image: img })}
                                            className={`relative h-16 rounded-md overflow-hidden border-2 ${slide.image === img ? 'border-red-600' : 'border-transparent'}`}
                                        >
                                            <img src={img} alt="" className="h-full w-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tiêu đề</label>
                                    <input value={slide.title || ''} onChange={(e) => updateSlide(idx, { title: e.target.value })} className={inputClass} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mô tả phụ</label>
                                    <input value={slide.subtitle || ''} onChange={(e) => updateSlide(idx, { subtitle: e.target.value })} className={inputClass} />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeSlide(idx)}
                                    disabled={slides.length <= 1}
                                    className="text-sm text-red-600 hover:text-red-800 dark:text-red-400 disabled:opacity-40 flex items-center gap-1"
                                >
                                    <Trash2 size={14} /> Xóa banner này
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    onClick={handleSaveSlides}
                    disabled={savingSlides}
                    className="mt-4 flex items-center gap-2 px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white disabled:opacity-60 transition-colors"
                >
                    {savedFlash === 'slides' ? <Check size={16} /> : null}
                    {savingSlides ? 'Đang lưu...' : savedFlash === 'slides' ? 'Đã lưu' : 'Lưu banner'}
                </button>
            </section>

            <section>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Mạng xã hội</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 max-w-lg">
                    Hotline <strong>{businessInfo.hotlineSales}</strong> và email <strong>info@miennamgroup.com.vn</strong> hiển thị ở mục Liên hệ trên trang chủ (không chỉnh ở đây).
                    Kênh YouTube/TikTok bên dưới mặc định là kênh chính thức Kim Long Motor — có thể đổi nếu cần.
                </p>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5 space-y-4 max-w-lg">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Link kênh YouTube</label>
                        <input
                            value={social.youtubeUrl || ''}
                            onChange={(e) => setSocial({ ...social, youtubeUrl: e.target.value })}
                            placeholder="https://youtube.com/@..."
                            className={inputClass}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Link kênh TikTok (dùng cho nút TikTok)</label>
                        <input
                            value={social.tiktokUrl || ''}
                            onChange={(e) => setSocial({ ...social, tiktokUrl: e.target.value })}
                            placeholder="https://www.tiktok.com/@..."
                            className={inputClass}
                        />
                    </div>

                    <VideoListField
                        label="Video YouTube hiển thị trên trang chủ"
                        placeholder="https://www.youtube.com/watch?v=..."
                        videos={social.youtubeVideos || []}
                        onChange={(youtubeVideos) => setSocial({ ...social, youtubeVideos })}
                    />

                    <button
                        onClick={handleSaveSocial}
                        disabled={savingSocial}
                        className="flex items-center gap-2 px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white disabled:opacity-60 transition-colors"
                    >
                        {savedFlash === 'social' ? <Check size={16} /> : null}
                        {savingSocial ? 'Đang lưu...' : savedFlash === 'social' ? 'Đã lưu' : 'Lưu mạng xã hội'}
                    </button>
                </div>
            </section>
        </div>
    );
};

export default AdminLandingSettings;
