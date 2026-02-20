'use client';

import { useQuery } from '@apollo/client';
import Image from 'next/image';
import style from './styles.module.css';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { FetchBoardsDocument } from '@/commons/graphql/graphql';

export default function BoardBest() {
    const { data } = useQuery(FetchBoardsDocument, {
        variables: {
            page: 1,
            search: '',
        },
    });

    const fetchBoards = data?.fetchBoards ?? [];

    // 베스트 게시글 4개 중 좋아요 없는 게시글이 있으면 최근 게시글로 채우기
    const likedBoards = fetchBoards
        .filter((el) => el.likeCount > 0)
        .sort((a, b) => b.likeCount - a.likeCount);

    let bestBoards = likedBoards.slice(0, 4);

    if (bestBoards.length < 4) {
        const needCount = 4 - bestBoards.length;
        const latestBoards = fetchBoards.filter((el) => !bestBoards.includes(el));
        bestBoards = [...bestBoards, ...latestBoards.slice(0, needCount)];
    }

    return (
        <div className={style.boardBest}>
            <div className={style.best_txt}>오늘 핫한 트립토크</div>
            <div className={style.best_wrapper}>
                {bestBoards.map((el) => {
                    const validImg = el.images?.filter((img) => img && img !== null) ?? [];
                    return (
                        <Link href={`/boards/${el._id}`} key={el._id} className={style.best_board}>
                            <div className={style.imgBox}>
                                <Image
                                    src={
                                        validImg.length > 0
                                            ? `https://storage.googleapis.com/${validImg[0]}`
                                            : '/images/productThumbnail.jpg'
                                    }
                                    alt="숙박 상품 썸네일 이미지"
                                    fill
                                    sizes="25vw"
                                    style={{ objectFit: 'cover' }}
                                ></Image>
                            </div>
                            <div className={style.txt_wrapper}>
                                <div className={style.title_profile}>
                                    <div className={style.title}>{el.title}</div>
                                    <div className={style.profile_wrapper}>
                                        <div className={style.profile}>
                                            <Image
                                                src={'/images/profile.svg'}
                                                alt="프로필"
                                                fill
                                                sizes="24px"
                                            ></Image>
                                        </div>
                                        <div className={style.writer}>{el.writer}</div>
                                    </div>
                                </div>
                                <div className={style.like_wrapper}>
                                    <div className={style.like}>
                                        <div className={style.best}>
                                            <Image
                                                src={'/icons/best_heart.svg'}
                                                alt="좋아요"
                                                fill
                                                sizes="24px"
                                            ></Image>
                                        </div>
                                        <div className={style.likeCount}>{el.likeCount}</div>
                                    </div>
                                    <div className={style.date}>
                                        {el.createdAt.slice(0, 10).split('-').join('.')}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>

            {/* 모바일 */}
            <div className={style.mob_best_wrapper}>
                <Swiper
                    pagination={true}
                    slidesPerView={1.2}
                    spaceBetween={16}
                    slidesOffsetAfter={20} // 모바일에서 맨마지막 슬라이드에 패딩값 주기
                    className={style.mySwiper}
                >
                    {bestBoards.map((el) => {
                        const validImg = el.images?.filter((img) => img && img !== null) ?? [];
                        return (
                            <SwiperSlide key={el._id}>
                                <Link
                                    href={`/boards/${el._id}`}
                                    key={el._id}
                                    className={style.best_board}
                                >
                                    <div className={style.imgBox}>
                                        <Image
                                            src={
                                                validImg.length > 0
                                                    ? `https://storage.googleapis.com/${validImg[0]}`
                                                    : '/images/productThumbnail.jpg'
                                            }
                                            alt="숙박 상품 썸네일 이미지"
                                            fill
                                            sizes="25vw"
                                            style={{ objectFit: 'cover' }}
                                        ></Image>
                                    </div>
                                    <div className={style.txt_wrapper}>
                                        <div className={style.title_profile}>
                                            <div className={style.title}>{el.title}</div>
                                            <div className={style.profile_wrapper}>
                                                <div className={style.profile}>
                                                    <Image
                                                        src={'/images/profile.svg'}
                                                        alt="프로필"
                                                        fill
                                                        sizes="24px"
                                                    ></Image>
                                                </div>
                                                <div className={style.writer}>{el.writer}</div>
                                            </div>
                                        </div>
                                        <div className={style.like_wrapper}>
                                            <div className={style.like}>
                                                <div className={style.best}>
                                                    <Image
                                                        src={'/icons/best_heart.svg'}
                                                        alt="좋아요"
                                                        fill
                                                        sizes="24px"
                                                    ></Image>
                                                </div>
                                                <div className={style.likeCount}>
                                                    {el.likeCount}
                                                </div>
                                            </div>
                                            <div className={style.date}>
                                                {el.createdAt.slice(0, 10).split('-').join('.')}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </SwiperSlide>
                        );
                    })}
                </Swiper>
            </div>
        </div>
    );
}
