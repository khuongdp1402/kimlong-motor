// Standard declining-balance (reducing balance) installment loan math, matching
// the real kimlongmiennam.com "Dự Toán Trả Góp Mua Xe" widget: equal principal
// installments (gốc chia đều theo số tháng) with interest computed monthly on
// the remaining balance — first-month interest = full loan amount * (annual
// rate / 12).
export function calcInstallment(carPrice, vayPercent, years, ratePercent) {
    const loanAmount = Math.round((carPrice * vayPercent) / 100);
    const prepaidAmount = carPrice - loanAmount;
    const months = years * 12;
    const monthlyPrincipal = months > 0 ? Math.round(loanAmount / months) : 0;
    const firstMonthInterest = Math.round((loanAmount * (ratePercent / 100)) / 12);
    const firstMonthTotal = monthlyPrincipal + firstMonthInterest;

    return {
        loanAmount,
        prepaidAmount,
        monthlyPrincipal,
        firstMonthInterest,
        firstMonthTotal,
    };
}

export function formatVnd(value) {
    if (value === null || value === undefined || Number.isNaN(value)) return '0 ₫';
    return `${Math.round(value).toLocaleString('vi-VN')} ₫`;
}

// Itemized real on-road cost breakdown, matching the "Chi Phí Lăn Bánh Xe"
// widget's real percentages/fees found on the live product pages.
export function calcRollingCost(carPrice) {
    const regTax = Math.round(carPrice * 0.02); // Thuế trước bạ 2%
    const physicalInsurance = Math.round(carPrice * 0.015); // Bảo hiểm vật chất 1.5%
    const licensePlateFee = 500000;
    const roadUsageFee = 1560000;
    const inspectionFee = 340000;
    const civilLiabilityInsurance = 480000;
    const otherFee = 1000000;

    const total =
        carPrice +
        regTax +
        physicalInsurance +
        licensePlateFee +
        roadUsageFee +
        inspectionFee +
        civilLiabilityInsurance +
        otherFee;

    return {
        carPrice,
        regTax,
        physicalInsurance,
        licensePlateFee,
        roadUsageFee,
        inspectionFee,
        civilLiabilityInsurance,
        otherFee,
        total,
    };
}
