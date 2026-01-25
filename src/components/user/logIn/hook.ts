'use client';

import { useMutation } from '@apollo/client';
import { ChangeEvent, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTokenStore } from '@/commons/stores/token';
import { LOGIN_USER } from './types';
import { message } from 'antd';

export default function useLogIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // 에러메시지
    const [errorTxt, setErrorTxt] = useState('');

    // 토큰
    const { setAccessToken } = useTokenStore();

    const onChangeEmail = (event: ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    };
    const onChangePassword = (event: ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    const searchParams = useSearchParams();
    const redirect = searchParams.get('redirect');

    const [login_user] = useMutation(LOGIN_USER);
    const router = useRouter();
    const onClickLogIn = async () => {
        if (email === '' || password === '') {
            setErrorTxt('아이디 또는 비밀번호를 확인해 주세요.');
            return;
        }

        try {
            const result = await login_user({
                variables: {
                    email: email,
                    password: password,
                },
            });
            // console.log(result.data.loginUser.accessToken);
            const accessToken = result.data.loginUser.accessToken;
            if (!accessToken) {
                setErrorTxt('로그인에 실패했습니다. 다시 시도해 주세요.');
            }

            setAccessToken(accessToken);
            // router.push('/boards');

            // 원래 보던 페이지가 없으면 기본 메인페이지로 이동
            if (redirect) {
                router.replace(decodeURIComponent(redirect));
            } else {
                router.replace('/boards');
            }
        } catch (error) {
            message.error((error as Error).message);
        }
    };

    // 회원가입
    const onClickSignUp = () => {
        router.push('/user/signUp');
    };

    return {
        onChangeEmail,
        email,
        onChangePassword,
        password,
        errorTxt,
        onClickLogIn,
        onClickSignUp,
    };
}
