'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import Image from 'next/image';
import style from './styles.module.css';
import { useQuery } from '@apollo/client';
import Link from 'next/link';
import DOMPurify from 'dompurify';
import { FetchTravelproductsOfTheBestDocument } from '@/commons/graphql/graphql';

// const FETCH_PRODUCTS_BEST = gql`
//     query fetchTravelproductsOfTheBest {
//         fetchTravelproductsOfTheBest {
//             _id
//             name
//             contents
//             price
//             pickedCount
//             images
//             soldAt
//         }
//     }
// `;

export default function TravelProductBest() {
    const { data } = useQuery(FetchTravelproductsOfTheBestDocument);

    // 판매완료 안 된 상품만 보여주기
    const isSaleProduct =
        data?.fetchTravelproductsOfTheBest.filter((el) => !el.soldAt) ??
        data?.fetchTravelproductsOfTheBest;
    return (
        <>
            <div className={style.bold_txt}>2026년을 낭만있게 시작하고 싶다면?</div>

            <div className={style.swiper_wrapper}>
                <div className={style.btn_wrapper}>
                    <button className={`${style.leftBtn} leftBtn`}></button>
                    <button className={`${style.rightBtn} rightBtn`}></button>
                </div>

                <Swiper
                    modules={[Navigation]}
                    navigation={{
                        prevEl: '.leftBtn',
                        nextEl: '.rightBtn',
                    }}
                    slidesOffsetAfter={20} // 모바일에서 맨마지막 슬라이드에 패딩값 주기
                    slidesPerView={1.5} // 모바일 기본값
                    spaceBetween={12}
                    // 반응형 지점 설정
                    breakpoints={{
                        // 768px 이상 (태블릿)
                        768: {
                            slidesPerView: 2,
                            spaceBetween: 24,
                            slidesOffsetAfter: 0,
                        },
                        // 1200px 이상 (PC)
                        1200: {
                            slidesPerView: 2.3,
                            spaceBetween: 24,
                            slidesOffsetAfter: 0,
                        },
                    }}
                >
                    {isSaleProduct?.map((el) => {
                        const validImg = el.images?.filter((img) => img && img !== null) ?? [];
                        return (
                            <SwiperSlide key={el._id}>
                                <Link
                                    href={`/travelProduct/${el._id}`}
                                    className={style.swiper_slide}
                                >
                                    <Image
                                        src={
                                            validImg.length > 0
                                                ? `https://storage.googleapis.com/${validImg[0]}`
                                                : '/images/productThumbnail.jpg'
                                        }
                                        alt="Accommodation"
                                        fill
                                        sizes="50vw"
                                        style={{ objectFit: 'cover' }}
                                    ></Image>
                                    <div className={style.pickedCount}>
                                        <div className={style.bookmark}>
                                            <Image
                                                src={'/images/bookmark.png'}
                                                alt="북마크"
                                                fill
                                                sizes="24px"
                                                style={{ objectFit: 'cover' }}
                                            ></Image>
                                        </div>
                                        <div>{el.pickedCount}</div>
                                    </div>
                                    <div className={style.txt_wrapper}>
                                        <div>
                                            <div className={style.best_title}>{el.name}</div>
                                            <div
                                                dangerouslySetInnerHTML={{
                                                    __html: DOMPurify.sanitize(el.contents),
                                                }}
                                            />
                                        </div>
                                        <div className={style.best_price}>
                                            {el.price?.toLocaleString()} 원
                                        </div>
                                    </div>
                                </Link>
                            </SwiperSlide>
                        );
                    })}
                </Swiper>
            </div>
        </>
    );
}
