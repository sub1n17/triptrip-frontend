import Image from 'next/image';
import style from './styles.module.css';
import UseNavigation from '../hook';
import { useEffect, useState } from 'react';
import { useTokenStore } from '@/commons/stores/token';
import { usePathname, useRouter } from 'next/navigation';

const imgSrc = {
    logoImg: '/images/logo.png',
    profileImg: '/images/profile.png',
    downArrowImg: '/images/down_arrow.png',
    chargeImg: '/images/charge.png',
    logoutImg: '/images/logout.png',
    pointImg: '/images/myPage_point.png',
    upArrImg: '/images/up_arrow.png',
    pointModalImg: '/images/pointModal.png',
    menuClose: '/images/mob_close.png',
    mob_logo: '/images/mob_logo.png',
    backBtn: '/images/mob_back.png',
};

export default function NavigationMob() {
    const { onClickLogin, data, openChargeModal, onClickLogout } = UseNavigation();
    const { accessToken } = useTokenStore();

    // 사이드메뉴
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const onClickMenuToggle = () => {
        setIsMenuOpen((prev) => !prev);
    };

    // 사이드메뉴 열리면 스크롤, 터치 막기
    useEffect(() => {
        if (isMenuOpen) {
            // 메뉴가 열리면 스크롤 방지
            document.body.style.overflow = 'hidden';
            document.body.style.touchAction = 'none'; // 터치 이벤트 방지 (모바일 전용)
        } else {
            // 메뉴가 닫히면 스크롤 복원
            document.body.style.overflow = 'auto';
            document.body.style.touchAction = 'auto';
        }

        // 컴포넌트가 사라질 때(unmount)를 대비한 클린업
        return () => {
            document.body.style.overflow = 'auto';
            document.body.style.touchAction = 'auto';
        };
    }, [isMenuOpen]);

    // 메뉴 이름
    const pathname = usePathname();
    const [menu, setMenu] = useState('트립토크');

    const isBoardList = pathname === '/boards';
    const isBoardDetail =
        pathname.includes('/boards/') && !pathname.includes('/new') && !pathname.includes('/edit');
    const isBoardNew = pathname.includes('/boards/new');
    const isBoardEdit = pathname.includes('/boards/') && pathname.includes('/edit');
    const isTravelList = pathname === '/travelProduct';
    const isTravelDetail =
        pathname.includes('/travelProduct/') &&
        !pathname.includes('/new') &&
        !pathname.includes('/edit');
    const isTravelNew = pathname.includes('/travelProduct/new');
    const isTravelEdit = pathname.includes('/travelProduct/') && pathname.includes('/edit');
    const isMyPage = pathname.includes('/myPage');
    const isUser = pathname.startsWith('/user');

    // 백버튼 보여주는 페이지
    const showBackBtn = isBoardDetail || isTravelDetail;

    // 닫기 버튼 보여주는 페이지
    const showCloseBtn = isUser || isBoardNew || isBoardEdit || isTravelNew || isTravelEdit;

    // 바텀네비에서 메뉴 클릭하면 헤더에 메뉴이름 변경하기
    useEffect(() => {
        if (isBoardList) setMenu('트립토크');
        if (isBoardDetail || isTravelDetail) setMenu('');
        if (isBoardNew) setMenu('게시물 등록하기');
        if (isBoardEdit) setMenu('게시물 수정하기');
        if (isTravelList) setMenu('숙박권 예약');
        if (isTravelNew) setMenu('숙박권 판매하기');
        if (isTravelEdit) setMenu('숙박권 수정하기');
        if (isMyPage) setMenu('마이페이지');
        if (isUser) setMenu('로그인');
    }, [pathname]);

    const router = useRouter();
    return (
        <>
            <header className={`${style.nav} ${showCloseBtn ? style.center : ''}`}>
                {showBackBtn && (
                    <button className={style.backBtn} onClick={() => router.back()}>
                        <Image src={imgSrc.backBtn} alt="뒤로가기" fill sizes="24px"></Image>
                    </button>
                )}
                <div className={`${style.menu_name} ${showCloseBtn ? style.center : ''}`}>
                    {menu}
                </div>
                {showCloseBtn && (
                    <button className={style.close} onClick={() => router.back()}>
                        <Image src={imgSrc.menuClose} alt="닫기" fill sizes="24px"></Image>
                    </button>
                )}
                {!isUser &&
                    !showCloseBtn &&
                    (!accessToken ? (
                        <button className={style.login_btn} onClick={onClickLogin}>
                            <div className={style.login_txt}> 로그인</div>
                            <div className={style.logoutImg}>
                                <Image
                                    src={imgSrc.logoutImg}
                                    alt="rightIconImg"
                                    fill
                                    sizes="16px"
                                ></Image>
                            </div>
                        </button>
                    ) : (
                        <button onClick={onClickMenuToggle}>
                            <div className={style.profileImg}>
                                <Image
                                    src={imgSrc.profileImg}
                                    alt="프로필이미지"
                                    fill
                                    sizes="24px"
                                ></Image>
                            </div>
                        </button>
                    ))}
            </header>

            {/* 사이드메뉴 열릴 때 오버레이 */}
            <div
                className={`${style.overlay} ${isMenuOpen ? style.open : ''}`}
                onClick={onClickMenuToggle}
            />

            <aside className={`${style.aside_menu} ${isMenuOpen ? style.open : ''}`}>
                <div className={style.menu_top}>
                    <div className={style.logoImg}>
                        <Image src={imgSrc.mob_logo} alt="트립트립" fill sizes="36px"></Image>
                    </div>
                    <button onClick={onClickMenuToggle} className={style.menuClose}>
                        <Image src={imgSrc.menuClose} alt="닫기" fill sizes="24px"></Image>
                    </button>
                </div>

                <div className={style.menu_wrapper}>
                    {/* 프로필 */}
                    <div className={style.profileImg_wrapper}>
                        <div className={style.profileImg}>
                            <Image
                                src={imgSrc.profileImg}
                                alt="프로필이미지"
                                fill
                                sizes="24px"
                            ></Image>
                        </div>
                        <div> {data?.fetchUserLoggedIn.name}</div>
                    </div>
                    {/* 포인트 */}
                    <div className={`${style.clickPoint} ${style.profileClickFlex}`}>
                        <div className={style.pointImg}>
                            <Image src={imgSrc.pointImg} alt="포인트" fill sizes="24px"></Image>
                        </div>
                        <div className={style.myPoint}>
                            {data?.fetchUserLoggedIn.userPoint.amount}
                            <span>P</span>
                        </div>
                    </div>
                    {/* 포인트충전 */}
                    <div className={style.clickMenuBtn}>
                        <button
                            className={`${style.btnCharge}  ${style.profileClickFlex}`}
                            onClick={openChargeModal}
                        >
                            <div className={style.chargeImg}>
                                <Image
                                    src={imgSrc.chargeImg}
                                    alt="충전하기"
                                    fill
                                    sizes="16px"
                                ></Image>
                            </div>
                            <div>포인트 충전</div>
                        </button>
                        {/* 로그아웃 */}
                        <button
                            onClick={() => {
                                onClickLogout();
                                onClickMenuToggle();
                            }}
                            className={`${style.btnLogout}  ${style.profileClickFlex}`}
                        >
                            <div className={style.logoutImg}>
                                <Image
                                    src={imgSrc.logoutImg}
                                    alt="로그아웃"
                                    fill
                                    sizes="16px"
                                ></Image>
                            </div>
                            <div>로그아웃</div>
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
}
