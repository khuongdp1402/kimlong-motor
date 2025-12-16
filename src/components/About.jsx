import React from 'react';

const About = () => {
    return (
        <section id="about" className="py-16 bg-white dark:bg-gray-900 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl uppercase">
                        Giới thiệu Kim Long Motor
                    </h2>
                </div>
                <div className="max-w-4xl mx-auto">
                    <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                        Kim Long Motor là một trong những thương hiệu hàng đầu tại Việt Nam trong lĩnh vực sản xuất và phân phối các dòng xe thương mại như xe bus, xe tải và các loại xe mini bus. Với hơn 20 năm kinh nghiệm, chúng tôi cam kết cung cấp những sản phẩm chất lượng cao, bền bỉ và đáp ứng nhu cầu đa dạng của khách hàng.
                    </p>
                    <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                        Chúng tôi luôn đặt khách hàng lên hàng đầu, cung cấp dịch vụ hậu mãi chuyên nghiệp, hỗ trợ vay vốn ngân hàng và bảo hành chính hãng. Đội ngũ kỹ thuật viên và nhân viên bán hàng của chúng tôi luôn sẵn sàng tư vấn và hỗ trợ bạn trong mọi khâu từ lựa chọn sản phẩm đến bảo trì, bảo dưỡng.
                    </p>
                    <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                        Hãy liên hệ với chúng tôi để biết thêm chi tiết về các dòng sản phẩm, chương trình khuyến mãi và dịch vụ hỗ trợ.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default About;
