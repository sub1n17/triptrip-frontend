'use client';

// import BoardNavigation from './navigation';
import BoardBanner from './banner';
import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
// import Navigation from './navigation';
import BottomNav from './bottomNav';
import TravelProductRecentMobile from '@/components/travelProduct-recent/mobile';
import style from './styles.module.css';
import navigationStyle from './navigation/styles.module.css';
import NavigationPc from './navigation/pc';
import NavigationMob from './navigation/mobile';

const HIDDEN_BANNER = ['/boards/new', '/myPage'];

export default function BoardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    // console.log(pathname);

    const isNewHiddenBanner = HIDDEN_BANNER.includes(pathname);
    const isEditHiddenBanner = pathname.includes('edit');
    const isUserHiddenBanner = pathname.includes('user');
    const isProductNewHiddenBanner = pathname.includes('travelProduct/new');
    const isProductDetailHiddenBanner = pathname.includes('/travelProduct/');
    // const isMobile = typeof window !== 'undefined' && window.innerWidth<=768

    const [isRecentOpen, setIsRecentOpen] = useState(false);
    const recentToggle = () => {
        setIsRecentOpen((prev) => !prev);
    };

    return (
        <>
            {/* pc일 때 로그인,회원가입 페이지에서 네비 숨기기 */}
            {!isUserHiddenBanner && (
                <div className={navigationStyle.pcNav}>
                    <NavigationPc />
                </div>
            )}

            {/* 모바일일 때 로그인,회원가입 페이지에서 네비 보이기 */}
            <div className={navigationStyle.mobNav}>
                <NavigationMob></NavigationMob>
            </div>

            {/* 게시글 작성, 숙박권 작성, 숙박권 상세, 로그인, 회원가입 페이지에서 배너 안 보이게 하기 */}
            {!isNewHiddenBanner &&
                !isEditHiddenBanner &&
                !isUserHiddenBanner &&
                !isProductNewHiddenBanner &&
                !isProductDetailHiddenBanner && <BoardBanner></BoardBanner>}
            <div>{children}</div>
            {/* 모바일 바텀네비 */}
            <BottomNav onClickRecent={recentToggle} isOpen={isRecentOpen}></BottomNav>
            {/* 모바일 최근본상품 */}
            <div className={style.mobileRecent}>
                <TravelProductRecentMobile
                    isOpen={isRecentOpen}
                    onCloseRecent={recentToggle}
                ></TravelProductRecentMobile>
            </div>
        </>
    );
}
