// The product taxonomy for the landing page's category tabs, and the single
// source of truth for it. A product's `category` field holds one of these
// slugs; admin writes them directly and scripts/retag-product-categories.mjs
// moved the original scraped catalogue onto them.
export const landingCategories = [
    { slug: 'giuong-nam', name: 'Xe Giường Nằm' },
    { slug: 'ghe-ngoi', name: 'Xe Ghế Ngồi' },
    { slug: 'van', name: 'Xe Van' },
    { slug: 'tai', name: 'Xe Tải' },
    { slug: 'dau-keo', name: 'Xe Đầu Kéo' },
    { slug: 'xe-dien', name: 'Xe Điện EV' },
];

export const getLandingCategoryName = (slug) =>
    landingCategories.find((c) => c.slug === slug)?.name || slug;

export const isLandingCategory = (slug) =>
    landingCategories.some((c) => c.slug === slug);
