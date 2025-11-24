import React from 'react';

const AboutPage = () => {
    return (
        <div className="pt-24 pb-16 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl uppercase mb-8">
                    Giới thiệu Kim Long Motor
                </h1>
                <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
                    Kim Long Motor là một trong những thương hiệu hàng đầu tại Việt Nam trong lĩnh vực sản xuất và phân phối các dòng xe thương mại như xe bus, xe tải và các loại xe mini bus. Với hơn 20 năm kinh nghiệm, chúng tôi cam kết cung cấp những sản phẩm chất lượng cao, bền bỉ và đáp ứng nhu cầu đa dạng của khách hàng.
                </p>
                <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
                    Chúng tôi luôn đặt khách hàng lên hàng đầu, cung cấp dịch vụ hậu mãi chuyên nghiệp, hỗ trợ vay vốn ngân hàng và bảo hành chính hãng. Đội ngũ kỹ thuật viên và nhân viên bán hàng của chúng tôi luôn sẵn sàng tư vấn và hỗ trợ bạn trong mọi khâu từ lựa chọn sản phẩm đến bảo trì, bảo dưỡng.
                </p>
                <p className="text-lg text-gray-700 dark:text-gray-300">
                    Hãy liên hệ với chúng tôi để biết thêm chi tiết về các dòng sản phẩm, chương trình khuyến mãi và dịch vụ hỗ trợ.
                </p>
            </div>
        </div>
    );
};

export default AboutPage;
