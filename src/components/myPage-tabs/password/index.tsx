'use client';

import { ChangeEvent, useEffect, useState } from 'react';
import style from './styles.module.css';
import { gql, useMutation } from '@apollo/client';
import { message } from 'antd';
import { useRouter } from 'next/navigation';

const RESET_USER_PASSWORD = gql`
    mutation resetUserPassword($password: String!) {
        resetUserPassword(password: $password)
    }
`;

const LOGOUT_USER = gql`
    mutation logoutUser {
        logoutUser
    }
`;

export default function Password() {
    const [password, setPassword] = useState('');
    const [passwordCheck, setPasswordCheck] = useState('');

    const [activeBtn, setActiveBtn] = useState(false);

    const [errorPwTxt, setErrorPwTxt] = useState(false);
    const [errorPwCheckTxt, setErrorPwCheckTxt] = useState(false);

    const onChangePassword = (event: ChangeEvent<HTMLInputElement>) => {
        setPassword(event?.target.value);
    };
    const onChangePasswordCheck = (event: ChangeEvent<HTMLInputElement>) => {
        setPasswordCheck(event?.target.value);
    };

    const router = useRouter();
    const [reset_password] = useMutation(RESET_USER_PASSWORD);
    const [logout_user] = useMutation(LOGOUT_USER);
    const onClickEdit = async () => {
        if (!password) {
            setErrorPwTxt(true);
        } else {
            setErrorPwTxt(false);
        }

        if (!passwordCheck) {
            setErrorPwCheckTxt(true);
        } else {
            setErrorPwCheckTxt(false);
        }

        if (password !== passwordCheck) {
            setErrorPwCheckTxt(true);
        } else {
            setErrorPwCheckTxt(false);
        }

        try {
            // 비밀번호 변경 요청
            await reset_password({
                variables: {
                    password: password,
                },
            });

            // 로그아웃 요청
            await logout_user();

            // 로그인 페이지로 이동
            router.replace('/user/logIn?pwChanged=true');
        } catch (error) {
            message.error((error as Error).message);
        }
    };

    useEffect(() => {
        if (password && passwordCheck) {
            setActiveBtn(true);
        } else {
            setActiveBtn(false);
        }
    }, [password, passwordCheck]);

    return (
        <>
            <div className={style.title}> 비밀번호 변경</div>
            <div className={style.input_container}>
                <div className={style.input_wrapper}>
                    <div className={style.input_txt}>
                        새 비밀번호 <span>*</span>
                    </div>
                    <input
                        type="password"
                        placeholder="새 비밀번호를 입력해 주세요."
                        onChange={onChangePassword}
                        value={password}
                        name="password"
                    />
                    <div
                        className={style.errorTxt}
                        style={{ display: errorPwTxt ? 'block' : 'none' }}
                    >
                        비밀번호를 입력해주세요.
                    </div>
                </div>
                <div className={style.input_wrapper}>
                    <div className={style.input_txt}>
                        새 비밀번호 확인<span>*</span>
                    </div>
                    <input
                        type="password"
                        placeholder="새 비밀번호를 확인해 주세요."
                        onChange={onChangePasswordCheck}
                        value={passwordCheck}
                        name="passwordCheck"
                    />
                    <div
                        className={style.errorTxt}
                        style={{ display: errorPwCheckTxt ? 'block' : 'none' }}
                    >
                        비밀번호가 일치하지 않습니다.
                    </div>
                </div>
            </div>
            <div className={style.btn_wrapper}>
                <button
                    className={`${style.edit_btn} ${activeBtn ? style.activeBtn : ''}`}
                    onClick={onClickEdit}
                >
                    비밀번호 변경
                </button>
            </div>
        </>
    );
}
