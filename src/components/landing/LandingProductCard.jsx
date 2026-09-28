import React from 'react';

const LandingProductCard = ({ product, onRequestQuote }) => (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col hover:shadow-lg transition-shadow">
        <div className="h-44 bg-slate-100 overflow-hidden">
            {product.image ? (
                <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
            ) : (
                <div className="h-full w-full flex items-center justify-center text-slate-400 text-sm">Chưa có ảnh</div>
            )}
        </div>
        <div className="p-5 flex flex-col flex-1">
            <h3 className="font-bold text-slate-900 line-clamp-2 min-h-[2.75rem]">{product.name}</h3>
            <button
                onClick={() => onRequestQuote(product)}
                className="mt-4 w-full border border-red-600 text-red-600 hover:bg-red-600 hover:text-white font-semibold text-sm py-2.5 rounded-full transition-colors"
            >
                Liên hệ báo giá
            </button>
        </div>
    </div>
);

export default LandingProductCard;
