// Fixed category taxonomy for the simple landing page's product tabs.
// A product's `category` field must match one of these slugs to show up
// under a given tab.
export const landingCategories = [
    { slug: 'giuong-nam', name: 'Xe Giường Nằm' },
    { slug: 'ghe-ngoi', name: 'Xe Ghế Ngồi' },
    { slug: 'van', name: 'Xe Van' },
    { slug: 'tai', name: 'Xe Tải' },
    { slug: 'dau-keo', name: 'Xe Đầu Kéo' },
];

export const getLandingCategoryName = (slug) =>
    landingCategories.find((c) => c.slug === slug)?.name || slug;

// Old products (created before this landing page existed) use a different,
// coarser taxonomy (xe-khach/xe-van/xe-tai/xe-bus/xe-dien — see
// src/data/categories.js). Rather than requiring every existing product to
// be re-tagged by hand, bucket them into the 5 landing-page tabs by category
// + a name-based heuristic, so the tabs show real inventory immediately.
// New products created going forward store one of the 5 slugs directly in
// `category`, which this function also passes through unchanged.
export const mapProductToLandingCategory = (product) => {
    const category = product?.category || '';
    if (landingCategories.some((c) => c.slug === category)) return category;

    if (category === 'xe-tai') return 'tai';
    if (category === 'xe-van' || category === 'xe-bus' || category === 'xe-dien') return 'van';

    if (category === 'xe-khach') {
        const name = product?.name || '';
        if (/giường/i.test(name)) return 'giuong-nam';
        if (/ghế|mini\s*bus/i.test(name)) return 'ghe-ngoi';
        // Kim Long's model codes: B*/G* prefixes are sleeper variants, N*/S* are seated.
        const codeMatch = name.match(/\b([BGNS])\d{2}\b/i);
        if (codeMatch) return /[BG]/i.test(codeMatch[1]) ? 'giuong-nam' : 'ghe-ngoi';
        return 'ghe-ngoi';
    }

    return category;
};
