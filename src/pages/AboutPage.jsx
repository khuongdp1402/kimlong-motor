import React from 'react';
import { Link } from 'react-router-dom';
import { Car, Wrench, Factory, Package, Truck, Bike, Phone, MapPin } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useApiData } from '../hooks/useApiData';
import { getAbout, getContact } from '../api/client';

const HOTLINE = '0379398798';
const HOTLINE_DISPLAY = '0379.398.798';

// Ecosystem tiles — real text scraped from the live /gioi-thieu "Hệ Sinh Thái
// Đa Ngành Của Tập Đoàn" section (about.content). Icons are presentational
// only; all copy is verbatim from the scrape.
const ECOSYSTEM_ICONS = [Car, Wrench, Factory, Package, Truck, Bike];

// The real about.content is one flat newline-separated scrape of the whole
// page (headings and paragraphs interleaved, no explicit section markers).
// We split it into the same sections the live page renders, using the real
// heading strings that appear verbatim in the text as anchors — no content
// is invented, only re-grouped for layout.
function parseAbout(content) {
    const lines = (content || '').split('\n').filter(Boolean);

    const idx = (needle) => lines.findIndex((l) => l === needle);
    const slice = (start, end) => (start === -1 ? [] : lines.slice(start, end === -1 ? undefined : end));

    const iEcosystem = idx('Hệ Sinh Thái Đa Ngành Của Tập Đoàn');
    const iMilestones = idx('Cột Mốc Phát Triển Ấn Tượng');
    const iStrategicMember = idx('Thành Viên Chiến Lược');
    const iScale = idx('Quy mô & Năng lực Phân phối');
    const iCatalog = idx('Danh Mục Sản Phẩm Chiến Lược');
    const iShowroomNetwork = idx('Mạng Lưới Showroom Hiện Đại');
    const iPartnership = idx('Hợp Tác Phát Triển Bền Vững Cùng Chúng Tôi');

    const intro = lines[0] || '';
    const mission = slice(idx('Khát vọng và Sứ mệnh vững bền'), iEcosystem);

    // Ecosystem: 6 tiles of [title, description] pairs following the heading.
    const ecosystemRaw = slice(iEcosystem + 1, iMilestones);
    const ecosystem = [];
    for (let i = 0; i < ecosystemRaw.length; i += 2) {
        if (ecosystemRaw[i] && ecosystemRaw[i + 1]) {
            ecosystem.push({ title: ecosystemRaw[i], description: ecosystemRaw[i + 1] });
        }
    }

    const milestones = slice(iMilestones + 1, iStrategicMember);

    const strategicMemberText = slice(iStrategicMember + 1, iScale);
    const scaleText = slice(iScale + 1, iCatalog);

    // Catalog: 4 cards of [category label, product name, description].
    const catalogRaw = slice(iCatalog + 1, iShowroomNetwork);
    const catalog = [];
    for (let i = 0; i < catalogRaw.length; i += 3) {
        if (catalogRaw[i] && catalogRaw[i + 1] && catalogRaw[i + 2]) {
            catalog.push({ label: catalogRaw[i], name: catalogRaw[i + 1], description: catalogRaw[i + 2] });
        }
    }

    // Showroom table: rows of [STT, name, status, address].
    const showroomRaw = slice(iShowroomNetwork + 1, iPartnership);
    const showroomRows = [];
    for (let i = 0; i < showroomRaw.length; i += 4) {
        if (showroomRaw[i + 1] && showroomRaw[i + 3]) {
            showroomRows.push({
                stt: showroomRaw[i],
                name: showroomRaw[i + 1],
                status: showroomRaw[i + 2],
                address: showroomRaw[i + 3],
            });
        }
    }

    const partnershipText = slice(iPartnership + 1);

    return { intro, mission, ecosystem, milestones, strategicMemberText, scaleText, catalog, showroomRows, partnershipText };
}

const AboutPage = () => {
    const { data: about, loading } = useApiData(getAbout, []);
    const { data: contact } = useApiData(getContact, []);
    const images = about?.images || [];
    const parsed = parseAbout(about?.content);

    return (
        <>
            <Navbar />
            <div className="pt-20 min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
                {/* Hero */}
                <section className="bg-white dark:bg-gray-800 transition-colors duration-300">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white uppercase leading-tight">
                                Kim Long Miền Nam
                                <span className="block text-red-600 dark:text-red-500">Vững Bước Tiên Phong</span>
                            </h1>
                            <p className="mt-4 text-gray-600 dark:text-gray-300 leading-relaxed">{parsed.intro}</p>
                            <button
                                onClick={() => document.getElementById('showroom-network')?.scrollIntoView({ behavior: 'smooth' })}
                                className="mt-6 inline-flex items-center justify-center px-7 py-3 rounded-full bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors"
                            >
                                Khám Phá Hệ Thống Showroom
                            </button>
                        </div>
                        <div className="relative rounded-2xl overflow-hidden shadow-lg">
                            {images[0] && (
                                <img src={images[0]} alt="Kim Long Miền Nam" className="w-full h-72 md:h-80 object-cover" />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
                                <p className="text-xs uppercase tracking-widest text-gray-200 mb-1">Miền Nam Auto</p>
                                <h3 className="text-xl font-bold">Hồ Sơ Năng Lực Kim Long Miền Nam</h3>
                                <p className="text-3xl font-extrabold text-red-400 mt-2">12 SHOWROOM</p>
                            </div>
                        </div>
                    </div>
                </section>

                {!loading && (
                    <>
                        {/* Tập Đoàn Đầu Tư Miền Nam */}
                        <section className="py-4">
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                                <span className="text-xs font-bold text-red-600 dark:text-red-500 uppercase tracking-widest">Về Tập Đoàn Mẹ</span>
                                <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white uppercase mt-2">Tập Đoàn Đầu Tư Miền Nam</h2>
                            </div>
                        </section>

                        {/* Khát Vọng và Sứ Mệnh + image collage */}
                        <section className="py-10">
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                                <div>
                                    <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-4">Khát Vọng và Sứ Mệnh Vững Bền</h3>
                                    {parsed.mission.slice(1).map((p, i) => (
                                        <p key={i} className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">{p}</p>
                                    ))}
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    {images[1] && <img src={images[1]} alt="Trụ sở Kim Long Miền Nam" className="w-full h-40 object-cover rounded-xl col-span-2" />}
                                    {images[2] && <img src={images[2]} alt="Đội ngũ Kim Long Miền Nam" className="w-full h-32 object-cover rounded-xl" />}
                                    {images[3] && <img src={images[3]} alt="Nhân viên Kim Long Miền Nam" className="w-full h-32 object-cover rounded-xl" />}
                                </div>
                            </div>
                        </section>

                        {/* Hệ Sinh Thái Đa Ngành */}
                        {parsed.ecosystem.length > 0 && (
                            <section className="py-14 bg-white dark:bg-gray-800 transition-colors duration-300">
                                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                    <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white uppercase text-center mb-10">
                                        Hệ Sinh Thái Đa Ngành Của Tập Đoàn
                                    </h2>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                        {parsed.ecosystem.map((tile, i) => {
                                            const Icon = ECOSYSTEM_ICONS[i] || Car;
                                            return (
                                                <div key={i} className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 text-center hover:shadow-md transition-shadow">
                                                    <div className="w-14 h-14 mx-auto rounded-full bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 flex items-center justify-center mb-4">
                                                        <Icon size={26} />
                                                    </div>
                                                    <h4 className="font-bold text-gray-900 dark:text-white mb-2">{tile.title}</h4>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{tile.description}</p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* Cột Mốc Phát Triển Ấn Tượng — vertical timeline */}
                        {parsed.milestones.length > 0 && (
                            <section className="py-14">
                                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                                    <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white uppercase text-center mb-2">
                                        Cột Mốc Phát Triển Ấn Tượng
                                    </h2>
                                    <p className="text-center text-xs text-gray-400 dark:text-gray-500 mb-10">
                                        * Mốc năm cụ thể cho từng sự kiện không được công bố kèm nội dung trên trang gốc — thứ tự dưới đây theo đúng thứ tự xuất hiện thực tế trên website.
                                    </p>
                                    <div className="relative border-l-2 border-red-200 dark:border-red-900/50 ml-4">
                                        {parsed.milestones.map((m, i) => (
                                            <div key={i} className="relative pl-8 pb-10 last:pb-0">
                                                <span className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-red-600 border-4 border-white dark:border-gray-900 shadow" />
                                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{m}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* Kim Long Motor Miền Nam subsection */}
                        <section className="py-14 bg-white dark:bg-gray-800 transition-colors duration-300">
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                                <div>
                                    <span className="text-xs font-bold text-red-600 dark:text-red-500 uppercase tracking-widest">Thành Viên Chiến Lược</span>
                                    <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white mt-2 mb-4">Kim Long Motor Miền Nam</h2>
                                    {parsed.strategicMemberText.map((p, i) => (
                                        <p key={i} className="text-gray-500 dark:text-gray-400 mb-3">{p}</p>
                                    ))}
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-6 mb-3">Quy mô & Năng lực Phân phối</h3>
                                    {parsed.scaleText.map((p, i) => (
                                        <p key={i} className="text-gray-600 dark:text-gray-300 leading-relaxed mb-3">{p}</p>
                                    ))}
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-8 flex flex-col items-center justify-center text-center">
                                    <MapPin className="text-red-600 dark:text-red-500 mb-4" size={48} />
                                    <p className="font-bold text-gray-900 dark:text-white text-lg">Mạng Lưới Toàn Miền Nam</p>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                                        {parsed.showroomRows.length || 12} showroom trải dài từ TP.HCM, Bình Dương, Đồng Nai đến Nha Trang, Tây Nguyên và các tỉnh lân cận.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Danh Mục Sản Phẩm Chiến Lược */}
                        {parsed.catalog.length > 0 && (
                            <section className="py-14">
                                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                    <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white uppercase text-center mb-10">
                                        Danh Mục Sản Phẩm Chiến Lược
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                        {parsed.catalog.map((c, i) => (
                                            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
                                                <span className="text-[11px] font-bold text-red-600 dark:text-red-500 uppercase">{c.label}</span>
                                                <h4 className="font-extrabold text-gray-900 dark:text-white mt-1 mb-3">{c.name}</h4>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{c.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* Mạng Lưới Showroom Hiện Đại — real table */}
                        {parsed.showroomRows.length > 0 && (
                            <section id="showroom-network" className="py-14 bg-white dark:bg-gray-800 transition-colors duration-300">
                                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                                    <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white uppercase text-center mb-10">
                                        Mạng Lưới Showroom Hiện Đại
                                    </h2>
                                    <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="bg-gray-900 dark:bg-gray-950 text-white">
                                                    <th className="py-3 px-4 text-left w-12">STT</th>
                                                    <th className="py-3 px-4 text-left">Tên Showroom</th>
                                                    <th className="py-3 px-4 text-left">Trạng Thái</th>
                                                    <th className="py-3 px-4 text-left">Địa Chỉ</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {parsed.showroomRows.map((row, i) => (
                                                    <tr key={i} className={i % 2 === 0 ? 'bg-gray-50 dark:bg-gray-900' : 'bg-white dark:bg-gray-800'}>
                                                        <td className="py-3 px-4 text-gray-500 dark:text-gray-400">{row.stt}</td>
                                                        <td className="py-3 px-4 font-semibold text-gray-900 dark:text-white">{row.name}</td>
                                                        <td className="py-3 px-4">
                                                            <span className="inline-block bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-bold px-2 py-1 rounded-full">
                                                                {row.status}
                                                            </span>
                                                        </td>
                                                        <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{row.address}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* Bottom promo banner */}
                        <section className="py-14">
                            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                                <div className="relative rounded-2xl overflow-hidden shadow-lg">
                                    {images[4] && <img src={images[4]} alt="Kim Long Miền Nam" className="w-full h-64 md:h-80 object-cover" />}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-8 text-white">
                                        <p className="text-xs uppercase tracking-widest text-gray-200 mb-1">Miền Nam Auto</p>
                                        <h3 className="text-2xl md:text-3xl font-extrabold">Hồ Sơ Năng Lực Kim Long Miền Nam</h3>
                                        <p className="text-4xl font-extrabold text-red-400 mt-2">{parsed.showroomRows.length || 12} SHOWROOM</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Dark CTA band */}
                        <section className="py-16 bg-gray-900 dark:bg-black">
                            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                                <h2 className="text-2xl md:text-3xl font-extrabold text-white uppercase mb-4">
                                    Hợp Tác Phát Triển Bền Vững Cùng Chúng Tôi
                                </h2>
                                {parsed.partnershipText.map((p, i) => (
                                    <p key={i} className="text-gray-300 leading-relaxed mb-6 max-w-2xl mx-auto">{p}</p>
                                ))}
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <a
                                        href={`tel:${HOTLINE}`}
                                        className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors"
                                    >
                                        <Phone size={18} />
                                        Hotline: {HOTLINE_DISPLAY}
                                    </a>
                                    <Link
                                        to="/lien-he"
                                        className="inline-flex items-center justify-center px-7 py-3 rounded-full border-2 border-white text-white font-semibold hover:bg-white hover:text-gray-900 transition-colors"
                                    >
                                        Liên Hệ Hợp Tác
                                    </Link>
                                </div>
                            </div>
                        </section>

                        {/* Showroom photo/contact card */}
                        {contact?.showrooms?.[0] && (
                            <section className="py-14">
                                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden grid grid-cols-1 md:grid-cols-2 transition-colors duration-300">
                                        {contact.showrooms[0].image && (
                                            <img src={contact.showrooms[0].image} alt={contact.showrooms[0].name} className="w-full h-56 md:h-full object-cover" />
                                        )}
                                        <div className="p-8">
                                            <h4 className="font-extrabold text-gray-900 dark:text-white text-lg mb-3">{contact.showrooms[0].name}</h4>
                                            <p className="text-gray-500 dark:text-gray-400 text-sm flex items-start gap-2 mb-2">
                                                <MapPin size={16} className="flex-shrink-0 mt-0.5 text-red-600 dark:text-red-500" />
                                                {contact.showrooms[0].address}
                                            </p>
                                            <p className="text-gray-500 dark:text-gray-400 text-sm flex items-center gap-2">
                                                <Phone size={16} className="text-red-600 dark:text-red-500" />
                                                {contact.showrooms[0].phone}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        )}
                    </>
                )}
            </div>
            <Footer />
        </>
    );
};

export default AboutPage;
