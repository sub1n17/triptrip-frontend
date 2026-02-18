'use client';

import Link from 'next/link';
import Image from 'next/image';
import UseTravelProductRecent from '../hooks';
import { useSearchParams } from 'next/navigation';
import listStyle from '../../travelProduct-list/styles.module.css';
import style from './styles.module.css';
import { CloseOutlined } from '@ant-design/icons';
import { useEffect } from 'react';

const imgSrc = {
    bookmark: '/icons/bookmark.svg',
    profile: '/images/profile.svg',
    close: '/icons/close.svg',
};

interface IRecentMobileProps {
    isOpen: boolean;
    onCloseRecent: () => void;
}

export default function TravelProductRecentMobile({ isOpen, onCloseRecent }: IRecentMobileProps) {
    const { recentProduct } = UseTravelProductRecent({ isOpen });

    const searchParams = useSearchParams();

    // 최근본숙박권 열렸을 때 다른 영역 스크롤 막기
    useEffect(() => {
        if (isOpen) {
            // document.documentElement = <html> 태그
            document.documentElement.style.overflow = 'hidden';
        } else {
            document.documentElement.style.overflow = '';
        }

        // 클린업
        return () => {
            document.documentElement.style.overflow = '';
        };
    }, [isOpen]);

    return (
        <>
            <div
                className={`${style.dim_layer} ${isOpen ? style.show : ''}`}
                onClick={onCloseRecent}
            />

            <div className={`${style.mobRecent_container} ${isOpen ? style.show : ''}`}>
                <div className={style.recent_top}>
                    <div className={style.title}>최근 본 숙박권</div>
                    <button className={style.closeBtn} onClick={onCloseRecent}>
                        <CloseOutlined></CloseOutlined>
                    </button>
                </div>
                <div className={style.recent_wrapper}>
                    {recentProduct.length === 0 ? (
                        <div className={style.empty}>최근 본 숙박권이 없습니다.</div>
                    ) : (
                        recentProduct.map((el) => {
                            return (
                                <Link
                                    href={`/travelProduct/${el._id}?${searchParams.toString()}`}
                                    key={el._id}
                                    className={listStyle.product}
                                    onClick={onCloseRecent}
                                >
                                    <div className={listStyle.product_thumbnail}>
                                        <div
                                            className={`${listStyle.productThumbnail_img} ${listStyle.img_wrapper}`}
                                        >
                                            <Image
                                                src={
                                                    el.image
                                                        ? `https://storage.googleapis.com/${el.image}`
                                                        : '/images/productThumbnail.jpg'
                                                }
                                                alt="productThumbnail"
                                                fill
                                                sizes="25vw"
                                                className={listStyle.objectFit_img}
                                            ></Image>
                                        </div>
                                    </div>
                                    <div className={listStyle.content}>
                                        <div className={listStyle.name}> {el.name} </div>
                                        <div className={listStyle.remarks}> {el.remarks} </div>
                                        <div className={listStyle.tags}>
                                            {el?.tags
                                                ?.filter((tag: string) => tag && tag.trim() !== '')
                                                .map((tag: string, index: number) => (
                                                    <span key={`${tag}_${index}`}>#{tag} </span>
                                                ))}
                                        </div>
                                    </div>
                                    <div className={listStyle.product_sellerPrice}>
                                        <div className={listStyle.product_seller}>
                                            <div
                                                className={`${listStyle.profile_img} ${listStyle.img_wrapper}`}
                                            >
                                                <Image
                                                    src={imgSrc.profile}
                                                    alt="profile"
                                                    fill
                                                    sizes="24px"
                                                    className={listStyle.objectFit_img}
                                                ></Image>
                                            </div>
                                            <div className={listStyle.seller}>{el?.seller} </div>
                                        </div>
                                        <div className={listStyle.price}>
                                            {!el.isSold ? (
                                                <>
                                                    {el.price} <span>원</span>
                                                </>
                                            ) : (
                                                <div className={listStyle.soldOut}>판매완료</div>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            );
                        })
                    )}
                </div>
            </div>
        </>
    );
}
