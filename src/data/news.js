export const newsCategories = [
    { id: 'tin-tuc', name: 'Tin tức', slug: 'tin-tuc' },
    { id: 'kien-thuc', name: 'Kiến thức', slug: 'kien-thuc' },
    { id: 'khuyen-mai', name: 'Khuyến mãi', slug: 'khuyen-mai' },
    { id: 'su-kien', name: 'Sự kiện', slug: 'su-kien' },
];

export const newsArticles = [
    {
        id: 1,
        title: 'Kim Long Motor ra mắt dòng xe bus giường nằm thế hệ mới',
        slug: 'kim-long-motor-ra-mat-dong-xe-bus-giuong-nam-the-he-moi',
        category: 'tin-tuc',
        image: 'https://kimlongmiennam.com.vn/wp-content/uploads/2024/05/xe-khach-giuong-nam-kim-long-99-24-phong-1.jpg',
        excerpt: 'Dòng xe bus giường nằm cao cấp với thiết kế hiện đại, tiện nghi sang trọng, đáp ứng nhu cầu ngày càng cao của hành khách.',
        content: `
      <h2>Giới thiệu dòng xe mới</h2>
      <p>Kim Long Motor tự hào giới thiệu dòng xe bus giường nằm thế hệ mới với nhiều cải tiến vượt trội về thiết kế, tiện nghi và công nghệ.</p>
      
      <h3>Những điểm nổi bật</h3>
      <ul>
        <li>Thiết kế nội thất sang trọng, hiện đại</li>
        <li>Ghế giường nằm cao cấp với khả năng điều chỉnh linh hoạt</li>
        <li>Hệ thống giải trí cá nhân cho mỗi hành khách</li>
        <li>Wifi miễn phí tốc độ cao</li>
        <li>Hệ thống điều hòa thông minh</li>
      </ul>
      
      <h3>Công nghệ tiên tiến</h3>
      <p>Xe được trang bị động cơ Weichai mới nhất đáp ứng tiêu chuẩn khí thải Euro 5, vừa mạnh mẽ vừa tiết kiệm nhiên liệu.</p>
      
      <p>Hệ thống an toàn bao gồm camera 360 độ, cảm biến lùi, phanh ABS, và nhiều tính năng an toàn khác.</p>
    `,
        author: 'Kim Long Motor',
        date: '2025-04-25',
        featured: true,
    },
    {
        id: 2,
        title: 'Lễ bàn giao lô xe tải nặng cho đối tác chiến lược',
        slug: 'le-ban-giao-lo-xe-tai-nang-cho-doi-tac-chien-luoc',
        category: 'su-kien',
        image: 'https://kimlongmiennam.com.vn/wp-content/uploads/2024/05/ban-giao-xe-tai.jpg',
        excerpt: 'Kim Long Motor vừa tổ chức lễ bàn giao 50 xe tải nặng cho công ty vận tải Logistics hàng đầu Việt Nam.',
        content: `
      <h2>Sự kiện bàn giao</h2>
      <p>Trong buổi lễ trang trọng, Kim Long Motor đã bàn giao 50 xe tải nặng cho đối tác chiến lược.</p>
      
      <p>Đây là minh chứng cho sự tin tưởng của khách hàng đối với chất lượng sản phẩm và dịch vụ của Kim Long Motor.</p>
    `,
        author: 'Kim Long Motor',
        date: '2025-04-20',
        featured: false,
    },
    {
        id: 3,
        title: 'Chương trình khuyến mãi đặc biệt tháng 5',
        slug: 'chuong-trinh-khuyen-mai-dac-biet-thang-5',
        category: 'khuyen-mai',
        image: 'https://kimlongmiennam.com.vn/wp-content/uploads/2024/05/khuyen-mai-thang-5.jpg',
        excerpt: 'Ưu đãi lớn khi mua xe tải và xe bus trong tháng 5 với gói quà tặng trị giá lên đến 50 triệu đồng.',
        content: `
      <h2>Ưu đãi hấp dẫn</h2>
      <p>Nhân dịp kỷ niệm thành lập, Kim Long Motor triển khai chương trình khuyến mãi đặc biệt trong tháng 5.</p>
      
      <h3>Các ưu đãi bao gồm:</h3>
      <ul>
        <li>Giảm giá trực tiếp lên đến 100 triệu đồng</li>
        <li>Quà tặng phụ kiện trị giá 50 triệu đồng</li>
        <li>Hỗ trợ vay vốn lãi suất 0% trong 6 tháng đầu</li>
        <li>Bảo hành mở rộng lên 5 năm</li>
        <li>Miễn phí bảo dưỡng định kỳ 2 năm</li>
      </ul>
    `,
        author: 'Kim Long Motor',
        date: '2025-04-15',
        featured: true,
    },
    {
        id: 4,
        title: 'Xe khách giá rẻ - Lựa chọn thông minh cho doanh nghiệp',
        slug: 'xe-khach-gia-re-lua-chon-thong-minh',
        category: 'kien-thuc',
        image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2069',
        excerpt: 'Trong thời đại mà chi phí di chuyển ngày càng trở nên quan trọng, việc lựa chọn xe khách giá rẻ nhưng vẫn đảm bảo chất lượng là ưu tiên hàng đầu.',
        content: `
      <h2>Tại sao nên chọn xe khách giá rẻ?</h2>
      <p>Xe khách giá rẻ không có nghĩa là chất lượng kém. Kim Long Motor cung cấp các dòng xe với mức giá cạnh tranh nhưng vẫn đảm bảo chất lượng cao.</p>
      
      <h3>Lợi ích khi chọn xe khách Kim Long</h3>
      <ul>
        <li>Tiết kiệm chi phí đầu tư ban đầu</li>
        <li>Chi phí vận hành thấp</li>
        <li>Bảo hành chính hãng</li>
        <li>Phụ tùng dễ tìm</li>
        <li>Dịch vụ hậu mãi tốt</li>
      </ul>
    `,
        author: 'Chuyên gia Kim Long',
        date: '2025-04-10',
        featured: false,
    },
    {
        id: 5,
        title: 'Xe Kim Long 47 chỗ - Giải pháp vận tải hoàn hảo',
        slug: 'xe-kim-long-47-cho-giai-phap-van-tai-hoan-hao',
        category: 'kien-thuc',
        image: 'https://kimlongmiennam.com.vn/wp-content/uploads/2024/05/xe-khach-ghe-ngoi-kim-long-47.jpg',
        excerpt: 'Khi nhu cầu đầu tư vào xe khách chuyên dùng để phục vụ vận tải, xe Kim Long 47 chỗ là lựa chọn hàng đầu.',
        content: `
      <h2>Đặc điểm nổi bật</h2>
      <p>Xe Kim Long 47 chỗ được thiết kế đặc biệt cho các tuyến đường trung và dài với sức chứa lớn.</p>
      
      <h3>Ưu điểm vượt trội</h3>
      <ul>
        <li>Sức chứa lớn - tối ưu doanh thu</li>
        <li>Động cơ mạnh mẽ, bền bỉ</li>
        <li>Tiết kiệm nhiên liệu</li>
        <li>Ghế ngồi êm ái</li>
        <li>Hệ thống điều hòa mạnh mẽ</li>
      </ul>
    `,
        author: 'Chuyên gia Kim Long',
        date: '2025-04-05',
        featured: false,
    },
    {
        id: 6,
        title: 'Hội nghị khách hàng thường niên 2025',
        slug: 'hoi-nghi-khach-hang-thuong-nien-2025',
        category: 'su-kien',
        image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=2070',
        excerpt: 'Tri ân khách hàng đã đồng hành cùng Kim Long Motor trong suốt chặng đường phát triển vừa qua.',
        content: `
      <h2>Sự kiện tri ân</h2>
      <p>Hội nghị khách hàng thường niên là dịp để Kim Long Motor gặp gỡ, tri ân và lắng nghe ý kiến từ khách hàng.</p>
      
      <p>Sự kiện quy tụ hơn 500 khách hàng từ khắp cả nước, tạo nên không khí giao lưu sôi nổi và ý nghĩa.</p>
    `,
        author: 'Kim Long Motor',
        date: '2025-04-01',
        featured: false,
    },
];

export const getNewsById = (id) => {
    return newsArticles.find(n => n.id === parseInt(id));
};

export const getNewsBySlug = (slug) => {
    return newsArticles.find(n => n.slug === slug);
};

export const getNewsByCategory = (categoryId) => {
    return newsArticles.filter(n => n.category === categoryId);
};

export const getFeaturedNews = () => {
    return newsArticles.filter(n => n.featured);
};

export const getLatestNews = (limit = 3) => {
    return newsArticles.slice(0, limit);
};
