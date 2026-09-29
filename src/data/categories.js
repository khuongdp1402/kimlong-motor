// Static category metadata (labels/descriptions) used to group products
// fetched from the API by their `category` field. Product content itself
// comes from the API/admin — this file only supplies presentation labels.
// Categories match the real kimlongmiennam.com "Sản Phẩm" submenu.
import { landingCategories } from './landingCategories';

export const productCategories = [
    {
        id: 'xe-khach',
        name: 'Xe Khách',
        slug: 'xe-khach',
        description: 'Xe khách Kim Long các dòng ghế ngồi và giường nằm, đa dạng số chỗ.',
    },
    {
        id: 'xe-van',
        name: 'Xe Van',
        slug: 'xe-van',
        description: 'Xe van chở khách và chở hàng linh hoạt, tiết kiệm nhiên liệu.',
    },
    {
        id: 'xe-bus',
        name: 'Xe Bus',
        slug: 'xe-bus',
        description: 'Xe bus đô thị Kim Long, vận hành bền bỉ trên mọi tuyến đường.',
    },
    {
        id: 'xe-tai',
        name: 'Xe Tải',
        slug: 'xe-tai',
        description: 'Xe tải Kim Long Kim An đa dạng tải trọng và kiểu thùng.',
    },
    {
        id: 'xe-dien',
        name: 'Xe Điện',
        slug: 'xe-dien',
        description: 'Dòng xe điện GK48EV, B40 EV, B30 EV - giải pháp vận tải xanh.',
    },
];

// The catalogue was re-tagged onto the landing page's five slugs (see
// scripts/retag-product-categories.mjs), so a lookup by the old slugs now
// misses. Falling back to the live taxonomy keeps /category/:slug and the
// product breadcrumbs working instead of showing an empty page or leaking a
// raw slug like "ghe-ngoi" into the UI.
const fromLandingTaxonomy = (slug) => {
    const match = landingCategories.find((c) => c.slug === slug);
    return match && { id: match.slug, slug: match.slug, name: match.name, description: '' };
};

export const getCategoryBySlug = (slug) =>
    productCategories.find((c) => c.slug === slug) || fromLandingTaxonomy(slug);
export const getCategoryById = (id) =>
    productCategories.find((c) => c.id === id) || fromLandingTaxonomy(id);
