'use client';

import Image from 'next/image';
import style from './styles.module.css';
import Link from 'next/link';
import { Modal, Select } from 'antd';
import { usePathname } from 'next/navigation';
import UseNavigation from '../hook';
import { useTokenStore } from '@/commons/stores/token';

const imgSrc = {
    logoImg: '/images/logo.png',
    profileImg: '/images/profile.png',
    downArrowImg: '/images/down_arrow.png',
    rightIconImg: '/images/right_icon.png',
    chargeImg: '/images/charge.png',
    logoutImg: '/images/logout.png',
    pointImg: '/images/myPage_point.png',
    upArrImg: '/images/up_arrow.png',
    pointModalImg: '/images/pointModal.png',
};

export default function NavigationPc() {
    const {
        onClickProtected,
        isProfileOpen,
        onClickProfileToggle,
        data,
        openChargeModal,
        onClickLogout,
        onClickLogin,
        isChargeModalOpen,
        closeChargeModal,
        onClickChargePay,
        handleChange,
    } = UseNavigation();
    const pathname = usePathname();
    const { accessToken } = useTokenStore();

    return (
        <>
            <div className={style.navigation_wrap}>
                <div className={style.navigation_inner}>
                    <div className={style.menu_wrap}>
                        <h1 className={style.logoImg}>
                            <Link href={'/boards'}>
                                <Image
                                    src={imgSrc.logoImg}
                                    alt="logoImg"
                                    width={0}
                                    height={0}
                                    sizes="100vw"
                                ></Image>
                            </Link>
                        </h1>
                        <nav className={style.navigation}>
                            <Link
                                href="/boards"
                                className={`${style.menu}
                                ${pathname.startsWith('/boards') ? style.active : ''}`}
                            >
                                트립토크
                            </Link>
                            <Link
                                href="/travelProduct"
                                className={`${style.menu}
                                ${pathname.startsWith('/travelProduct') ? style.active : ''}`}
                            >
                                숙박권 구매
                            </Link>
                            <Link
                                href="/myPage"
                                className={`${style.menu}
                                ${pathname === '/myPage' ? style.active : ''}`}
                                onClick={onClickProtected}
                            >
                                마이 페이지
                            </Link>
                        </nav>
                    </div>
                    {accessToken ? (
                        <div className={style.mypage_wrap}>
                            {/* 클릭 전 */}
                            {!isProfileOpen && (
                                <div
                                    className={style.profileClickBefore}
                                    onClick={onClickProfileToggle}
                                >
                                    <div className={style.profileImg}>
                                        <Image
                                            src={imgSrc.profileImg}
                                            alt="profileImg"
                                            fill
                                            sizes="24px"
                                        ></Image>
                                    </div>
                                    <div className={style.downArrowImg}>
                                        <Image
                                            src={imgSrc.downArrowImg}
                                            alt="downArrowImg"
                                            fill
                                            sizes="24px"
                                        ></Image>
                                    </div>
                                </div>
                            )}
                            {/* 클릭 시 포인트충전/로그아웃 메뉴 */}
                            {isProfileOpen && (
                                <div className={style.profileClickAfter}>
                                    <div
                                        className={style.clickProfile}
                                        onClick={onClickProfileToggle}
                                    >
                                        <div className={style.profileImg_wrapper}>
                                            <div className={style.profileImg}>
                                                <Image
                                                    src={imgSrc.profileImg}
                                                    alt="profileImg"
                                                    fill
                                                    sizes="24px"
                                                ></Image>
                                            </div>
                                            <div> {data.fetchUserLoggedIn.name}</div>
                                        </div>
                                        <div className={style.downArrowImg}>
                                            <Image
                                                src={imgSrc.upArrImg}
                                                alt="upArrImg"
                                                fill
                                                sizes="24px"
                                            ></Image>
                                        </div>
                                    </div>
                                    <div
                                        className={`${style.clickPoint} ${style.profileClickFlex}`}
                                    >
                                        <div className={style.pointImg}>
                                            <Image
                                                src={imgSrc.pointImg}
                                                alt="pointImg"
                                                fill
                                                sizes="24px"
                                            ></Image>
                                        </div>
                                        <div className={style.myPoint}>
                                            {data.fetchUserLoggedIn.userPoint.amount}
                                            <span>P</span>
                                        </div>
                                    </div>
                                    <div className={style.clickMenuBtn}>
                                        <button
                                            className={`${style.btnCharge}  ${style.profileClickFlex}`}
                                            onClick={openChargeModal}
                                        >
                                            <div className={style.chargeImg}>
                                                <Image
                                                    src={imgSrc.chargeImg}
                                                    alt="chargeImg"
                                                    fill
                                                    sizes="16px"
                                                ></Image>
                                            </div>
                                            <div>포인트 충전</div>
                                        </button>
                                        <button
                                            onClick={onClickLogout}
                                            className={`${style.btnLogout}  ${style.profileClickFlex}`}
                                        >
                                            <div className={style.logoutImg}>
                                                <Image
                                                    src={imgSrc.logoutImg}
                                                    alt="logoutImg"
                                                    fill
                                                    sizes="16px"
                                                ></Image>
                                            </div>
                                            <div>로그아웃</div>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <button className={style.login_btn} onClick={onClickLogin}>
                            <div className={style.login_txt}> 로그인</div>
                            <div className={style.rightIconImg}>
                                <Image
                                    src={imgSrc.rightIconImg}
                                    alt="rightIconImg"
                                    width={0}
                                    height={0}
                                ></Image>
                            </div>
                        </button>
                    )}
                </div>
            </div>

            {/* 충전 모달창 */}
            <Modal
                className={style.chargeModal}
                open={isChargeModalOpen}
                // onOk={onClickChargePay}
                onCancel={closeChargeModal}
                centered // 가운데 위치시키기
                okText={'충전하기'}
                cancelText={'취소'}
                okButtonProps={{
                    htmlType: 'button', // 기본 form submit 방지
                    onClick: onClickChargePay, // 버튼 클릭 시 직접 함수 실행
                }}
            >
                <div className={style.chargeModalInner}>
                    <div className={style.pointModalImg}>
                        <Image
                            src={imgSrc.pointModalImg}
                            alt="pointModalImg"
                            // width={0}
                            // height={0}
                            fill
                            style={{ objectFit: 'contain' }}
                        ></Image>
                    </div>
                    <div className={style.pointModalTxt}>충전하실 금액을 선택해 주세요.</div>

                    <Select
                        defaultValue="100"
                        style={{ width: '100%' }}
                        onChange={handleChange}
                        options={[
                            { value: '100', label: '100' },
                            { value: '500', label: '500' },
                            { value: '2,000', label: '2,000' },
                            { value: '5,000', label: '5,000' },
                            { value: '10,000', label: '10,000' },
                            { value: '50,000', label: '50,000' },
                        ]}
                    />
                </div>
            </Modal>
        </>
    );
}
