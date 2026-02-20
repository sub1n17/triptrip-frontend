'use client';

import style from './styles.module.css';

import Image from 'next/image';

import { useEffect, useState } from 'react';
// import Search from '../boards-list/search';
import { useQuery } from '@apollo/client';
import { useRouter, useSearchParams } from 'next/navigation';
import { FetchTravelproductsDocument, FetchTravelproductsQuery } from '@/commons/graphql/graphql';
import Search from '@/components/boards-list/search';
import Link from 'next/link';

const imgSrc = {
    leftBtn: '/images/leftButton.png',
    rightBtn: '/images/rightButton.png',
    Accommodation: '/images/Accommodation.png',
    advertiseBanner: '/images/advertiseBanner.png',
    productThumbnail: '/images/productThumbnail.jpg',
    bookmark: '/icons/bookmark.svg',
    profile: '/images/profile.svg',
    recent01: '/images/recent01.jpg',
    recent02: '/images/recent02.jpg',
    recent03: '/images/recent03.jpg',
};

export default function TravelProductList() {
    const searchParams = useSearchParams();

    const tabMenu = searchParams.get('tabMenu');
    const search = searchParams.get('search');
    const productCount = searchParams.get('productCount');
    const soldOutCount = searchParams.get('soldOutCount');

    const [travelQueryString, setTravelQueryString] = useState({
        tabMenu: tabMenu ?? 'onSale',
        search: search || null,
        productCount: Number(productCount) || 8,
        soldOutCount: Number(soldOutCount) || 8,
    });

    useEffect(() => {
        const params = new URLSearchParams();

        if (travelQueryString.tabMenu) params.set('tabMenu', String(travelQueryString.tabMenu));
        if (travelQueryString.search) params.set('search', travelQueryString.search);
        if (travelQueryString.productCount)
            params.set('productCount', String(travelQueryString.productCount));
        if (travelQueryString.soldOutCount)
            params.set('soldOutCount', String(travelQueryString.soldOutCount));

        router.replace(`?${params.toString()}`, { scroll: false });
    }, [travelQueryString]);

    const {
        data,
        refetch: refetchOnSale,
        fetchMore: fetchMoreOnSale,
        loading: loadingOnSale, // 검색어 입력 시 새테이터 가져오면서 일시적으로 undefined돼서 깜빡이는 현상 방지
    } = useQuery(FetchTravelproductsDocument, {
        variables: {
            isSoldout: false,
            search: travelQueryString.search,
        },
        fetchPolicy: 'cache-first',
    });

    const {
        data: soldOutData,
        refetch: refetchSoldOut,
        fetchMore: fetchMoreSoldOut,
        loading: loadingSoldOut,
    } = useQuery(FetchTravelproductsDocument, {
        variables: {
            isSoldout: true,
            search: travelQueryString.search,
        },
        fetchPolicy: 'cache-first',
    });

    useEffect(() => {
        refetchOnSale();
        refetchSoldOut();
    }, []);

    const router = useRouter();

    // 예약 가능/마감 숙소 탭메뉴
    const onClickTab = (tab: string) => {
        setTravelQueryString((prev) => ({
            ...prev,
            search: null,
            tabMenu: tab,
            productCount: 8,
            soldOutCount: 8,
        }));
    };

    // 더보기
    const onClickMore = () => {
        // 예약 가능 숙소
        if (travelQueryString.tabMenu === 'onSale') {
            if (data?.fetchTravelproducts.length === 0) return;
            fetchMoreOnSale({
                variables: {
                    // page: Number(travelQueryString.page) + 1, // 페이지가 바뀌면서 fetchMore이 아니라 page:2를 변수로 fetch시켜서 누적안됨 쿼리에 page 넣지 말기
                    page: Math.ceil((data?.fetchTravelproducts?.length ?? 0) / 10) + 1,
                    search: travelQueryString.search,
                    isSoldout: false,
                },
                updateQuery(prev, { fetchMoreResult }) {
                    if (!fetchMoreResult) return prev;

                    // fetchMore 되면서 초기에 useQuery로 fetch된 기본 게시글과 중복돼서 key가 같다는 에러 생김 해결하기
                    // 1. 기존 ID들을 담은 Set이라는 특수한 주머니에 담음 (new Set(...)의 Set: 중복을 허용하지 않는 집합, 이 안에 특정 값이 들어있는지 찾는 속도가 빠름)
                    const prevId = new Set(prev.fetchTravelproducts.map((el) => el._id));
                    // 2.  서버에서 새로 가져온 데이터(newProducts) 중 기존 주머니(prevIds)에 없는 것만 골라냄
                    const newProducts = fetchMoreResult.fetchTravelproducts.filter(
                        (el) => !prevId.has(el._id),
                    );
                    // ㄴ> el._id !== prevId은 안 되는 이유
                    // : _id(문자열)와 Set(객체)을 비교하면 항상 다르다고 판단되어 중복 제거가 하나도 되지 않음
                    // Set을 사용할 때는 반드시 .has() 메서드를 써야 함 - 객체에서 xxx를 갖고 있는지 판단하기

                    return {
                        fetchTravelproducts: [...prev.fetchTravelproducts, ...newProducts],
                    };
                },
            });

            // 쿼리스트링 반영
            setTravelQueryString((prev) => ({
                ...prev,
                productCount: Number(prev.productCount) + 8,
            }));
        } else {
            // 예약 마감 숙소
            if (soldOutData?.fetchTravelproducts.length === 0) return;
            fetchMoreSoldOut({
                variables: {
                    page: Math.ceil((soldOutData?.fetchTravelproducts.length ?? 0) / 10) + 1,
                    search: travelQueryString.search,
                    isSoldout: true,
                },
                updateQuery(prev, { fetchMoreResult }) {
                    if (!fetchMoreResult) return prev;

                    const prevId = new Set(prev.fetchTravelproducts.map((el) => el._id));
                    const newProducts = fetchMoreResult.fetchTravelproducts.filter(
                        (el) => !prevId.has(el._id),
                    );

                    return {
                        fetchTravelproducts: [...prev.fetchTravelproducts, ...newProducts],
                    };
                },
            });

            // 쿼리스트링 반영
            setTravelQueryString((prev) => ({
                ...prev,
                soldOutCount: Number(prev.soldOutCount) + 8,
            }));
        }
    };

    // 상세 => 목록일 때 페이지 더 불러서 누적시키기 (예약가능)
    useEffect(() => {
        if (!data) return;
        const needPage = Math.ceil(travelQueryString.productCount / 10);
        const nowPageOnSale = Math.ceil(data?.fetchTravelproducts.length / 10);

        if (nowPageOnSale >= needPage) return;

        fetchMoreOnSale({
            variables: {
                page: nowPageOnSale + 1,
                search: travelQueryString.search,
                isSoldout: false,
            },
            updateQuery(prev, { fetchMoreResult }) {
                if (!fetchMoreResult) return prev;

                // 중복 제거
                const prevId = new Set(prev.fetchTravelproducts.map((el) => el._id));
                const newProducts = fetchMoreResult.fetchTravelproducts.filter(
                    (el) => !prevId.has(el._id),
                );

                return {
                    fetchTravelproducts: [...prev.fetchTravelproducts, ...newProducts],
                };
            },
        });
    }, [data, travelQueryString.productCount]);
    // 상세 => 목록일 때 페이지 더 불러서 누적시키기 (판매완료)
    useEffect(() => {
        if (!soldOutData) return;
        const needPage = Math.ceil(travelQueryString.soldOutCount / 10);
        const nowPageSoldOut = Math.ceil(soldOutData?.fetchTravelproducts.length / 10);

        if (nowPageSoldOut >= needPage) return;

        fetchMoreSoldOut({
            variables: {
                page: nowPageSoldOut + 1,
                search: travelQueryString.search,
                isSoldout: true,
            },
            updateQuery(prev, { fetchMoreResult }) {
                if (!fetchMoreResult) return prev;
                const prevId = new Set(prev.fetchTravelproducts.map((el) => el._id));
                const newProducts = fetchMoreResult.fetchTravelproducts.filter(
                    (el) => !prevId.has(el._id),
                );

                return {
                    fetchTravelproducts: [...prev.fetchTravelproducts, ...newProducts],
                };
            },
        });
    }, [soldOutData, travelQueryString.productCount]);

    //  Search 컴포넌트 props : Search가 필요로 하는 state
    const [keyword, setKeyword] = useState('');

    return (
        <main className={style.container}>
            <picture className={style.advertiseBannerImg}>
                <source media="(max-width: 768px)" srcSet="/images/m_banner.png" />
                <source media="(max-width: 1024px)" srcSet="/images/t_banner(1).png" />
                <img
                    src="/images/advertiseBanner.png"
                    alt="advertiseBanner"
                    className={style.bannerImg}
                />
            </picture>

            <div>
                <div className={style.bold_txt}>여기에서만 예약할 수 있는 숙소</div>
                <div className={style.tab_wrapper}>
                    <button
                        className={`
                            ${style.tab_menu} 
                            ${travelQueryString.tabMenu === 'onSale' ? style.active : ''}
                         `}
                        onClick={() => onClickTab('onSale')}
                    >
                        예약 가능 숙소
                    </button>
                    <button
                        className={`
                            ${style.tab_menu} 
                            ${travelQueryString.tabMenu === 'soldOut' ? style.active : ''}
                         `}
                        onClick={() => onClickTab('soldOut')}
                    >
                        예약 마감 숙소
                    </button>
                </div>
                <Search
                    keyword={keyword}
                    setKeyword={setKeyword}
                    travelQueryString={travelQueryString}
                    setTravelQueryString={setTravelQueryString}
                ></Search>

                {/* 로딩 중에는 결과없음 띄우는 걸 방지해서 검색 중에 깜빡임 방지 - 로딩완료되면 !loading*/}
                {(travelQueryString.tabMenu === 'onSale' ? !loadingOnSale : !loadingSoldOut) &&
                    ((travelQueryString.tabMenu === 'onSale' &&
                        data?.fetchTravelproducts.length === 0) ||
                        (travelQueryString.tabMenu !== 'onSale' &&
                            soldOutData?.fetchTravelproducts.length === 0)) && (
                        <div className={style.noSearch}>검색 결과가 없습니다.</div>
                    )}

                <div className={style.productsWrapper}>
                    {(travelQueryString.tabMenu === 'onSale'
                        ? (data?.fetchTravelproducts?.slice(0, travelQueryString.productCount) ??
                          [])
                        : (soldOutData?.fetchTravelproducts?.slice(
                              0,
                              travelQueryString.soldOutCount,
                          ) ?? [])
                    ).map((el: FetchTravelproductsQuery['fetchTravelproducts'][0]) => {
                        const validImg = el.images?.filter((el) => el && el !== 'null');
                        return (
                            <Link
                                href={`/travelProduct/${el._id}?${searchParams.toString()}`}
                                key={el._id}
                                className={style.product}
                            >
                                <div className={style.product_thumbnail}>
                                    <div
                                        className={`${style.productThumbnail_img} ${style.img_wrapper}`}
                                    >
                                        <Image
                                            src={
                                                validImg && validImg.length > 0
                                                    ? validImg[0].startsWith('http')
                                                        ? validImg[0]
                                                        : `https://storage.googleapis.com/${validImg[0]}`
                                                    : imgSrc.productThumbnail
                                            }
                                            alt="productThumbnail"
                                            fill
                                            sizes="25vw"
                                            className={style.objectFit_img}
                                        ></Image>
                                    </div>
                                    <div className={style.bookmark}>
                                        <div
                                            className={`${style.bookmark_img} ${style.img_wrapper}`}
                                        >
                                            <Image
                                                src={imgSrc.bookmark}
                                                alt="bookmark"
                                                fill
                                                sizes="24px"
                                                className={style.objectFit_img}
                                            ></Image>
                                        </div>
                                        <div>{el.pickedCount} </div>
                                    </div>
                                </div>
                                <div className={style.content}>
                                    <div className={style.name}> {el.name} </div>
                                    <div className={style.remarks}> {el.remarks} </div>

                                    <div className={style.tags}>
                                        {el?.tags
                                            ?.filter((tag) => tag && tag.trim() !== '')
                                            .map((tag, index) => (
                                                <span key={`${tag}_${index}`}>#{tag} </span>
                                            ))}
                                    </div>
                                </div>
                                <div className={style.product_sellerPrice}>
                                    <div className={style.product_seller}>
                                        <div
                                            className={`${style.profile_img} ${style.img_wrapper}`}
                                        >
                                            <Image
                                                src={imgSrc.profile}
                                                alt="profile"
                                                fill
                                                sizes="24px"
                                                className={style.objectFit_img}
                                            ></Image>
                                        </div>
                                        <div className={style.seller}>{el?.seller?.name} </div>
                                    </div>
                                    <div className={style.price}>
                                        {travelQueryString.tabMenu === 'onSale' ? (
                                            <>
                                                {el.price?.toLocaleString()} <span>원</span>
                                            </>
                                        ) : (
                                            <div className={style.soldOut}>판매완료</div>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* 더보기 */}
                {travelQueryString.tabMenu === 'onSale'
                    ? (data?.fetchTravelproducts.length ?? 0) > travelQueryString.productCount && (
                          <button className={style.more} onClick={onClickMore}>
                              더보기
                          </button>
                      )
                    : (soldOutData?.fetchTravelproducts.length ?? 0) >
                          travelQueryString.soldOutCount && (
                          <button className={style.more} onClick={onClickMore}>
                              더보기
                          </button>
                      )}
            </div>
        </main>
    );
}
