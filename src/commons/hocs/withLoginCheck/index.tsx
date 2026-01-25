'use client';

import React from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTokenStore } from '../../stores/token';
import { useEffect } from 'react';
import { useLoadStore } from '../../stores/load';
import { message } from 'antd';

export const withLoginCheck = (WrappedComponent: any) => {
    const WithLoginCheck = (props: any) => {
        const { accessToken } = useTokenStore();
        const { isLoaded } = useLoadStore();
        const router = useRouter();
        const pathname = usePathname();
        const searchParams = useSearchParams();

        useEffect(() => {
            if (!isLoaded) return;
            if (accessToken) return;

            message.warning('로그인 후 이용 가능합니다.');

            const redirect =
                pathname + (searchParams.toString ? `?${searchParams.toString()}` : '');

            // router.push('/user/logIn');
            router.replace(`/user/logIn?redirect=${encodeURIComponent(redirect)}`);
        }, [isLoaded]);

        if (!accessToken) return null; // 로그인 안 됐으면 아무것도 렌더링 안 함

        return <WrappedComponent {...props} />; // 렌더링할 JSX 반환
    };

    // displayName 명시
    WithLoginCheck.displayName = `withLoginCheck(${
        WrappedComponent.displayName || WrappedComponent.name || 'Component'
    })`;

    return WithLoginCheck;
};
