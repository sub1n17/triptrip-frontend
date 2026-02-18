// /* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import Image from 'next/image';
import style from './styles.module.css';
import InquiryWrite from '../inquiry-write';
import InquiryList from '../inquiry-list';
import DOMPurify from 'dompurify';
import 'react-quill/dist/quill.snow.css';

import UseTravelProductDetail from './hook';
import { message, Modal, Popover, Tooltip } from 'antd';
import { usePointModalStore } from '@/commons/stores/pointModal';
import { useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useTokenStore } from '@/commons/stores/token';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import type { MenuProps } from 'antd';
import { Dropdown, Space } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { IRecentProduct } from './queries';

const imgSrc = {
    productDelete: '/images/product_delete.png',
    link: '/icons/link.svg',
    location: '/images/location.svg',
    bookmark: '/icons/bookmark.svg',
    productMain: '/images/product_big.png',
    product01: '/images/product_small01.png',
    product02: '/images/product_small02.png',
    product03: '/images/product_small03.png',
    // productProfile: '/images/product_profile.svg',
    productProfile: '/images/profile.svg',
    edit: '/icons/pencil.svg',
    listImg: '/icons/list.svg',
    pencilImg: '/icons/pencil.svg',
    productThumbnail: '/images/productThumbnail.jpg',
};

export default function TravelProductDetail() {
    const {
        data,
        onClickEdit,
        onClickPick,
        activeImg,
        setActiveImg,
        onClickBuy,
        onClickDelete,
        userData,
        isBuyModalOpen,
        modalType,
        onClickModalOpen,
        setIsBuyModalOpen,
        onClickCopy,
    } = UseTravelProductDetail();

    const { openChargeModal } = usePointModalStore();

    const searchParams = useSearchParams();
    const router = useRouter();
    const { productId } = useParams();

    const lat = data?.fetchTravelproduct.travelproductAddress?.lat;
    const lng = data?.fetchTravelproduct.travelproductAddress?.lng;
    const address = data?.fetchTravelproduct.travelproductAddress?.address;

    const validImg = data?.fetchTravelproduct?.images?.filter((el) => el && el !== 'null');

    useEffect(() => {
        // 등록 완료 토스트
        if (searchParams.get('create') === 'true') {
            message.success('숙박권이 등록되었습니다.');
            router.replace(`/travelProduct/${productId}`);
        }
        // 수정 완료 토스트
        if (searchParams.get('edit') === 'true') {
            message.success('숙박권이 수정되었습니다.');
            router.replace(`/travelProduct/${productId}`);
        }

        // 상세페이지로 이동 시 스크롤 최상단
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        if (!data) return;
        // 최근 본 상품에 등록하기 위해 localStorage에 저장
        const recent = JSON.parse(localStorage.getItem('recent') ?? '[]');
        const current = {
            _id: data?.fetchTravelproduct._id,
            name: data?.fetchTravelproduct.name,
            image: validImg?.[0],
            price: data?.fetchTravelproduct.price,
            seller: data?.fetchTravelproduct.seller?.name,
            isSold: data?.fetchTravelproduct.soldAt,
        };
        const filtered = recent.filter((el: IRecentProduct) => el._id !== current._id); // 상품 중복 방지
        const updated = [current, ...filtered].slice(0, 20);
        localStorage.setItem('recent', JSON.stringify(updated));
    }, [data]);

    const { accessToken } = useTokenStore();

    // 더보기 드롭다운
    const items: MenuProps['items'] = [
        {
            key: '1',
            label: (
                <span style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <EditOutlinedIcon fontSize="small" />
                    수정하기
                </span>
            ),
            onClick: onClickEdit,
        },

        {
            key: '2',
            danger: true,
            label: (
                <span style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <DeleteOutlineOutlinedIcon fontSize="small" />
                    삭제하기
                </span>
            ),
            onClick: onClickDelete,
        },
    ];

    return (
        <main className={style.detail_container}>
            <div className={style.title_wrapper}>
                <div className={style.title_flex}>
                    <div className={style.title}>{data?.fetchTravelproduct.name} </div>

                    <div className={style.btn_wrapper}>
                        <button onClick={onClickCopy}>
                            <div className={style.btn_icon}>
                                <Image
                                    src={imgSrc.link}
                                    className={`${style.btn_icon_img} ${style.link_img}`}
                                    alt="링크"
                                    fill
                                    sizes="24px"
                                ></Image>
                            </div>
                        </button>

                        {((lat && lng) || (address && address?.length > 0)) && (
                            <button>
                                <Tooltip
                                    title={data?.fetchTravelproduct?.travelproductAddress?.address}
                                >
                                    <div className={`${style.btn_icon} ${style.pc_location}`}>
                                        <Image
                                            src={imgSrc.location}
                                            fill
                                            className={style.btn_icon_img}
                                            alt="로케이션이미지"
                                            sizes="24px"
                                        ></Image>
                                    </div>
                                </Tooltip>

                                <Popover
                                    content={
                                        data?.fetchTravelproduct?.travelproductAddress?.address
                                    }
                                    trigger="click"
                                >
                                    <div className={`${style.btn_icon} ${style.mob_location}`}>
                                        <Image
                                            src={imgSrc.location}
                                            fill
                                            className={style.btn_icon_img}
                                            alt="로케이션이미지"
                                            sizes="24px"
                                        ></Image>
                                    </div>
                                </Popover>
                            </button>
                        )}
                        <button className={style.bookmark_btn} onClick={onClickPick}>
                            <div className={style.bookmark_img}>
                                <Image src={imgSrc.bookmark} alt="북마크" fill sizes="24px"></Image>
                            </div>
                            <div>{data?.fetchTravelproduct.pickedCount ?? 0} </div>
                        </button>

                        {accessToken &&
                            data?.fetchTravelproduct.seller?._id ===
                                userData?.fetchUserLoggedIn?._id && (
                                <button className={style.btn_icon}>
                                    <Dropdown menu={{ items }} trigger={['click']}>
                                        <a onClick={(e) => e.preventDefault()}>
                                            <Space>
                                                {/* 더보기 */}
                                                <EllipsisOutlined
                                                    style={{ fontSize: '20px' }}
                                                ></EllipsisOutlined>
                                            </Space>
                                        </a>
                                    </Dropdown>
                                </button>
                            )}
                    </div>
                </div>
                <div className={style.summary}>{data?.fetchTravelproduct.remarks}</div>
                <div className={style.tag}>
                    {data?.fetchTravelproduct.tags
                        ?.filter((tag: string) => tag && tag.trim() !== '')
                        .map((tag: string, index: number) => (
                            <span key={index}> #{tag} </span>
                        ))}
                </div>
            </div>

            <div className={style.product_center}>
                <div className={style.img_wrapper}>
                    <div className={style.productMain_img}>
                        <Image
                            src={
                                validImg && validImg.length > 0 && activeImg
                                    ? validImg[0].startsWith('http')
                                        ? validImg[0]
                                        : `https://storage.googleapis.com/${activeImg}`
                                    : imgSrc.productThumbnail
                            }
                            alt="상품 이미지"
                            fill
                            style={{
                                objectFit: 'cover',
                            }}
                            sizes="(max-width: 768px) 100vw, 685px"
                            priority
                        />
                    </div>

                    {validImg && validImg.length > 0 && (
                        <div className={style.productSmall_wrapper}>
                            {validImg.map((el: string, index: number) => {
                                return (
                                    <div
                                        className={`${style.productSmall_img} ${
                                            validImg.length === 3 ? style.fill : style.auto
                                        }`}
                                        key={index}
                                    >
                                        <Image
                                            src={
                                                el.startsWith('http')
                                                    ? el
                                                    : `https://storage.googleapis.com/${el}`
                                            }
                                            alt="숙소"
                                            fill
                                            sizes="140px"
                                            style={{ objectFit: 'cover' }}
                                            onClick={() => setActiveImg(el)}
                                            priority
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div className={style.priceSeller_wrapper}>
                    <div className={style.price_wrapper}>
                        <div className={style.price}>
                            {data?.fetchTravelproduct.price?.toLocaleString()}
                            <span>원</span>
                        </div>
                        <div className={style.caution_wrapper}>
                            <div>
                                <div className={style.list_circle}></div>
                                <div className={style.description_txt}>
                                    숙박권은 트립트립에서 포인트 충전 후 구매하실 수 있습니다.
                                </div>
                            </div>
                            <div>
                                <div className={style.list_circle}></div>
                                <div className={style.description_txt}>
                                    상세 설명에 숙박권 사용기한을 꼭 확인해 주세요.
                                </div>
                            </div>
                        </div>

                        <button
                            className={
                                data?.fetchTravelproduct?.soldAt
                                    ? style.disabled_btn
                                    : style.buy_btn
                            }
                            onClick={onClickModalOpen}
                            disabled={data?.fetchTravelproduct?.soldAt}
                        >
                            {data?.fetchTravelproduct?.soldAt ? '판매 완료' : '구매하기'}
                        </button>
                    </div>
                    <div className={style.seller_wrapper}>
                        <div className={style.seller_title}>판매자</div>
                        <div className={style.profile_wrapper}>
                            <div className={style.profile_img}>
                                <Image
                                    src={'/images/profile.svg'}
                                    alt="판매자"
                                    fill
                                    sizes="40px"
                                ></Image>
                            </div>
                            <div className={style.seller}>
                                {data?.fetchTravelproduct.seller?.name ?? ''}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* image, buy_btn, seller */}

            {/* ******************************** 모바일 **********************************  */}
            <div className={style.mob_wrapper}>
                {validImg && validImg.length > 0 ? (
                    <Swiper
                        modules={[Pagination]}
                        pagination={{
                            type: 'fraction',
                        }}
                        className={style.mob_swiper}
                    >
                        {validImg.map((el: string) => (
                            <SwiperSlide key={el}>
                                <div style={{ position: 'relative', height: '100%' }}>
                                    <Image
                                        src={
                                            el.startsWith('http')
                                                ? el
                                                : `https://storage.googleapis.com/${el}`
                                        }
                                        alt="상품 이미지"
                                        fill
                                        style={{ objectFit: 'cover' }}
                                        sizes="(max-width: 768px) 100vw, 0px"
                                        priority
                                    />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                ) : (
                    <div className={style.mob_noImg}>
                        <Image
                            src={imgSrc.productThumbnail || '/images/productThumbnail.jpg'}
                            alt="상품사진"
                            width={500}
                            height={300}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            sizes="(max-width: 768px) 100vw, 0px"
                            priority
                        />
                    </div>
                )}
                <div className={style.mob_profileBar}>
                    <div className={style.profile_wrapper}>
                        <div className={style.profile_img}>
                            <Image
                                src={'/images/profile.svg'}
                                alt="판매자"
                                fill
                                sizes="40px"
                            ></Image>
                        </div>
                        <div className={style.seller}>
                            {data?.fetchTravelproduct.seller?.name ?? ''}
                        </div>
                    </div>
                    <div className={style.mob_btnWrapper}>
                        <button onClick={onClickCopy}>
                            <div className={style.btn_icon}>
                                <Image
                                    src={imgSrc.link}
                                    alt="링크"
                                    fill
                                    sizes="24px"
                                    className={`${style.btn_icon_img} ${style.link_img}`}
                                ></Image>
                            </div>
                        </button>
                        {((lat && lng) || (address && address?.length > 0)) && (
                            <button>
                                <div className={style.btn_icon}>
                                    <Popover
                                        content={
                                            data?.fetchTravelproduct?.travelproductAddress?.address
                                        }
                                        trigger="click"
                                    >
                                        <div className={`${style.btn_icon} ${style.mob_location}`}>
                                            <Image
                                                src={imgSrc.location}
                                                fill
                                                className={style.btn_icon_img}
                                                alt="로케이션이미지"
                                                sizes="24px"
                                            ></Image>
                                        </div>
                                    </Popover>
                                </div>
                            </button>
                        )}
                        <button className={style.bookmark_btn} onClick={onClickPick}>
                            <div className={style.bookmark_img}>
                                <Image src={imgSrc.bookmark} alt="북마크" fill sizes="24px"></Image>
                            </div>
                            <div>{data?.fetchTravelproduct.pickedCount ?? 0} </div>
                        </button>

                        {accessToken &&
                            data?.fetchTravelproduct.seller?._id ===
                                userData?.fetchUserLoggedIn?._id && (
                                <button className={style.btn_icon}>
                                    <Dropdown menu={{ items }} trigger={['click']}>
                                        <a onClick={(e) => e.preventDefault()}>
                                            <Space>
                                                {/* 더보기 */}
                                                <EllipsisOutlined
                                                    style={{ fontSize: '20px' }}
                                                ></EllipsisOutlined>
                                            </Space>
                                        </a>
                                    </Dropdown>
                                </button>
                            )}
                    </div>
                </div>
                <div className={style.mob_productWrapper}>
                    <div className={style.mob_titleWrapper}>
                        <div className={style.tag}>
                            {data?.fetchTravelproduct.tags
                                ?.filter((tag: string) => tag && tag.trim() !== '')
                                .map((tag: string, index: number) => (
                                    <span key={index}> #{tag} </span>
                                ))}
                        </div>
                        <div className={style.title}>{data?.fetchTravelproduct.name} </div>
                        <div className={style.summary}>{data?.fetchTravelproduct.remarks}</div>
                    </div>
                    <div className={style.mob_priceWrapper}>
                        <div className={style.price}>
                            {data?.fetchTravelproduct.price?.toLocaleString()}
                            <span>원</span>
                        </div>
                    </div>
                </div>
                <div className={style.caution_wrapper}>
                    <div>
                        {/* <div className={style.list_circle}></div> */}
                        <div className={style.description_txt}>
                            * 숙박권은 트립트립에서 포인트 충전 후 구매하실 수 있습니다.
                        </div>
                    </div>
                    <div>
                        {/* <div className={style.list_circle}></div> */}
                        <div className={style.description_txt}>
                            * 상세 설명에 숙박권 사용기한을 꼭 확인해 주세요.
                        </div>
                    </div>
                </div>
                {/* 구매하기 */}
                <div className={style.mob_buyBtnWrapper}>
                    <button
                        className={
                            data?.fetchTravelproduct?.soldAt ? style.disabled_btn : style.buy_btn
                        }
                        onClick={onClickModalOpen}
                        disabled={data?.fetchTravelproduct?.soldAt}
                    >
                        {data?.fetchTravelproduct?.soldAt ? '판매 완료' : '구매하기'}
                    </button>
                </div>
            </div>

            {/* ************************************************************************  */}

            <div className={style.description_wrapper}>
                <div className={style.section_title}>상세 설명</div>
                {typeof window !== 'undefined' ? (
                    <div
                        className={style.description}
                        dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(data?.fetchTravelproduct.contents ?? ''),
                        }}
                    ></div>
                ) : (
                    <div></div>
                )}
            </div>
            {/*  description */}

            {((lat && lng) || (address && address?.length > 0)) && (
                <div className={style.location_wrapper}>
                    <div className={style.section_title}>상세 위치</div>
                    <div className={style.location} id="map"></div>
                </div>
            )}
            {/*  location */}

            {/*  문의 */}
            <InquiryWrite isAnswer={false}></InquiryWrite>

            {/* 문의 목록 */}
            <InquiryList></InquiryList>

            {/* 구매 모달 */}
            <Modal
                open={isBuyModalOpen}
                onCancel={() => setIsBuyModalOpen(false)}
                footer={null}
                centered
                wrapClassName={style.pointModal}
            >
                {/* 숙박권 구매할 때 */}
                {modalType === 'yesOrNo' && (
                    <>
                        <div>
                            <div className={style.modal_title}>해당 숙박권을 구매 하시겠어요?</div>
                            <div className={style.modal_content}>
                                해당 숙박권은 포인트로만 구매 가능합니다.
                            </div>
                        </div>
                        <div className={style.modal_btn}>
                            <button
                                onClick={() => setIsBuyModalOpen(false)}
                                className={style.btn_cancel}
                            >
                                취소
                            </button>
                            <button onClick={onClickBuy} className={style.btn_ok}>
                                구매
                            </button>
                        </div>
                    </>
                )}

                {/* 포인트 부족할 때 */}
                {modalType === 'noPoint' && (
                    <>
                        <div>
                            <div className={style.modal_title}>포인트 부족</div>
                            <div className={style.modal_content}>
                                <div>포인트가 부족합니다.</div>
                                <div>포인트 충전 후 구매하세요.</div>
                            </div>
                        </div>
                        <div className={style.modal_btn}>
                            <button
                                onClick={() => setIsBuyModalOpen(false)}
                                className={style.btn_cancel}
                            >
                                취소
                            </button>
                            <button
                                onClick={() => {
                                    setIsBuyModalOpen(false); // 구매 모달 닫기
                                    // openChargeModal();
                                    setTimeout(() => {
                                        openChargeModal();
                                    }, 150); // 충전 모달 열기 (시간 차 줘서 좀 더 부드럽게)
                                }}
                                className={style.btn_ok}
                            >
                                충전
                            </button>
                        </div>
                    </>
                )}
            </Modal>
        </main>
    );
}
