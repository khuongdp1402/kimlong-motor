import React, { useMemo, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronRight, Phone, Star, ShieldCheck, Calculator } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FloatingButtons from '../components/FloatingButtons';
import ContactPopup from '../components/ContactPopup';
import { getCategoryById } from '../data/categories';
import { useApiData } from '../hooks/useApiData';
import { getProducts, getArticles } from '../api/client';
import { useCountdown, getPromoEndDate } from '../hooks/useCountdown';
import { calcInstallment, calcRollingCost, formatVnd } from '../utils/loanCalculator';

const HOTLINE = '0379398798';
const HOTLINE_DISPLAY = '0379.398.798';

// Six spec keys shown as "Thông Số Nổi Bật" icon tiles — matches the real
// site's highlighted-spec tile grid on the product detail page (real data
// comes from each product's `highlights` array, already scraped).
const SPEC_ICON_LABELS = ['Động cơ', 'Công suất', 'Số chỗ ngồi', 'Nhiên liệu', 'Khối lượng', 'Kích thước'];

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: products, loading } = useApiData(getProducts, []);
    const { data: articles } = useApiData(getArticles, []);
    const product = (products || []).find((p) => String(p.id) === String(id) || p.slug === id);

    const [popupOpen, setPopupOpen] = useState(false);
    const [activeImage, setActiveImage] = useState(0);
    const [showFullSpecs, setShowFullSpecs] = useState(false);

    const [vayPercent, setVayPercent] = useState(70);
    const [years, setYears] = useState(5);
    const [ratePercent, setRatePercent] = useState(8.0);

    const promoEndTime = useMemo(() => getPromoEndDate(product), [product]);
    const countdown = useCountdown(promoEndTime);

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="pt-24 pb-16 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500 dark:text-gray-400">Đang tải...</div>
                </div>
                <Footer />
            </>
        );
    }

    if (!product) {
        return (
            <>
                <Navbar />
                <div className="pt-24 pb-16 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Không tìm thấy sản phẩm</h1>
                        <Link to="/" className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 font-semibold">
                            &larr; Quay lại trang chủ
                        </Link>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    const category = getCategoryById(product.category);
    const categoryName = category ? category.name : product.category;
    const gallery = product.gallery && product.gallery.length > 0 ? product.gallery : [product.image];
    const relatedProducts = (products || [])
        .filter((p) => p.category === product.category && p.id !== product.id)
        .slice(0, 4);
    const relatedArticle = (articles || []).find((a) =>
        (a.title || '').toLowerCase().includes((product.name || '').split(' – ')[0].split(' ').slice(-1)[0]?.toLowerCase() || '###')
    ) || (articles || [])[0];

    // "Giá niêm yết" vs "giá bán": the scraped price is the listed/sale price;
    // for the strikethrough "original price" we only show one if the product
    // has a distinct listPrice captured — otherwise we do not fabricate a markup.
    const originalPrice = product.originalPrice && product.originalPrice > product.price ? product.originalPrice : null;
    const savings = originalPrice ? originalPrice - product.price : null;

    const ratingValue = parseFloat((product.rating || '0').split('/')[0]) || 0;
    const ratingCount = product.reviewCount || null;

    const installment = calcInstallment(product.price, vayPercent, years, ratePercent);
    const rollingCost = calcRollingCost(product.price);

    const visibleSpecs = showFullSpecs ? product.specs : (product.specs || []).slice(0, 8);

    const handleOpenPopup = () => setPopupOpen(true);

    return (
        <>
            <Navbar />
            <div className="pt-20 min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
                {/* Breadcrumb */}
                <div className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 transition-colors duration-300">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                        <nav className="flex items-center flex-wrap gap-1 text-sm text-gray-500 dark:text-gray-400">
                            <Link to="/" className="hover:text-red-600 dark:hover:text-red-400">Trang chủ</Link>
                            <ChevronRight size={14} />
                            <Link to={`/category/${category?.slug || product.category}`} className="hover:text-red-600 dark:hover:text-red-400">Sản phẩm</Link>
                            <ChevronRight size={14} />
                            <span className="hover:text-red-600 dark:hover:text-red-400">Kim Long Motor</span>
                            <ChevronRight size={14} />
                            <span className="text-gray-800 dark:text-gray-200 font-medium truncate max-w-xs">{product.name}</span>
                        </nav>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Title block */}
                    <div className="mb-6">
                        <span className="inline-block text-xs font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 px-3 py-1 rounded-full uppercase mb-3">
                            {categoryName}
                        </span>
                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white uppercase leading-tight">
                            {product.name}
                        </h1>
                        <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-gray-500 dark:text-gray-400">
                            {product.code && <span>Mã dòng xe: <strong className="text-gray-800 dark:text-gray-200">{product.code}</strong></span>}
                            {ratingValue > 0 && (
                                <span className="flex items-center gap-1">
                                    <span className="flex text-yellow-400">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <Star key={i} size={14} fill={i < Math.round(ratingValue) ? 'currentColor' : 'none'} />
                                        ))}
                                    </span>
                                    <strong className="text-gray-800 dark:text-gray-200">{product.rating}</strong>
                                    {ratingCount && <span className="text-xs">({ratingCount} đánh giá)</span>}
                                </span>
                            )}
                        </div>
                        {product.badges && product.badges.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-4">
                                {product.badges.map((b, i) => (
                                    <span
                                        key={i}
                                        className={`text-xs font-bold uppercase px-3 py-1.5 rounded-full ${i === 0 ? 'bg-red-600 text-white' : 'bg-gray-900 dark:bg-gray-700 text-white'}`}
                                    >
                                        {b}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* LEFT: gallery + content */}
                        <div className="lg:col-span-2">
                            {/* Gallery */}
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 mb-8 transition-colors duration-300">
                                <div className="w-full aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 mb-3">
                                    <img
                                        src={gallery[activeImage]}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex gap-2 overflow-x-auto pb-1">
                                    {gallery.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setActiveImage(idx)}
                                            className={`flex-shrink-0 w-20 h-16 rounded-md overflow-hidden border-2 transition-colors ${activeImage === idx ? 'border-red-600' : 'border-transparent opacity-70 hover:opacity-100'}`}
                                        >
                                            <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Description */}
                            {product.descriptionHtml ? (
                                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-8 transition-colors duration-300">
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Mô Tả Sản Phẩm</h2>
                                    <div
                                        className="prose prose-sm dark:prose-invert max-w-none prose-headings:text-gray-900 dark:prose-headings:text-white prose-headings:font-bold prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed prose-img:rounded-lg"
                                        dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
                                    />
                                </div>
                            ) : (
                                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-8 transition-colors duration-300">
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Mô Tả Sản Phẩm</h2>
                                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">{product.description}</p>
                                </div>
                            )}

                            {/* Thông Số Nổi Bật */}
                            {product.highlights && product.highlights.length > 0 && (
                                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-8 transition-colors duration-300">
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Thông Số Nổi Bật</h2>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {product.highlights.slice(0, 6).map((h, i) => (
                                            <div key={i} className="flex items-start gap-3 bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                                                <div className="w-9 h-9 rounded-full bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 flex items-center justify-center flex-shrink-0 font-bold text-sm">
                                                    {i + 1}
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">{SPEC_ICON_LABELS[i] || h.label}</div>
                                                    <div className="text-sm font-semibold text-gray-900 dark:text-white break-words">{h.value}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {product.specs?.some((s) => s.label.toLowerCase().includes('bảo hành')) && (
                                        <div className="mt-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 flex items-center gap-3">
                                            <ShieldCheck className="text-amber-600 dark:text-amber-400 flex-shrink-0" size={22} />
                                            <span className="text-sm text-amber-800 dark:text-amber-300 font-medium">
                                                Bảo hành chính hãng: {product.specs.find((s) => s.label.toLowerCase().includes('bảo hành'))?.value}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Dự Toán Trả Góp Mua Xe — real interactive calculator */}
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-8 transition-colors duration-300">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                    <Calculator className="text-red-600 dark:text-red-400" size={22} />
                                    Dự Toán Trả Góp Mua Xe
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <div>
                                            <div className="flex justify-between text-sm mb-2">
                                                <span className="text-gray-600 dark:text-gray-400">Tỷ lệ vay ngân hàng</span>
                                                <span className="font-bold text-gray-900 dark:text-white">{vayPercent}%</span>
                                            </div>
                                            <input
                                                type="range" min={30} max={80} step={5}
                                                value={vayPercent}
                                                onChange={(e) => setVayPercent(Number(e.target.value))}
                                                className="w-full accent-red-600"
                                            />
                                        </div>
                                        <div>
                                            <div className="flex justify-between text-sm mb-2">
                                                <span className="text-gray-600 dark:text-gray-400">Thời hạn vay trả góp</span>
                                                <span className="font-bold text-gray-900 dark:text-white">{years} năm ({years * 12} tháng)</span>
                                            </div>
                                            <input
                                                type="range" min={1} max={7} step={1}
                                                value={years}
                                                onChange={(e) => setYears(Number(e.target.value))}
                                                className="w-full accent-red-600"
                                            />
                                        </div>
                                        <div>
                                            <div className="flex justify-between text-sm mb-2">
                                                <span className="text-gray-600 dark:text-gray-400">Lãi suất vay ước tính</span>
                                                <span className="font-bold text-gray-900 dark:text-white">{ratePercent.toFixed(1)}%/năm</span>
                                            </div>
                                            <input
                                                type="range" min={6.0} max={12.0} step={0.5}
                                                value={ratePercent}
                                                onChange={(e) => setRatePercent(Number(e.target.value))}
                                                className="w-full accent-red-600"
                                            />
                                        </div>
                                        <button
                                            onClick={handleOpenPopup}
                                            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-colors"
                                        >
                                            NHẬN BÁO GIÁ
                                        </button>
                                    </div>
                                    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 text-white">
                                        <p className="text-gray-300 text-sm mb-1">Ước tính trả tháng đầu (gốc + lãi)</p>
                                        <h3 className="text-2xl font-extrabold mb-4">{formatVnd(installment.firstMonthTotal)}</h3>
                                        <div className="space-y-2 text-sm border-t border-white/10 pt-4">
                                            <div className="flex justify-between">
                                                <span className="text-gray-300">Số tiền tự chuẩn bị:</span>
                                                <strong>{formatVnd(installment.prepaidAmount)}</strong>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-300">Số tiền vay ngân hàng:</span>
                                                <strong>{formatVnd(installment.loanAmount)}</strong>
                                            </div>
                                            <div className="flex justify-between border-t border-dashed border-white/10 pt-2">
                                                <span className="text-gray-300">Tiền gốc trả hàng tháng:</span>
                                                <strong>{formatVnd(installment.monthlyPrincipal)}</strong>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-300">Tiền lãi tháng đầu tiên:</span>
                                                <strong>{formatVnd(installment.firstMonthInterest)}</strong>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-4">
                                    * Số liệu chỉ mang tính chất tham khảo, dựa trên phương án gốc chia đều hàng tháng và lãi tính trên dư nợ giảm dần. Vui lòng liên hệ hotline để được tư vấn chính xác theo chính sách ngân hàng liên kết.
                                </p>
                            </div>

                            {/* Full spec table */}
                            {product.specs && product.specs.length > 0 && (
                                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-8 transition-colors duration-300">
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Thông Số Kỹ Thuật</h2>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <tbody>
                                                {visibleSpecs.map((s, i) => (
                                                    <tr key={i} className={i % 2 === 0 ? 'bg-gray-50 dark:bg-gray-900' : ''}>
                                                        <td className="py-2.5 px-4 text-gray-500 dark:text-gray-400 w-1/2">{s.label}</td>
                                                        <td className="py-2.5 px-4 text-gray-900 dark:text-white font-semibold">{s.value}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    {product.specs.length > 8 && (
                                        <button
                                            onClick={() => setShowFullSpecs((v) => !v)}
                                            className="mt-4 text-red-600 dark:text-red-400 font-semibold text-sm hover:text-red-800 dark:hover:text-red-300"
                                        >
                                            {showFullSpecs ? 'Thu gọn thông số ↑' : 'Xem đầy đủ thông số →'}
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* Chi Phí Lăn Bánh Xe */}
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-8 transition-colors duration-300">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Chi Phí Lăn Bánh Xe</h2>
                                <table className="w-full text-sm">
                                    <tbody>
                                        <tr className="border-b border-gray-100 dark:border-gray-700">
                                            <td className="py-2.5 text-gray-600 dark:text-gray-400">Giá niêm yết xe</td>
                                            <td className="py-2.5 text-right font-semibold text-gray-900 dark:text-white">{formatVnd(rollingCost.carPrice)}</td>
                                        </tr>
                                        <tr className="border-b border-gray-100 dark:border-gray-700">
                                            <td className="py-2.5 text-gray-600 dark:text-gray-400">Thuế trước bạ (2%)</td>
                                            <td className="py-2.5 text-right font-semibold text-gray-900 dark:text-white">{formatVnd(rollingCost.regTax)}</td>
                                        </tr>
                                        <tr className="border-b border-gray-100 dark:border-gray-700">
                                            <td className="py-2.5 text-gray-600 dark:text-gray-400">Bảo hiểm vật chất (1.5%)</td>
                                            <td className="py-2.5 text-right font-semibold text-gray-900 dark:text-white">{formatVnd(rollingCost.physicalInsurance)}</td>
                                        </tr>
                                        <tr className="border-b border-gray-100 dark:border-gray-700">
                                            <td className="py-2.5 text-gray-600 dark:text-gray-400">Phí đăng ký biển số</td>
                                            <td className="py-2.5 text-right font-semibold text-gray-900 dark:text-white">{formatVnd(rollingCost.licensePlateFee)}</td>
                                        </tr>
                                        <tr className="border-b border-gray-100 dark:border-gray-700">
                                            <td className="py-2.5 text-gray-600 dark:text-gray-400">Phí sử dụng đường bộ (1 năm)</td>
                                            <td className="py-2.5 text-right font-semibold text-gray-900 dark:text-white">{formatVnd(rollingCost.roadUsageFee)}</td>
                                        </tr>
                                        <tr className="border-b border-gray-100 dark:border-gray-700">
                                            <td className="py-2.5 text-gray-600 dark:text-gray-400">Phí đăng kiểm</td>
                                            <td className="py-2.5 text-right font-semibold text-gray-900 dark:text-white">{formatVnd(rollingCost.inspectionFee)}</td>
                                        </tr>
                                        <tr className="border-b border-gray-100 dark:border-gray-700">
                                            <td className="py-2.5 text-gray-600 dark:text-gray-400">Bảo hiểm trách nhiệm dân sự</td>
                                            <td className="py-2.5 text-right font-semibold text-gray-900 dark:text-white">{formatVnd(rollingCost.civilLiabilityInsurance)}</td>
                                        </tr>
                                        <tr>
                                            <td className="py-2.5 text-gray-600 dark:text-gray-400">Chi phí dịch vụ & chi phí khác</td>
                                            <td className="py-2.5 text-right font-semibold text-gray-900 dark:text-white">{formatVnd(rollingCost.otherFee)}</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div className="mt-4 pt-4 border-t-2 border-red-100 dark:border-red-900/40 flex justify-between items-center">
                                    <span className="font-bold text-gray-900 dark:text-white">Tổng chi phí lăn bánh ước tính</span>
                                    <span className="text-xl font-extrabold text-red-600 dark:text-red-400">{formatVnd(rollingCost.total)}</span>
                                </div>
                            </div>

                            {/* CTA banner */}
                            <div className="border-2 border-dashed border-red-300 dark:border-red-800 rounded-xl p-8 text-center bg-white dark:bg-gray-800 mb-8 transition-colors duration-300">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Bạn muốn nhận giá tốt hơn?</h3>
                                <p className="text-gray-500 dark:text-gray-400 mb-5">
                                    Để lại thông tin, đội ngũ tư vấn Kim Long Miền Nam sẽ liên hệ gửi báo giá ưu đãi nhất.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                    <button
                                        onClick={handleOpenPopup}
                                        className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors"
                                    >
                                        Nhận báo giá ngay
                                    </button>
                                    <a
                                        href={`tel:${HOTLINE}`}
                                        className="inline-flex items-center justify-center px-6 py-3 rounded-full border-2 border-red-600 dark:border-red-500 text-red-600 dark:text-red-400 font-semibold hover:bg-red-600 hover:text-white transition-colors"
                                    >
                                        Hotline: {HOTLINE_DISPLAY}
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT: sticky sidebar */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-24 space-y-6">
                                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-colors duration-300">
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Giá Niêm Yết</p>
                                    {originalPrice && (
                                        <p className="text-sm text-gray-400 dark:text-gray-500 line-through">{originalPrice.toLocaleString('vi-VN')} đ</p>
                                    )}
                                    <p className="text-2xl font-extrabold text-red-600 dark:text-red-400 mb-1">{product.priceDisplay || 'Liên hệ'}</p>
                                    {savings && (
                                        <span className="inline-block bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-bold px-2 py-1 rounded">
                                            TIẾT KIỆM {savings.toLocaleString('vi-VN')}đ
                                        </span>
                                    )}

                                    {product.highlights && product.highlights.length > 0 && (
                                        <div className="mt-4 border-t border-gray-100 dark:border-gray-700 pt-4 space-y-2">
                                            {product.highlights.slice(0, 6).map((h, i) => (
                                                <div key={i} className="flex justify-between text-sm">
                                                    <span className="text-gray-500 dark:text-gray-400">{h.label}</span>
                                                    <span className="text-gray-900 dark:text-white font-medium text-right ml-2">{h.value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {product.specs?.some((s) => s.label.toLowerCase().includes('bảo hành')) && (
                                        <div className="mt-4 flex items-center gap-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-xs font-semibold px-3 py-2 rounded-lg">
                                            <ShieldCheck size={16} />
                                            {product.specs.find((s) => s.label.toLowerCase().includes('bảo hành'))?.value}
                                        </div>
                                    )}

                                    <button
                                        onClick={handleOpenPopup}
                                        className="w-full mt-5 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-extrabold py-3.5 rounded-lg transition-colors text-sm uppercase tracking-wide"
                                    >
                                        Nhận Báo Giá & Tư Vấn
                                    </button>
                                    <a
                                        href={`tel:${HOTLINE}`}
                                        className="w-full mt-3 flex items-center justify-center gap-2 bg-gray-900 dark:bg-gray-700 hover:bg-gray-800 dark:hover:bg-gray-600 text-white font-bold py-3 rounded-lg transition-colors"
                                    >
                                        <Phone size={18} />
                                        {HOTLINE_DISPLAY}
                                    </a>
                                </div>

                                {/* Countdown box */}
                                <div className="bg-yellow-400 rounded-xl p-5 text-center">
                                    <h4 className="font-extrabold text-gray-900 uppercase text-sm mb-3">
                                        Ưu Đãi Đến Ngày {new Date(promoEndTime).toLocaleDateString('vi-VN')}
                                    </h4>
                                    <div className="flex justify-center gap-2">
                                        {[
                                            ['Ngày', countdown.days],
                                            ['Giờ', countdown.hours],
                                            ['Phút', countdown.minutes],
                                            ['Giây', countdown.seconds],
                                        ].map(([label, value]) => (
                                            <div key={label} className="bg-gray-900 text-white rounded-lg px-3 py-2 min-w-[52px]">
                                                <div className="text-lg font-extrabold leading-none">{value}</div>
                                                <div className="text-[10px] uppercase mt-1 text-gray-300">{label}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Tin Tức Sản Phẩm mini card */}
                                {relatedArticle && (
                                    <Link
                                        to={`/news/${relatedArticle.slug || relatedArticle.id}`}
                                        className="block bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow"
                                    >
                                        <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase px-4 pt-4">Tin Tức Sản Phẩm</p>
                                        <div className="flex gap-3 p-4">
                                            {relatedArticle.image && (
                                                <img src={relatedArticle.image} alt={relatedArticle.title} className="w-20 h-16 object-cover rounded-lg flex-shrink-0" />
                                            )}
                                            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 line-clamp-3">{relatedArticle.title}</p>
                                        </div>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Related products */}
                    {relatedProducts.length > 0 && (
                        <div className="mt-16">
                            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white uppercase mb-8 text-center">Sản Phẩm Liên Quan</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {relatedProducts.map((rp) => (
                                    <div
                                        key={rp.id}
                                        className="group bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl overflow-hidden transition-all duration-300 transform hover:-translate-y-1 cursor-pointer flex flex-col border border-gray-100 dark:border-gray-700"
                                        onClick={() => navigate(`/product/${rp.slug || rp.id}`)}
                                    >
                                        <div className="relative w-full h-48 bg-gray-100 dark:bg-gray-700 overflow-hidden">
                                            <img src={rp.image} alt={rp.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                            {rp.badges?.[0] && (
                                                <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold uppercase px-2 py-1 rounded-full shadow">
                                                    {rp.badges[0]}
                                                </span>
                                            )}
                                        </div>
                                        <div className="p-4 flex-1 flex flex-col">
                                            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 min-h-[2.75rem]">{rp.name}</h3>
                                            <div className="mt-auto pt-2 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                                                <span className="text-red-600 dark:text-red-400 font-bold text-sm">{rp.priceDisplay || 'Liên hệ'}</span>
                                                <span className="text-red-600 dark:text-red-400 text-sm font-semibold group-hover:translate-x-1 transition-transform">Xem chi tiết →</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
            <FloatingButtons />
            <ContactPopup isOpen={popupOpen} onClose={() => setPopupOpen(false)} productName={product.name} />
        </>
    );
};

export default ProductDetail;
