// Dữ liệu độc quyền và cá nhân hóa cho KIM LONG HỒNG THƯƠNG
// Hotline: 0379.398.798 - Dịch vụ: 0347.347.747
// Địa chỉ: 85 Đường Dẫn Cao Tốc HCM - Trung Lương, Xã Tân Nhựt, TP. HCM

export const businessInfo = {
    brandName: "KIM LONG HỒNG THƯƠNG",
    shortName: "Hồng Thương Kim Long",
    companyTitle: "ĐẠI LÝ PHÂN PHỐI XE THƯƠNG MẠI KIM LONG MOTOR CHÍNH HÃNG",
    consultantName: "Hồng Thương",
    consultantRole: "Phụ trách Kinh doanh & Báo giá trực tiếp Nhà máy",
    hotlineSales: "0379.398.798",
    hotlineSalesRaw: "0379398798",
    hotlineService: "0347.347.747",
    hotlineServiceRaw: "0347347747",
    address: "85 Đường Dẫn Cao Tốc HCM - Trung Lương, Xã Tân Nhựt, TP. Hồ Chí Minh",
    addressShort: "85 Đường Dẫn Cao Tốc HCM - Trung Lương, Xã Tân Nhựt, TP. HCM",
    youtubeUrl: "https://youtube.com/@thuongkimlong?si=7U_NjVXhqbfC_Wji",
    tiktokUrl: "https://www.tiktok.com/@thuongkimlong?_r=1&_t=ZS-99C57vKr3ga",
    zaloUrl: "https://zalo.me/0379398798",
    logoUrl: "/images/logo-official.png",
    logoHorizontalUrl: "/images/logo-ngang-do.png"
};

export const carCategories = [
    { id: "all", name: "Tất Cả Dòng Xe" },
    { id: "giuong-nam", name: "Xe Khách Giường Nằm" },
    { id: "xe-ghe", name: "Xe Ghế" },
    { id: "van-dien", name: "Xe Van Điện" },
    { id: "xe-tai", name: "Xe Tải" },
    { id: "dau-keo-dien", name: "Xe Đầu Kéo Điện" }
];

export const carsData = [
    // 1. Xe khách giường nằm
    {
        id: "g24-giuong-nam",
        name: "KIM LONG 99 – G24 (24 Phòng VIP)",
        shortName: "Kim Long 99 – G24",
        category: "giuong-nam",
        categoryName: "Xe Khách Giường Nằm",
        price: "Giá xuất xưởng - Liên hệ",
        priceNote: "Hỗ trợ vay ngân hàng đến 85%",
        promoTag: "Ưu đãi 50 Triệu + Tặng phụ kiện",
        badge: "Chuyên Cơ Mặt Đất",
        rating: "5.0",
        reviews: "48",
        image: "/images/products/g24-giuong-nam.jpg",
        summary: "Dòng xe khách giường nằm cao cấp 24 cabin phòng VIP riêng biệt, thiết kế hiện đại chuẩn Châu Âu, mang lại trải nghiệm êm ái bậc nhất cho hành khách đường dài.",
        specsHighlights: [
            { label: "Quy cách", value: "24 Phòng VIP riêng biệt" },
            { label: "Động cơ", value: "Weichai WP12.375E50 (375 Mã lực)" },
            { label: "Kích thước", value: "12.200 x 2.500 x 3.650 mm" },
            { label: "Hệ thống treo", value: "6 bầu hơi êm ái cao cấp" },
            { label: "Tiêu chuẩn khí thải", value: "Euro 5 thân thiện môi trường" },
            { label: "Hộp số", value: "Fast Gear 6 số tiến, 1 số lùi" },
            { label: "Phanh an toàn", value: "Phanh đĩa trước sau + ABS + Phanh từ Retarder" },
            { label: "Hệ thống điện", value: "CAN-BUS điều khiển thông minh" }
        ],
        features: [
            "24 Cabin phòng độc lập có rèm kéo riêng tư, đèn đọc sách, cổng sạc Type-C/USB",
            "Màn hình giải trí Smart Android riêng cho từng phòng giường nằm",
            "Giường massage đa điểm cao cấp, đệm mút nhập khẩu chống đau mỏi",
            "Điều hòa trung tâm 2 chiều công suất lớn, cửa gió từng vị trí",
            "Khoang hành lý hầm thông suốt cực kỳ rộng rãi",
            "Hệ thống camera 360 độ giám sát hành trình an toàn"
        ]
    },
    {
        id: "g34-giuong-nam",
        name: "KIM LONG 99 – G34 (34 Phòng Máy Weichai / Yuchai)",
        shortName: "Kim Long 99 – G34",
        category: "giuong-nam",
        categoryName: "Xe Khách Giường Nằm",
        price: "Báo giá trực tiếp Nhà máy",
        priceNote: "Sẵn xe giao ngay - Trả trước 20%",
        promoTag: "Sẵn Xe Giao Ngay",
        badge: "Hiệu Quả Kinh Doanh",
        rating: "5.0",
        reviews: "62",
        image: "/images/products/g34-giuong-nam.jpg",
        summary: "Mẫu xe giường nằm 34 phòng kinh tế và hiệu quả hàng đầu cho các nhà xe liên tỉnh, tối ưu hóa công suất vận chuyển và tiết kiệm nhiên liệu vượt bậc.",
        specsHighlights: [
            { label: "Quy cách", value: "34 Phòng nằm cao cấp" },
            { label: "Động cơ", value: "Weichai WP10.375E50 / Yuchai YC6L330" },
            { label: "Công suất cực đại", value: "375 PS @ 1.900 vòng/phút" },
            { label: "Kích thước", value: "12.000 x 2.500 x 3.680 mm" },
            { label: "Hệ thống treo", value: "Bóng hơi khí nén chống rung lắc" },
            { label: "Dung tích bình dầu", value: "400 Lít hợp kim nhôm" },
            { label: "Lốp xe", value: "Michelin 12R22.5 không ruột" },
            { label: "Tiêu chuẩn khí thải", value: "Euro 5" }
        ],
        features: [
            "34 Giường bọc da cao cấp, kết cấu chắc chắn, cách âm xuất sắc",
            "Mỗi giường trang bị cổng sạc điện thoại, hộc để đồ cá nhân, đèn ngủ LED",
            "Hệ thống phanh điện tử ABS kết hợp bộ hãm thủy lực an toàn tuyệt đối khi đổ đèo",
            "Tủ lạnh mini 50L và hệ thống âm thanh giải trí sống động",
            "Khoang lái công thái học, ghế tài xế cân bằng hơi tự động giảm mệt mỏi",
            "Chế độ bảo hành chính hãng lên tới 3 năm hoặc 300.000 km"
        ]
    },

    // 2. Xe ghế
    {
        id: "n29-ghe-ngoi",
        name: "KIM LONG 99 – N29 (29 Ghế Universe)",
        shortName: "Kim Long 99 – N29",
        category: "xe-ghe",
        categoryName: "Xe Ghế",
        price: "Hỗ trợ trả góp chỉ từ 300Tr",
        priceNote: "Lãi suất ưu đãi cố định dài hạn",
        promoTag: "Trợ Giá Trực Tiếp",
        badge: "Du Lịch & Hợp Đồng",
        rating: "5.0",
        reviews: "35",
        image: "/images/products/n29-ghe-ngoi.jpg",
        summary: "Xe khách 29 ghế ngồi Universe thiết kế khí động học Châu Âu sang trọng, phục vụ hoàn hảo cho du lịch lữ hành, đưa đón công nhân viên và tuyến cố định.",
        specsHighlights: [
            { label: "Số chỗ ngồi", value: "29 Chỗ (28 khách + 1 tài xế)" },
            { label: "Động cơ", value: "Weichai WP4.6NQ220E50 (Áo)" },
            { label: "Công suất", value: "220 Mã lực" },
            { label: "Kích thước", value: "9.100 x 2.450 x 3.350 mm" },
            { label: "Hệ thống treo", value: "Treo khí nén bóng hơi êm ái" },
            { label: "Tiêu hao nhiên liệu", value: "Khoảng 14-16 Lít / 100km" },
            { label: "Hộp số", value: "Cơ khí 6 số tiến 1 số lùi" },
            { label: "Điều hòa", value: "Điều hòa lốc đôi mát lạnh sâu" }
        ],
        features: [
            "Ghế ngồi kiểu Universe bọc da cao cấp, ngả lưng sâu tạo tư thế thoải mái",
            "Khoảng để chân rộng rãi, có gác chân và túi đựng đồ cá nhân",
            "Cửa lên xuống dạng xoay tự động đóng mở êm ái",
            "Hầm hàng mở kiểu trượt khóa nhôm thuận tiện bốc xếp hành lý",
            "Màn hình LCD 32 inch, micro không dây, dàn loa siêu trầm phục vụ văn nghệ",
            "Camera lùi và camera giám sát khoang khách tiêu chuẩn"
        ]
    },
    {
        id: "n47-ghe-ngoi",
        name: "KIM LONG 99 – N47 (47 Ghế Universe Đẳng Cấp)",
        shortName: "Kim Long 99 – N47",
        category: "xe-ghe",
        categoryName: "Xe Ghế",
        price: "Liên hệ nhận giá đại lý gốc",
        priceNote: "Tặng 100% lệ phí trước bạ",
        promoTag: "Tặng 100% Lệ Phí Trước Bạ",
        badge: "Vua Xe Khách Tuyến",
        rating: "5.0",
        reviews: "54",
        image: "/images/products/n47-ghe-ngoi.jpg",
        summary: "Siêu phẩm xe khách 47 ghế ngồi Universe Kim Long 99 trang bị động cơ Weichai 375HP cực kỳ khỏe khoắn, khung gầm Monocoque liền khối đạt độ an toàn tối đa.",
        specsHighlights: [
            { label: "Số chỗ ngồi", value: "47 Chỗ bọc da Universe cao cấp" },
            { label: "Động cơ", value: "Weichai WP12.375E50" },
            { label: "Công suất", value: "375 PS (Mạnh mẽ bền bỉ)" },
            { label: "Kích thước", value: "12.000 x 2.500 x 3.520 mm" },
            { label: "Khung gầm", value: "Monocoque công nghệ điện착 sơn tĩnh điện" },
            { label: "Hệ thống treo", value: "Bầu hơi Firestone USA" },
            { label: "Phanh", value: "ABS + ASR chống trượt" },
            { label: "Cỡ lốp", value: "12R22.5 lốp bố thép không săm" }
        ],
        features: [
            "Khoang hành khách rộng rãi bậc nhất phân khúc, trần xe LED vô cực lộng lẫy",
            "Ghế ngồi tựa lưng êm ái, bọc da vi sợi cao cấp chống bám bẩn",
            "Hệ thống lọc không khí ion âm khử mùi hiệu quả",
            "Hầm hành lý 3 khoang thông suốt cực đại chứa đồ thoải mái",
            "Gương chiếu hậu chỉnh điện sấy kính điện tử",
            "Hệ thống kiểm soát hành trình Cruise Control hỗ trợ tài xế đường dài"
        ]
    },
    {
        id: "n35-ghe-ngoi",
        name: "KIM LONG 29 – N35 (35 Ghế Tiện Nghi)",
        shortName: "Kim Long 29 – N35",
        category: "xe-ghe",
        categoryName: "Xe Ghế",
        price: "Ưu đãi đặc biệt tháng này",
        priceNote: "Giao xe tận nơi toàn quốc",
        promoTag: "Giao Xe Tận Nơi",
        badge: "Tối Ưu Doanh Thu",
        rating: "5.0",
        reviews: "29",
        image: "/images/products/n35-ghe-ngoi.png",
        summary: "Giải pháp hoàn hảo gia tăng số lượng ghế từ 29 lên 35 chỗ, giúp tối đa hóa doanh thu trên mỗi chuyến đi mà vẫn đảm bảo sự êm ái và vận hành bền bỉ.",
        specsHighlights: [
            { label: "Số chỗ ngồi", value: "35 Ghế ngồi cao cấp" },
            { label: "Động cơ", value: "Weichai Diesel Turbo Intercooler" },
            { label: "Kích thước", value: "9.300 x 2.450 x 3.380 mm" },
            { label: "Tiêu chuẩn khí thải", value: "Euro 5" },
            { label: "Hệ thống treo", value: "Bầu hơi khí nén" },
            { label: "Hộp số", value: "6 số tiến, 1 số lùi" }
        ],
        features: [
            "Bố trí hàng ghế khoa học, lối đi giữa thuận tiện",
            "Trang bị tiện nghi sạc điện thoại từng hàng ghế",
            "Hệ thống điều hòa làm lạnh nhanh chóng đều khắp xe",
            "Chi phí vận hành và bảo trì cực kỳ tiết kiệm"
        ]
    },
    {
        id: "x9-16cho",
        name: "KIM LONG X9 (Mini Bus 16 Chỗ Tiện Dụng)",
        shortName: "Kim Long X9 (16 Chỗ)",
        category: "xe-ghe",
        categoryName: "Xe Ghế",
        price: "Hỗ trợ vay 80% chỉ cần CCCD",
        priceNote: "Thủ tục nhanh nhận xe trong 3 ngày",
        promoTag: "Hotline 0379.398.798",
        badge: "Đưa Đón Linh Hoạt",
        rating: "5.0",
        reviews: "41",
        image: "/images/products/x9-van.png",
        summary: "Mini bus 16 chỗ hiện đại, trang bị cửa lùa điện, khoang lái và khoang khách rộng rãi, là sự thay thế lý tưởng cho các dòng xe 16 chỗ truyền thống.",
        specsHighlights: [
            { label: "Số chỗ ngồi", value: "16 Chỗ ngồi" },
            { label: "Động cơ", value: "Diesel thế hệ mới tiết kiệm nhiên liệu" },
            { label: "Cửa hành khách", value: "Cửa lùa tự động điện" },
            { label: "Kích thước", value: "5.990 x 2.040 x 2.680 mm" },
            { label: "Phanh an toàn", value: "ABS + EBD + ESP cân bằng điện tử" }
        ],
        features: [
            "Ghế ngồi bọc da cao cấp có tựa tay và ngả lưng",
            "Cửa lùa điện tự động mở có bậc lên xuống thông minh",
            "Khoang hành lý phía sau rộng rãi",
            "Bán kính quay vòng nhỏ, di chuyển cực kỳ linh hoạt trong đô thị"
        ]
    },

    // 3. Xe van điện
    {
        id: "gk48ev-van-dien",
        name: "XE VAN ĐIỆN KIM LONG GK 48EV",
        shortName: "Kim Long GK 48EV",
        category: "van-dien",
        categoryName: "Xe Van Điện",
        price: "Giá ưu đãi đợt 1 mở bán",
        priceNote: "Miễn 100% lệ phí trước bạ",
        promoTag: "100% Thuần Điện - Chạy Phố 24/7",
        badge: "Xu Hướng Tương Lai",
        rating: "5.0",
        reviews: "77",
        image: "/images/products/gk48ev-van-dien.jpg",
        summary: "Mẫu xe van thuần điện tiên phong tại Việt Nam, chạy phố 24/24 không cấm giờ, tiết kiệm hơn 70% chi phí nhiên liệu so với xe xăng dầu, bảo hành pin đến 8 năm.",
        specsHighlights: [
            { label: "Loại nhiên liệu", value: "100% Thuần điện (EV)" },
            { label: "Dung lượng pin", value: "48.8 kWh công nghệ CATL LFP" },
            { label: "Quãng đường di chuyển", value: "280 - 300 km / 1 lần sạc đầy" },
            { label: "Thời gian sạc", value: "Sạc nhanh DC 20% - 80% chỉ 40 phút" },
            { label: "Thể tích khoang hàng", value: "7.2 m³ cực kỳ rộng rãi" },
            { label: "Tải trọng cho phép", value: "945 kg (Chạy phố giờ cao điểm)" },
            { label: "Kích thước lòng thùng", value: "2.800 x 1.650 x 1.550 mm" },
            { label: "Bảo hành pin", value: "8 năm hoặc 200.000 km" }
        ],
        features: [
            "Được phép lưu thông vào nội đô thành phố 24/24 không lo cấm giờ cấm tải",
            "Chi phí vận hành chỉ 400 - 500đ / km, siêu tiết kiệm cho các đơn vị chuyển phát nhanh & logistics",
            "Miễn 100% thuế trước bạ xe điện theo chính sách ưu đãi của Nhà nước",
            "Sàn thùng inox lá me chống trượt, vách ngăn cabin kiên cố cách nhiệt cách âm",
            "Màn hình cảm ứng trung tâm giải trí tích hợp camera lùi sắc nét",
            "Hệ thống tái sinh năng lượng khi phanh giúp kéo dài quãng đường pin"
        ]
    },
    {
        id: "x9-van-tai",
        name: "KIM LONG VAN X9 (Bản Tải Nhẹ Đa Dụng)",
        shortName: "Kim Long Van X9",
        category: "van-dien",
        categoryName: "Xe Van Điện & Tải Nhẹ",
        price: "Báo giá trực tiếp 24/7",
        priceNote: "Sẵn xe đủ màu giao ngay",
        promoTag: "Linh Hoạt Trong Phố",
        badge: "Đa Dụng Đô Thị",
        rating: "5.0",
        reviews: "31",
        image: "/images/products/x9-van.png",
        summary: "Xe van đa dụng chuyên biệt cho dịch vụ giao hàng chặng cuối và thương mại điện tử, thiết kế cửa mở 2 bên và cửa sau 180 độ bốc xếp hàng dễ dàng.",
        specsHighlights: [
            { label: "Tải trọng hàng hóa", value: "945 kg chạy phố tự do" },
            { label: "Động cơ", value: "Động cơ bền bỉ, phun nhiên liệu điện tử" },
            { label: "Cửa bốc dỡ hàng", value: "Cửa trượt bên hông + cửa hậu 180°" },
            { label: "Thể tích thùng", value: "6.8 m³" },
            { label: "Tiêu chuẩn an toàn", value: "Phanh ABS, camera lùi" }
        ],
        features: [
            "Không bị cấm giờ cấm đường trong các đô thị lớn như TP.HCM",
            "Cabin 2 chỗ ngồi êm ái có điều hòa 2 chiều và trợ lực lái điện",
            "Khung gầm chịu lực chắc chắn, bảo dưỡng nhanh gọn",
            "Tối ưu chi phí cho các doanh nghiệp thương mại điện tử, bưu chính"
        ]
    },

    // 4. Xe tải
    {
        id: "kiman9-xe-tai-nhe",
        name: "XE TẢI NHẸ KIMAN9 (Thùng Lửng / Thùng Bạt / Thùng Kín)",
        shortName: "Xe Tải Kiman9",
        category: "xe-tai",
        categoryName: "Xe Tải",
        price: "Giá xuất xưởng - Chỉ từ 80Tr nhận xe",
        priceNote: "Hỗ trợ trả góp 85% - Không cần chứng minh thu nhập",
        promoTag: "Trả Trước 80 Triệu Nhận Xe",
        badge: "Bền Bỉ Vô Địch",
        rating: "5.0",
        reviews: "68",
        image: "/images/products/kiman9-xe-tai.png",
        summary: "Dòng xe tải nhẹ thế hệ mới KIMAN9 sản xuất trên dây chuyền hiện đại Kim Long Motor. Động cơ công nghệ Nhật Bản siêu bền, tiết kiệm nhiên liệu, thùng hàng dài 4.3m vượt trội.",
        specsHighlights: [
            { label: "Tải trọng cho phép", value: "1.99 Tấn / 2.45 Tấn (Vào TP)" },
            { label: "Tổng tải trọng", value: "4.990 kg" },
            { label: "Kích thước lòng thùng", value: "4.300 x 1.950 x 1.900 mm" },
            { label: "Động cơ", value: "Diesel 4 kỳ, 4 xi-lanh thẳng hàng, Turbo tăng áp" },
            { label: "Dung tích xi lanh", value: "2.771 cc" },
            { label: "Công suất", value: "115 Mã lực @ 3.200 vòng/phút" },
            { label: "Khung chassis", value: "Thép dập nguyên khối cường độ cao" },
            { label: "Lốp xe", value: "Lốp đôi cầu sau 7.00-16 chịu tải lớn" }
        ],
        features: [
            "Thùng hàng dài 4.3 mét chở được đa dạng mặt hàng cồng kềnh như sắt thép, pallet, bao bì",
            "Nội thất cabin hiện đại chuẩn xe du lịch: Điều hòa 2 chiều, kính chỉnh điện, khóa điện từ xa",
            "Màn hình LCD tích hợp camera lùi, đài radio FM, kết nối Bluetooth",
            "Chassi dập nguyên khối không mối hàn, chống vặn xoắn và chịu tải vượt trội",
            "Hỗ trợ đóng các loại thùng theo yêu cầu: Thùng lửng, mui bạt, thùng kín inox, bửng nâng",
            "Chính sách bảo hành lên tới 5 năm hoặc 150.000 km, phụ tùng giá gốc luôn sẵn có"
        ]
    },
    {
        id: "kiman9-thung-dong-lanh",
        name: "XE TẢI KIMAN9 THÙNG ĐÔNG LẠNH (Âm -18°C)",
        shortName: "Kiman9 Thùng Đông Lạnh",
        category: "xe-tai",
        categoryName: "Xe Tải",
        price: "Báo giá đóng thùng trọn gói",
        priceNote: "Đạt chuẩn vệ sinh an toàn thực phẩm",
        promoTag: "Hạ Nhiệt Cực Nhanh -18°C",
        badge: "Chuyên Chở Thủy Hải Sản",
        rating: "5.0",
        reviews: "26",
        image: "/images/products/kiman9-xe-tai.png",
        summary: "Xe tải đông lạnh KIMAN9 chuyên chở thủy hải sản tươi sống, thịt cá, nông sản, dược phẩm xuất khẩu, thùng composite đúc foam nhập khẩu giữ nhiệt tối ưu.",
        specsHighlights: [
            { label: "Tải trọng chở hàng", value: "1.990 kg vào phố thuận tiện" },
            { label: "Máy lạnh thùng", value: "Thermal Master / Hwasung Thermo Hàn Quốc" },
            { label: "Nhiệt độ làm lạnh", value: "Từ 0°C đến -18°C" },
            { label: "Chất liệu thùng", value: "Composite châu Âu đúc nguyên khối đổ Foam PU" },
            { label: "Sàn thùng", value: "Inox 304 dập sóng dập rãnh thoát nước" }
        ],
        features: [
            "Khả năng giữ nhiệt lâu và làm lạnh cực nhanh bảo vệ thực phẩm an toàn tuyệt đối",
            "Sàn thùng inox 304 chống rỉ sét bởi nước muối hải sản",
            "Cửa hông tiện lợi cho việc bốc dỡ hàng hóa nhanh",
            "Được ngân hàng hỗ trợ vay trọn gói cả xe và thùng đông lạnh"
        ]
    },

    // 5. Xe đầu kéo điện
    {
        id: "k9kev-dau-keo-dien",
        name: "KIMLONG K9KEV (Xe Đầu Kéo Thuần Điện Đầu Tiên Việt Nam)",
        shortName: "Kimlong K9KEV",
        category: "dau-keo-dien",
        categoryName: "Xe Đầu Kéo Điện",
        price: "Nhận đặt cọc & tư vấn trạm sạc",
        priceNote: "Tiên phong giải pháp logistics xanh Net Zero",
        promoTag: "Đầu Kéo Thuần Điện 815 Mã Lực",
        badge: "Siêu Phẩm Tiên Phong",
        rating: "5.0",
        reviews: "95",
        image: "/images/products/k9kev-dau-keo-dien.jpg",
        summary: "Siêu phẩm xe đầu kéo thuần điện KIMLONG K9KEV đầu tiên mang thương hiệu Việt Nam. Công suất cực đại lên tới 815 Mã lực, pin 423kWh LFP, sạc nhanh kép công suất cao, tối ưu chi phí vận hành cho cảng biển và doanh nghiệp logistics lớn.",
        specsHighlights: [
            { label: "Động cơ điện", value: "Motor điện nam châm vĩnh cửu kép (Permanent Magnet)" },
            { label: "Công suất cực đại", value: "600 kW (~ 815 Mã lực)" },
            { label: "Mô-men xoắn cực đại", value: "2.800 Nm (Kéo tải tức thì)" },
            { label: "Dung lượng pin", value: "423 kWh Pin CATL Lithium Iron Phosphate (LFP)" },
            { label: "Quãng đường di chuyển", value: "350 - 400 km / 1 lần sạc đầy" },
            { label: "Hệ thống sạc", value: "Sạc nhanh cổng kép CCS2 (20-80% trong 45 phút)" },
            { label: "Sức kéo cho phép", value: "Khối lượng kéo theo lên tới 40 Tấn" },
            { label: "Cấu hình truyền động", value: "Hộp số điện tử 4 cấp chuyên dụng cho xe điện" }
        ],
        features: [
            "Xe đầu kéo thuần điện thương hiệu Việt Nam sản xuất tại Khu kinh tế Chân Mây - Lăng Cô (Huế)",
            "Tiết kiệm đến 60% chi phí nhiên liệu và bảo dưỡng so với xe đầu kéo máy dầu truyền thống",
            "Không khói bụi, không tiếng ồn, thân thiện môi trường chuẩn mục tiêu Net Zero 2050",
            "Cabin cao cấp treo bóng hơi 4 điểm, ghế tài xế massage, giường nằm đôi tiện nghi",
            "Tích hợp hệ thống an toàn chủ động ADAS thông minh: Cảnh báo va chạm, giữ làn đường, phanh khẩn cấp tự động AEBS",
            "Kết nối đồng bộ với hệ sinh thái trạm sạc siêu nhanh công suất cao FUTA EV Power toàn quốc"
        ]
    },
    {
        id: "dau-keo-6x4-dien",
        name: "ĐẦU KÉO ĐIỆN 6X4 KIM LONG MOTOR (Thế Hệ Mới)",
        shortName: "Đầu Kéo Điện 6x4",
        category: "dau-keo-dien",
        categoryName: "Xe Đầu Kéo Điện",
        price: "Liên hệ Hotline tư vấn dự án",
        priceNote: "Giải pháp trạm sạc & đầu tư trọn gói",
        promoTag: "Cấu Hình Trục 6x4 Siêu Tải",
        badge: "Chuyên Vận Tải Nặng",
        rating: "5.0",
        reviews: "42",
        image: "/images/products/k9kev-dau-keo-dien.jpg",
        summary: "Dòng xe đầu kéo điện 3 cầu (6x4) thiết kế cho cung đường đèo dốc và tải trọng nặng, kết hợp các giải pháp pin thay thế nhanh và sạc siêu tốc.",
        specsHighlights: [
            { label: "Cấu hình trục", value: "6x4 (3 trục - 2 cầu chủ động)" },
            { label: "Công suất động cơ", value: "600 kW (815 HP)" },
            { label: "Khả năng kéo tải", value: "40.000 kg (40 Tấn)" },
            { label: "Công nghệ pin", value: "LFP chống cháy nổ tiêu chuẩn IP68" },
            { label: "Hệ thống phanh", value: "Phanh EBS + ESC cân bằng thân xe" }
        ],
        features: [
            "Cầu vi sai chịu tải cao phù hợp với đường sá Việt Nam",
            "Giảm xóc khí nén êm ái, bảo vệ hàng hóa giá trị cao",
            "Camera 360 độ và màn hình điều khiển kỹ thuật số trung tâm",
            "Đội ngũ kỹ thuật nhà máy hỗ trợ setup trạm sạc tận kho bãi doanh nghiệp"
        ]
    }
];

// Danh sách Video thực tế từ kênh Youtube của Hồng Thương
export const realVideos = [
    {
        id: "NYt3VQdhqMg",
        title: "Xe Điện 16 Chỗ KIMMAI9EV Chính Thức Nhận Cọc Với Mức Giá Ưu Đãi",
        author: "Thương Kim Long",
        youtubeUrl: "https://www.youtube.com/watch?v=NYt3VQdhqMg",
        thumbnailUrl: "https://i.ytimg.com/vi/NYt3VQdhqMg/hqdefault.jpg",
        tag: "Xe Điện 16 Chỗ",
        views: "Review Thực Tế"
    },
    {
        id: "ofepp6PDuC4",
        title: "Kim Mai 9 bản 16 ghế động cơ Yuchai đã có hàng cho anh em",
        author: "Thương Kim Long",
        youtubeUrl: "https://www.youtube.com/watch?v=ofepp6PDuC4",
        thumbnailUrl: "https://i.ytimg.com/vi/ofepp6PDuC4/hqdefault.jpg",
        tag: "Động Cơ Yuchai",
        views: "Sẵn Xe Giao Ngay"
    },
    {
        id: "yCzS8gzMsRU",
        title: "Xe Bus Kim Long từ 22 đến 34 giường đang có ưu đãi khủng",
        author: "Thương Kim Long",
        youtubeUrl: "https://www.youtube.com/watch?v=yCzS8gzMsRU",
        thumbnailUrl: "https://i.ytimg.com/vi/yCzS8gzMsRU/hqdefault.jpg",
        tag: "Xe Giường Nằm",
        views: "Ưu Đãi Đặc Biệt"
    },
    {
        id: "iDiMaWMdIDk",
        title: "Xe 29 chỗ Kim Long được trợ giá tốt cho khách hàng đầu tư",
        author: "Thương Kim Long",
        youtubeUrl: "https://www.youtube.com/watch?v=iDiMaWMdIDk",
        thumbnailUrl: "https://i.ytimg.com/vi/iDiMaWMdIDk/hqdefault.jpg",
        tag: "Xe Ghế Universe",
        views: "Trợ Giá Nhà Máy"
    }
];

// Cam kết & lý do chọn Hồng Thương Kim Long
export const trustPillars = [
    {
        icon: "ShieldCheck",
        title: "Giá Gốc Trực Tiếp Nhà Máy",
        description: "Báo giá xuất xưởng trực tiếp từ Nhà máy Kim Long Motor, không qua trung gian, cam kết mức giá và chính sách ưu đãi tốt nhất miền Nam."
    },
    {
        icon: "Banknote",
        title: "Hỗ Trợ Vay Đến 85% Giá Trị Xe",
        description: "Liên kết với các ngân hàng lớn (Vietcombank, BIDV, VPBank, TPBank...). Thủ tục hồ sơ nhanh gọn, xét duyệt trong 24h, lãi suất ưu đãi."
    },
    {
        icon: "Truck",
        title: "Sẵn Xe Đủ Màu - Giao Tận Nơi",
        description: "Hệ thống kho bãi sẵn xe đủ phiên bản, giao xe tận tay quý khách hàng trên toàn quốc, hỗ trợ đăng ký, đăng kiểm trọn gói từ A-Z."
    },
    {
        icon: "Wrench",
        title: "Dịch Vụ Hậu Mãi & Phụ Tùng 24/7",
        description: "Hotline Dịch vụ 0347.347.747 hoạt động 24/7. Cung cấp phụ tùng chính hãng Kim Long Motor với giá gốc, bảo hành bảo dưỡng lưu động tận nơi."
    }
];
