export const NEWS_CATEGORY_LABELS = {
    'tin-tuc': 'Tin tức',
    'thong-cao-bao-chi': 'Thông cáo báo chí',
    'hoat-dong-noi-bo': 'Hoạt động nội bộ',
};

export const getNewsCategoryLabel = (category) => NEWS_CATEGORY_LABELS[category] || category || 'Tin tức';
