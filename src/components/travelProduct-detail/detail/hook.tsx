'use client';
import { useMutation, useQuery } from '@apollo/client';
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
    CREATE_POINT_TRANSACTION_OF_BUYING_AND_SELLING,
    DELETE_PRODUCT,
    // FETCH_TRAVEL_PRODUCT,
    // FETCH_USER_LOGIN,
    IKakaoAddressResult,
    TOGGLE_TRAVEL_PRODUCT_PICK,
} from './queries';
import { useEffect, useState } from 'react';
import { message, Modal } from 'antd';
import {
    FetchTravelproductDocument,
    FetchTravelproductsDocument,
    FetchUserLoggedInDocument,
} from '@/commons/graphql/graphql';
import { useTokenStore } from '@/commons/stores/token';

// declare const window: Window & {
//     kakao: any;
// };

export default function UseTravelProductDetail() {
    const params = useParams();
    const productId = params.productId;

    const { accessToken } = useTokenStore();

    const { data: userData } = useQuery(FetchUserLoggedInDocument, {
        // skip: !accessToken,
    });
    const { data } = useQuery(FetchTravelproductDocument, {
        variables: {
            travelproductId: String(params.productId),
        },
    });

    // 수정하기
    const router = useRouter();
    const onClickEdit = () => {
        router.push(`/travelProduct/${productId}/edit`);
    };

    // 삭제하기
    const [isModalOpen, setIsModalOpen] = useState(false);
    const toggleModal = () => {
        setIsModalOpen((prev) => !prev);
    };
    const [delete_product] = useMutation(DELETE_PRODUCT);
    const onClickDelete = () => {
        Modal.confirm({
            title: '숙박권을 삭제하시겠습니까?',
            okText: '삭제',
            cancelText: '취소',
            okType: 'danger',
            centered: true,

            onOk: async () => {
                try {
                    await delete_product({
                        variables: { travelproductId: params.productId },
                        refetchQueries: [
                            { query: FetchTravelproductsDocument, variables: { page: 1 } },
                        ],
                    });
                    setTimeout(() => {
                        message.success('숙박권이 삭제되었습니다.');
                    }, 100);
                    router.replace('/travelProduct');
                } catch (err) {
                    message.error((err as Error).message);
                }
            },
        });
    };

    // 링크 복사
    const onClickCopy = async () => {
        await navigator.clipboard.writeText(window.location.href);
        message.success('링크가 복사되었습니다.');
    };

    // 북마크
    const [toggle_travel_product_pick] = useMutation(TOGGLE_TRAVEL_PRODUCT_PICK);
    const onClickPick = async () => {
        if (!accessToken) {
            message.warning('로그인 후 이용 가능합니다.');
            return;
        }

        try {
            await toggle_travel_product_pick({
                variables: {
                    travelproductId: productId,
                },
                // refetchQueries: [
                //     { query: FETCH_TRAVEL_PRODUCT, variables: { travelproductId: productId } },
                // ],
                update(cache, { data }) {
                    cache.modify({
                        id: cache.identify({ __typename: 'Travelproduct', _id: productId }),
                        fields: {
                            pickedCount: () => {
                                return data.toggleTravelproductPick;
                            },
                        },
                    });
                },
            });
        } catch (error) {
            alert((error as Error).message);
        }
    };

    // 구매하기
    const [create_point_transaction_of_buying_and_selling] = useMutation(
        CREATE_POINT_TRANSACTION_OF_BUYING_AND_SELLING,
    );

    const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
    const [modalType, setModalType] = useState<'yesOrNo' | 'noPoint'>('yesOrNo');

    const pathname = usePathname();
    const searchParams = useSearchParams();
    // 구매하기 버튼 클릭
    const onClickModalOpen = () => {
        if (!accessToken) {
            message.warning('로그인 후 이용 가능합니다.');

            // 로그인 완료 후 원래 보던 페이지로 이동시키기 위해 url 반영하기
            const redirect =
                pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');
            router.push(`/user/logIn?redirect=${encodeURIComponent(redirect)}`);
            return;
        }
        setIsBuyModalOpen(true);
        setModalType('yesOrNo');
    };

    // 모달 - 구매 클릭
    const onClickBuy = async () => {
        try {
            await create_point_transaction_of_buying_and_selling({
                variables: {
                    useritemId: productId,
                },
                refetchQueries: [
                    {
                        query: FetchTravelproductDocument,
                        variables: { travelproductId: params.productId },
                    },
                    {
                        query: FetchTravelproductsDocument,
                        variables: { page: 1 },
                    },
                ],
            });

            setIsBuyModalOpen(false);
            message.success('구매가 완료되었습니다.');
        } catch (error) {
            const err = error as Error;
            if (err.message.includes('포인트') || err.message.includes('부족')) {
                setModalType('noPoint');
                return;
            }
            message.error(err.message);
        }
    };

    const [activeImg, setActiveImg] = useState<string | null>(null);
    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (!data) return;

        // 이미지 썸네일 메인이미지 바꾸기 (처음: 0번째 인덱스)
        if ((data?.fetchTravelproduct?.images?.length ?? 0) > 0) {
            // 첫번째 이미지는 첨부하지 않고 두번째에 첨부할 때 null 제거 후 존재하는 사진만
            const valid = data?.fetchTravelproduct?.images?.filter((img) => img && img !== 'null');
            if (!valid) return;
            setActiveImg(valid[0]);
        }

        // 카카오맵 가져오기
        const script = document.createElement('script');
        script.src =
            '//dapi.kakao.com/v2/maps/sdk.js?appkey=250e10a8ea2a1ce18e6982ef6f32fde4&autoload=false&libraries=services';
        document.head.appendChild(script);

        const lat = data?.fetchTravelproduct.travelproductAddress?.lat;
        const lng = data?.fetchTravelproduct.travelproductAddress?.lng;
        const address = data?.fetchTravelproduct.travelproductAddress?.address;

        script.onload = () => {
            window.kakao.maps.load(() => {
                const mapContainer = document.getElementById('map');
                if (!mapContainer) return;

                // ✅ 1. lat/lng가 있을 때
                if (lat && lng && lat !== 0 && lng !== 0) {
                    const map = new window.kakao.maps.Map(mapContainer, {
                        center: new window.kakao.maps.LatLng(lat, lng),
                        level: 3,
                    });

                    const marker = new window.kakao.maps.Marker({
                        position: new window.kakao.maps.LatLng(lat, lng),
                    });

                    marker.setMap(map);
                    return;
                }

                // ✅ 2. lat/lng 없고 주소만 있을 때 (fallback)
                if (address) {
                    const geocoder = new window.kakao.maps.services.Geocoder();

                    geocoder.addressSearch(
                        address,
                        (result: IKakaoAddressResult[], status: 'OK' | 'ZERO_RESULT' | 'ERROR') => {
                            if (status !== window.kakao.maps.services.Status.OK) return;

                            const coords = new window.kakao.maps.LatLng(
                                Number(result[0].y),
                                Number(result[0].x),
                            );

                            const map = new window.kakao.maps.Map(mapContainer, {
                                center: coords,
                                level: 3,
                            });

                            const marker = new window.kakao.maps.Marker({
                                position: coords,
                            });

                            marker.setMap(map);
                        },
                    );
                }
            });
        };

        // lat, lng으로만 지도 표시함
        // script.onload = () => {
        //     window.kakao.maps.load(function () {
        //         const mapContainer = document.getElementById('map'), // 지도를 표시할 div
        //             mapOption = {
        //                 center: new window.kakao.maps.LatLng(lat, lng), // 지도의 중심좌표
        //                 level: 3, // 지도의 확대 레벨
        //             };
        //         const map = new window.kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다
        //         // 마커가 표시될 위치입니다
        //         const markerPosition = new window.kakao.maps.LatLng(lat, lng);
        //         // 마커를 생성합니다
        //         const marker = new window.kakao.maps.Marker({
        //             position: markerPosition,
        //         });
        //         // 마커가 지도 위에 표시되도록 설정합니다
        //         marker.setMap(map);
        //     });
        // };
    }, [data]);

    return {
        data,
        onClickEdit,
        onClickPick,
        activeImg,
        setActiveImg,
        onClickBuy,
        onClickDelete,
        isModalOpen,
        toggleModal,
        userData,
        isBuyModalOpen,
        modalType,
        onClickModalOpen,
        setIsBuyModalOpen,
        onClickCopy,
    };
}
