/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation } from '@apollo/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { CREATE_TRAVEL_PRODUCT, UPDATE_TRAVEL_PRODUCT, UPLOAD_FILE } from './queries';
import { useParams, useRouter } from 'next/navigation';
import { imageValidation } from '@/commons/libraries/imageValidation';
import { ITravelProductWrite } from './types';
import { FetchTravelproductQuery } from '@/commons/graphql/graphql';
import { FormData, schema } from '@/commons/schema/travelProduct.schema';

export default function UseTravelProductWrite<T extends FetchTravelproductQuery>({
    isEdit,
    data,
}: ITravelProductWrite<T>) {
    // 사진 배열
    const [imgUrl, setImgUrl] = useState(['', '', '']);

    // 카카오맵 로드 완료 여부
    // const [isKakaoLoaded, setIsKakaoLoaded] = useState(false);

    // react-hook-form, zod 설정
    const methods = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: 'onChange',
        // defaultValues 처음 렌더링될 때 한 번만 적용, data가 나중에 들어와도 갱신x, useForm() 내장 기능
        // defaultValues = 폼의 기준 타입
        defaultValues: {
            name: '',
            remarks: '',
            contents: '',
            price: undefined,
            tags: '',
            travelproductAddress: {
                zipcode: '',
                address: '',
                addressDetail: undefined,
                lat: undefined,
                lng: undefined,
            },
        },
    });

    // reset() : 기존의 defaultValues를 무시하고 서버에서 받아온 데이터로 폼 전체를 새로 세팅해주는 역할
    // reset() = defaultValues 타입으로 값을 덮어씀
    useEffect(() => {
        if (data?.fetchTravelproduct) {
            methods.reset({
                name: data.fetchTravelproduct.name,
                remarks: data.fetchTravelproduct.remarks,
                contents: data.fetchTravelproduct.contents,
                price: data.fetchTravelproduct.price ?? undefined,
                tags: data.fetchTravelproduct.tags?.join(','),
                travelproductAddress: {
                    zipcode: data.fetchTravelproduct.travelproductAddress?.zipcode ?? '',
                    address: data.fetchTravelproduct.travelproductAddress?.address ?? '',
                    addressDetail:
                        data.fetchTravelproduct.travelproductAddress?.addressDetail || undefined,
                    lat: data.fetchTravelproduct.travelproductAddress?.lat ?? 0,
                    lng: data.fetchTravelproduct.travelproductAddress?.lng ?? 0,
                },
            });

            // 이미지 가져오기
            setImgUrl(data.fetchTravelproduct.images ?? ['', '', '']);
        }

        // 카카오맵 script
        const script = document.createElement('script');
        script.src =
            '//dapi.kakao.com/v2/maps/sdk.js?appkey=250e10a8ea2a1ce18e6982ef6f32fde4&autoload=false&libraries=services';
        // ㄴ> libraries=services 옵션을 붙여야 kakao.maps.services.Geocoder() 를 쓸 수 있음
        document.head.appendChild(script);

        script.onload = () => {
            window.kakao.maps.load(() => {
                // setIsKakaoLoaded(true);

                const lat = data?.fetchTravelproduct.travelproductAddress?.lat;
                const lng = data?.fetchTravelproduct.travelproductAddress?.lng;

                // 위도, 경도 없으면 지도 그리지 않기
                if (!lat || !lng) return;

                // 위도, 경도로 지도 나타내기
                const mapContainer = document.getElementById('map'), // 지도를 표시할 div
                    mapOption = {
                        center: new window.kakao.maps.LatLng(lat, lng), // 지도의 중심좌표
                        level: 3, // 지도의 확대 레벨
                    };

                const map = new window.kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다

                // 마커가 표시될 위치입니다
                const markerPosition = new window.kakao.maps.LatLng(lat, lng);

                // 마커를 생성합니다
                const marker = new window.kakao.maps.Marker({
                    position: markerPosition,
                });

                // 마커가 지도 위에 표시되도록 설정합니다
                marker.setMap(map);
            });
        };
    }, [data, methods, methods.reset]);

    const [create_travel_product] = useMutation(CREATE_TRAVEL_PRODUCT);
    const [update_travel_product] = useMutation(UPDATE_TRAVEL_PRODUCT);

    // const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
    const router = useRouter();

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    // 주소 타입
    interface IAddressData {
        zonecode: string;
        address: string;
    }

    // 우편번호 모달창 열기
    const [isModalOpen, setIsModalOpen] = useState(false);
    const onClickAddressShow = () => {
        setIsModalOpen(true);
    };

    // 검색 후 우편번호 모달창 닫기
    const [postAddress, setPostAddress] = useState('');
    const handleComplete = (data: IAddressData) => {
        setIsModalOpen(false);
        // methods.setValue('travelproductAddress.zipcode', data.zonecode); // 강제로 'a'필드에 b값을 넣게함
        methods.setValue('travelproductAddress.zipcode', data.zonecode, { shouldValidate: true });

        setPostAddress(data.address);

        // 카카오맵 API가 로드된 후 실행
        if (
            // !isKakaoLoaded ||
            !window.kakao ||
            !window.kakao.maps
        )
            return;

        // 카카오맵 Geocoder로 좌표 구하기
        const geocoder = new window.kakao.maps.services.Geocoder();

        geocoder.addressSearch(data.address, function (result: any, status: any) {
            if (status === window.kakao.maps.services.Status.OK) {
                const lat = parseFloat(result[0].y);
                const lng = parseFloat(result[0].x);

                // 위도, 경도 form에 저장
                methods.setValue('travelproductAddress.lat', lat, { shouldValidate: true });
                methods.setValue('travelproductAddress.lng', lng, { shouldValidate: true });

                // 위도, 경도로 지도 나타내기
                const mapContainer = document.getElementById('map'), // 지도를 표시할 div
                    mapOption = {
                        center: new window.kakao.maps.LatLng(lat, lng), // 지도의 중심좌표
                        level: 3, // 지도의 확대 레벨
                    };

                const map = new window.kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다

                // 마커가 표시될 위치입니다
                const markerPosition = new window.kakao.maps.LatLng(lat, lng);

                // 마커를 생성합니다
                const marker = new window.kakao.maps.Marker({
                    position: markerPosition,
                });

                // 마커가 지도 위에 표시되도록 설정합니다
                marker.setMap(map);
            }
        });
    };

    // 사진 첨부
    const fileRef = useRef<HTMLInputElement[]>([]);
    const onClickFile = (index: number) => {
        fileRef.current[index].click();
    };
    const [upload_file] = useMutation(UPLOAD_FILE);
    const onChangeUrl = async (event: ChangeEvent<HTMLInputElement>, index: number) => {
        const fileUrl = event.target.files?.[0];
        if (!fileUrl) return; // 파일이 없으면 그냥 끝냄

        // 5MB 넘는 파일 제한
        const isValid = imageValidation(fileUrl);
        if (!isValid) return;

        const result = await upload_file({
            variables: {
                file: fileUrl,
            },
        });

        const newImgUrl = [...imgUrl];
        newImgUrl[index] = result.data.uploadFile.url;
        setImgUrl(newImgUrl);
    };
    const onClickDelete = (index: number) => {
        const deleteImgUrl = [...imgUrl];
        deleteImgUrl[index] = '';
        setImgUrl(deleteImgUrl);
    };

    //   상품 설명 웹 에디터
    const onChangeContents = (contents: string) => {
        // ReactQuill이 기본적으로 빈 에디터일 때도 <p><br></p> 같은 HTML 태그를 반환해서
        // 내용이 없어도 문자열이 있는 것처럼 보임 => 문자열 없는데도 에러감지 못함

        // HTML 태그를 전부 지우는 코드 <, > 사이의 모든 걸 지우고 앞뒤 공백도 제거함 => 결과 : '' (빈 문자열)
        const plainText = contents.replace(/<(.|\n)*?>/g, '').trim();

        // 진짜 내용이 없으면 빈 문자열로 처리 => 글자가 하나도 없는 빈 문자열이면 빈 문자열로 만들고 값이 있으면 원래 contents값으로 유지해줘
        const value = plainText === '' ? '' : contents;

        methods.setValue('contents', value, { shouldValidate: true });
        methods.trigger('contents');
    };

    const params = useParams();

    const onClickSubmit = async (data: FormData) => {
        //  등록하기
        if (!isEdit) {
            try {
                const result = await create_travel_product({
                    variables: {
                        createTravelproductInput: {
                            name: data.name,
                            remarks: data.remarks,
                            contents: data.contents,
                            price: Number(data.price),
                            tags: data.tags
                                ?.split(/[,\s]+/) // 쉼표나 공백 문자가 1개 이상 있는 부분을 찾아줘 -> "가나다, abc def,   xyz" => ["가나다", "abc", "def", "xyz"]
                                .map((el) => el.replace(/^#+/, '').trim()) //  # 있으면 제거 후 남아 있을 수도 있는 불필요한 앞뒤 공백 제거
                                .filter((el) => el !== ''), // 실수로 쉼표만 입력해서 생긴 빈 값을 제외할 수 있음
                            travelproductAddress: {
                                zipcode: data.travelproductAddress?.zipcode,
                                address: postAddress,
                                addressDetail: data.travelproductAddress?.addressDetail,
                                lat: data.travelproductAddress?.lat,
                                lng: data.travelproductAddress?.lng,
                            },
                            images: imgUrl,
                        },
                    },
                });

                // 주소 state 초기화
                setPostAddress('');

                router.replace(`/travelProduct/${result.data.createTravelproduct._id}?create=true`);
            } catch (error) {
                console.log((error as Error).message);
            }
        } else {
            // //////////////////////////// 수정하기 ////////////////////////////
            try {
                await update_travel_product({
                    variables: {
                        travelproductId: params.productId,
                        updateTravelproductInput: {
                            name: data.name,
                            remarks: data.remarks,
                            contents: data.contents,
                            price: data.price,
                            tags: data.tags
                                ?.split(/[,\s]+/)
                                .map((el) => el.replace(/^#+/, '').trim())
                                .filter((el) => el !== ''),
                            travelproductAddress: {
                                zipcode: data.travelproductAddress?.zipcode,
                                address: postAddress,
                                addressDetail: data.travelproductAddress?.addressDetail,
                                lat: data.travelproductAddress?.lat,
                                lng: data.travelproductAddress?.lng,
                            },
                            images: imgUrl,
                        },
                    },
                });

                // 주소 state 초기화
                setPostAddress('');

                router.replace(`/travelProduct/${params.productId}?edit=true`);
            } catch (error) {
                console.log((error as Error).message);
            }
        }
    };

    return {
        methods,
        onClickSubmit,
        onChangeContents,
        onClickAddressShow,
        isModalOpen,
        handleOk,
        handleCancel,
        handleComplete,
        imgUrl,
        fileRef,
        onChangeUrl,
        onClickFile,
        onClickDelete,
    };
}
