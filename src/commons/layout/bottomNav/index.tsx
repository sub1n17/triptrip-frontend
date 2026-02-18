'use client';

import Image from 'next/image';
import style from './styles.module.css';
import { usePathname, useRouter } from 'next/navigation';

const imgSrc = {
    trip: '/icons/mob_trip.svg',
    travel: '/icons/mob_store.svg',
    mypage: '/icons/mob_mypage.svg',
    recent: '/icons/mob_recent.svg',
};

interface IRecentMobileProps {
    isOpen: boolean;
    onClickRecent: () => void;
}

export default function BottomNav({ onClickRecent, isOpen }: IRecentMobileProps) {
    const router = useRouter();
    const pathname = usePathname();
    const isBoards = pathname.includes('/boards');
    const isTravel = pathname.includes('/travelProduct');
    const isMypage = pathname.includes('/myPage');

    // 게시판 상세페이지, 로그인, 회원가입 페이지에서 네비 없애기
    const isBoardHidden = pathname.startsWith('/boards/');
    const isTravelHidden = pathname.startsWith('/travelProduct/');
    const isUserHidden = pathname.startsWith('/user');
    if (isBoardHidden || isTravelHidden || isUserHidden) return null;

    return (
        <div className={style.bottomNav}>
            {/* 바텀네비 */}

            <div className={style.nav_inner}>
                <button
                    className={`${style.menu} ${isBoards ? style.active : ''}`}
                    onClick={() => router.push('/boards')}
                >
                    <div className={style.nav_img}>
                        <Image src={imgSrc.trip} alt="트립토크" fill sizes="24px"></Image>
                    </div>
                    <div className={style.nav_txt}>트립토크</div>
                </button>
                <button
                    className={`${style.menu} ${isTravel ? style.active : ''}`}
                    onClick={() => router.push('/travelProduct')}
                >
                    <div className={style.nav_img}>
                        <Image src={imgSrc.travel} alt="숙박권 구매" fill sizes="24px"></Image>
                    </div>
                    <div className={style.nav_txt}>숙박권 구매</div>
                </button>
                <button
                    className={`${style.menu} ${isMypage ? style.active : ''}`}
                    onClick={() => router.push('/myPage')}
                >
                    <div className={style.nav_img}>
                        <Image src={imgSrc.mypage} alt="마이페이지" fill sizes="24px"></Image>
                    </div>
                    <div className={style.nav_txt}>마이페이지</div>
                </button>
                <button
                    className={`${style.menu} ${style.recent_menu} ${isOpen ? style.active : ''}`}
                    onClick={onClickRecent}
                >
                    <div className={style.nav_img}>
                        <Image src={imgSrc.recent} alt="최근 본 상품" fill sizes="24px"></Image>
                    </div>
                    <div className={style.nav_txt}>최근 본 상품</div>
                </button>
            </div>
        </div>
    );
}
