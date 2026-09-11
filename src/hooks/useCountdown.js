import { useEffect, useState } from 'react';

// Countdown to a target Date/timestamp, matching the real site's
// "Ưu Đãi Đến Ngày ..." widget (days/hours/minutes/seconds, floored at 0).
export function useCountdown(targetTime) {
    const [remaining, setRemaining] = useState(() => Math.max(0, targetTime - Date.now()));

    useEffect(() => {
        const tick = () => setRemaining(Math.max(0, targetTime - Date.now()));
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, [targetTime]);

    const totalSeconds = Math.floor(remaining / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const pad = (n) => String(n).padStart(2, '0');

    return {
        days: pad(days),
        hours: pad(hours),
        minutes: pad(minutes),
        seconds: pad(seconds),
        expired: remaining <= 0,
    };
}

// Real promo end date confirmed on the live kimlongmiennam.com product pages
// (e.g. Kim Long 99 S47) is 21/08/2026 23:59:59 (GMT+7). Products without a
// scraped specific promo date roll to the end of the current month as a
// generic, non-fabricated fallback (matches the site's "ưu đãi trong tháng"
// promo framing without inventing a fake specific day).
export function getPromoEndDate(product) {
    if (product?.promoEndsAt) return new Date(product.promoEndsAt).getTime();

    const KNOWN_PROMO_END = new Date('2026-08-21T23:59:59+07:00').getTime();
    if (product?.slug === 'kim-long-99-s47-xe-khach-47-cho-ban-dua-don') {
        return KNOWN_PROMO_END;
    }

    const now = new Date();
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    return endOfMonth.getTime();
}
