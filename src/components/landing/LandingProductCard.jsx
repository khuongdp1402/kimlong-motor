import React from 'react';

// The image and name open the detail popup; the button goes straight to the
// quote form. Both live in one card, so the button stops the click from
// bubbling up and opening the detail popup behind the form as well.
const LandingProductCard = ({ product, onRequestQuote, onOpenDetail }) => (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col hover:shadow-lg transition-shadow">
        <button
            type="button"
            onClick={() => onOpenDetail(product)}
            className="text-left flex flex-col flex-1 cursor-pointer"
            aria-label={`Xem chi tiết ${product.name}`}
        >
            <div className="h-44 bg-slate-100 overflow-hidden">
                {product.image ? (
                    <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                ) : (
                    <div className="h-full w-full flex items-center justify-center text-slate-400 text-sm">Chưa có ảnh</div>
                )}
            </div>
            <div className="px-5 pt-5 flex-1">
                <h3 className="font-bold text-slate-900 line-clamp-2 min-h-[2.75rem]">{product.name}</h3>
            </div>
        </button>
        <div className="px-5 pb-5">
            <button
                onClick={(e) => { e.stopPropagation(); onRequestQuote(product); }}
                className="mt-4 w-full border border-red-600 text-red-600 hover:bg-red-600 hover:text-white font-semibold text-sm py-2.5 rounded-full transition-colors"
            >
                Liên hệ báo giá
            </button>
        </div>
    </div>
);

export default LandingProductCard;
