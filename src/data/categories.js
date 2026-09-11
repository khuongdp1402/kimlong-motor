// Static category metadata (labels/descriptions) used to group products
// fetched from the API by their `category` field. Product content itself
// comes from the API/admin — this file only supplies presentation labels.
// Categories match the real kimlongmiennam.com "Sản Phẩm" submenu.
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

export const getCategoryBySlug = (slug) => productCategories.find((c) => c.slug === slug);
export const getCategoryById = (id) => productCategories.find((c) => c.id === id);
