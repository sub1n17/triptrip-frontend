import { useTokenStore } from '@/commons/stores/token';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { message } from 'antd';
import * as PortOne from '@portone/browser-sdk/v2';
import { v4 as uuidv4 } from 'uuid';
import { useMutation, useQuery } from '@apollo/client';
import { usePointModalStore } from '@/commons/stores/pointModal';
import {
    CREATE_POINT_TRANSACTION_OF_LOADING,
    FETCH_POINT_LOADING,
    FETCH_POINT_TRANSACTIONS,
    FETCH_USER_LOGGED_IN,
    LOGOUT,
} from './queries';

export default function UseNavigation() {
    const { accessToken } = useTokenStore();

    const router = useRouter();
    const onClickLogin = () => {
        router.push('/user/logIn');
    };

    const pathname = usePathname();
    const searchParams = useSearchParams();
    const onClickProtected = (event: React.MouseEvent<HTMLAnchorElement>) => {
        if (!accessToken) {
            message.error('로그인 후 이용 가능합니다.');
            event?.preventDefault(); // Link 이동 막기 (a태그처럼 페이지 이동하는 기본적인 동작이 있기 때문에 막아주기 )

            // 로그인 완료 후 원래 보던 페이지로 이동시키기 위해 url 반영하기
            const redirect =
                pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');
            router.push(`/user/logIn?redirect=${encodeURIComponent(redirect)}`);
            return;
        }
    };

    // 프로필 클릭 시 메뉴 활성화
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const onClickProfileToggle = () => {
        setIsProfileOpen((prev) => !prev);
    };

    // 포인트 충전 버튼 클릭 시 모달창
    const { isChargeModalOpen, openChargeModal, closeChargeModal } = usePointModalStore();

    // 포인트 충전 select
    const [selectedAmount, setSelectedAmount] = useState('100'); // 선택된 금액 저장
    const handleChange = (value: string) => {
        setSelectedAmount(value.replace(/,/g, '')); // 선택할 때마다 상태에 저장, 쉼표 제거
    };

    const [createPointTransactionOfLoading] = useMutation(CREATE_POINT_TRANSACTION_OF_LOADING);

    // 포트원 포인트 충전
    const onClickChargePay = async () => {
        try {
            const result = await PortOne.requestPayment({
                storeId: 'store-abc39db7-8ee1-4898-919e-0af603a68317',
                paymentId: uuidv4(),
                orderName: '포인트 충전',
                totalAmount: Number(selectedAmount),
                currency: 'CURRENCY_KRW',
                channelKey: 'channel-key-1dc10cea-ec89-471d-aedf-f4bd68993f33',
                payMethod: 'EASY_PAY',
            });

            //  결제 성공
            if (result?.transactionType === 'PAYMENT' && !result?.code) {
                message.success('포인트가 충전되었습니다.');

                await createPointTransactionOfLoading({
                    variables: {
                        paymentId: result.paymentId,
                    },
                    refetchQueries: [
                        { query: FETCH_USER_LOGGED_IN },
                        {
                            query: FETCH_POINT_TRANSACTIONS,
                            variables: { search: '', page: 1 },
                        },
                        {
                            query: FETCH_POINT_LOADING,
                            variables: { search: '', page: 1 },
                        },
                    ],
                });
            } else {
                message.error('포인트가 충전되지 않았습니다.');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const { data } = useQuery(FETCH_USER_LOGGED_IN, { fetchPolicy: 'network-only' });

    // 로그아웃
    const [logout] = useMutation(LOGOUT);
    const { setAccessToken } = useTokenStore();
    const onClickLogout = async () => {
        await logout();
        setAccessToken(''); // 토큰 지우기
        router.replace('/');
    };

    return {
        onClickLogin,
        onClickProtected,
        isProfileOpen,
        onClickProfileToggle,
        isChargeModalOpen,
        openChargeModal,
        closeChargeModal,
        handleChange,
        onClickChargePay,
        data,
        onClickLogout,
    };
}
