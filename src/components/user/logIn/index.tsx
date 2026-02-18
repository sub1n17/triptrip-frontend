'use client';

import Image from 'next/image';
import style from './styles.module.css';
import useLogIn from './hook';
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { message } from 'antd';

const imgSrc = {
    userLogo: '/images/login.svg',
};

export default function LogIn() {
    const {
        onChangeEmail,
        email,
        onChangePassword,
        password,
        errorTxt,
        onClickLogIn,
        onClickSignUp,
    } = useLogIn();

    const searchParams = useSearchParams();
    const pwChanged = searchParams.get('pwChanged');
    useEffect(() => {
        if (pwChanged === 'true') {
            message.success('비밀번호가 변경되었습니다. 다시 로그인해주세요.');
        }
    }, [pwChanged]);

    return (
        <div className={style.logIn_wrapper}>
            <div className={style.logo_img}>
                <Image src={imgSrc.userLogo} alt="로고" width={100} height={100}></Image>
            </div>
            <div className={style.welcome_txt}>트립트립에 오신 것을 환영합니다.</div>
            <div className={style.login_txt}>트립트립에 로그인 하세요.</div>

            <div className={style.input_wrapper}>
                <input
                    type="email"
                    placeholder="이메일을 입력해 주세요."
                    onChange={onChangeEmail}
                    value={email}
                    name="email"
                    autoComplete="email"
                />
                <input
                    type="password"
                    placeholder="비밀번호를 입력해 주세요."
                    onChange={onChangePassword}
                    value={password}
                    name="password"
                    autoComplete="current-password"
                />
            </div>
            <div className={style.error_txt}>{errorTxt}</div>

            <button className={style.login_btn} onClick={onClickLogIn}>
                로그인
            </button>
            <button className={style.signUp_btn} onClick={onClickSignUp}>
                회원가입
            </button>
        </div>
    );
}
