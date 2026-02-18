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
import {
    FetchTravelproductsDocument,
    FetchTravelproductsOfTheBestDocument,
} from '@/commons/graphql/graphql';

export default function TravelProductBest() {
    const { data: bestData } = useQuery(FetchTravelproductsOfTheBestDocument);
    const { data: allData } = useQuery(FetchTravelproductsDocument);

    const bestList = bestData?.fetchTravelproductsOfTheBest ?? [];
    const allList = allData?.fetchTravelproducts ?? [];

    // 1. 판매완료 제거
    const filteredBest = bestList.filter((el) => !el.soldAt);

    // 2. 이미 베스트에 있는 id 제외 + 판매중인 숙박권 중 북마크 높은 순으로 뽑아내기
    const remainingCandidates = allList
        .filter((el) => !el.soldAt && !filteredBest.some((best) => best._id === el._id))
        .sort((a, b) => (b.pickedCount ?? 0) - (a.pickedCount ?? 0));

    // 3. 부족한 개수만큼 채우기
    const bestProducts = [...filteredBest, ...remainingCandidates].slice(0, 4);

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
                    {bestProducts?.map((el) => {
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
                                                src={'/icons/bookmark.svg'}
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
