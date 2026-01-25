'use client';

import { useEffect, useState } from 'react';

interface IRecentMobileProps {
    isOpen?: boolean;
}

interface RecentProduct {
    _id: string;
    name: string;
    image: string;
    isSold: boolean | null;
    price: number;
    seller: string;
}

export default function UseTravelProductRecent({ isOpen }: IRecentMobileProps = {}) {
    // 로컬스토리지는 브라우저에서만 실행돼서 서버(Node, Next, SSR)에는 없기 때문에 state에 담기
    const [recentProduct, setRecentProduct] = useState<RecentProduct[]>([]);

    useEffect(() => {
        const recent = JSON.parse(localStorage.getItem('recent') ?? '[]');
        setRecentProduct(recent);
    }, [isOpen]);

    return {
        recentProduct,
    };
}
