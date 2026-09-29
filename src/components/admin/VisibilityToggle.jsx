import React from 'react';
import { Eye, EyeOff } from 'lucide-react';

// The switch that decides whether an item appears on the landing page. It is
// stored as `featured` for historical reasons, but nothing in the admin UI
// says "nổi bật" any more — what an editor needs to know is simply whether
// visitors can see this item, so the control says exactly that, in words
// rather than as a star whose meaning has to be guessed.
const VisibilityToggle = ({ visible, onToggle }) => (
    <button
        onClick={onToggle}
        title={visible ? 'Đang hiển thị trên trang chủ — bấm để ẩn' : 'Đang ẩn — bấm để hiển thị trên trang chủ'}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${
            visible
                ? 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/40 dark:text-green-400'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400'
        }`}
    >
        {visible ? <Eye size={13} /> : <EyeOff size={13} />}
        {visible ? 'Hiển thị' : 'Ẩn'}
    </button>
);

export default VisibilityToggle;
