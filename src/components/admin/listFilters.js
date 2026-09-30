// Filtering logic behind the admin list toolbars. Kept out of the component
// file so both admin pages share one definition of what a filter means — their
// counts and their rendered rows can then never disagree.

export const VISIBILITY_FILTERS = [
    { key: 'all', label: 'Tất cả' },
    { key: 'visible', label: 'Đang hiển thị' },
    { key: 'hidden', label: 'Đang ẩn' },
];

// `featured` is the stored name of the landing-page show/hide switch.
export function filterItems(items, { search, visibility, category }) {
    const q = search.trim().toLowerCase();
    return items.filter((item) => {
        if (visibility === 'visible' && !item.featured) return false;
        if (visibility === 'hidden' && item.featured) return false;

        if (category && category !== 'all') {
            if (category === 'xe-dien') {
                const isEv =
                    item.category === 'xe-dien' ||
                    item.category === 'ev' ||
                    /\b(ev|dien|điện)\b/i.test(`${item.name || ''} ${item.slug || ''}`) ||
                    /-ev\b/i.test(item.slug || '');
                if (!isEv) return false;
            } else if (item.category !== category) {
                return false;
            }
        }

        if (!q) return true;
        return `${item.name || item.title || ''}`.toLowerCase().includes(q);
    });
}

