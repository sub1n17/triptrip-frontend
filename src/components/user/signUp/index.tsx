'use client';

import Image from 'next/image';
import useSignUp from './hook';
import style from './styles.module.css';
import { Modal } from 'antd';
import Link from 'next/link';

export default function SignUp() {
    const {
        email,
        name,
        password,
        passwordCheck,
        emailError,
        nameError,
        passwordError,
        passwordCheckError,
        onchangeEmail,
        onchangeName,
        onchangePassword,
        onchangePasswordCheck,
        onClickSignUp,
        isModalOpen,
        handleOk,
    } = useSignUp();
    return (
        <>
            <div className={style.signup_wrapper}>
                <div className={style.signup_txt}>회원가입</div>
                <div className={style.signup_subTxt}>
                    회원가입을 위해 아래 빈칸을 모두 채워 주세요.
                </div>
                <div className={style.input_container}>
                    <div className={style.input_wrapper}>
                        <div className={style.input_title}>
                            이메일 <span>*</span>
                        </div>
                        <input
                            type="email"
                            placeholder="이메일을 입력해 주세요."
                            onChange={onchangeEmail}
                            value={email}
                            name="email"
                            autoComplete="email"
                        />
                        {emailError && <div className={style.error_txt}>{emailError}</div>}
                    </div>
                    <div className={style.input_wrapper}>
                        <div className={style.input_title}>
                            이름 <span>*</span>
                        </div>
                        <input
                            type="text"
                            placeholder="이름을 입력해 주세요."
                            onChange={onchangeName}
                            value={name}
                            name="name"
                            autoComplete="name"
                        />
                        {nameError && <div className={style.error_txt}>{nameError}</div>}
                    </div>
                    <div className={style.input_wrapper}>
                        <div className={style.input_title}>
                            비밀번호 <span>* </span>
                        </div>
                        <input
                            type="password"
                            placeholder="비밀번호를 입력해 주세요."
                            onChange={onchangePassword}
                            value={password}
                            name="password"
                            autoComplete="new-password"
                        />
                        {passwordError && <div className={style.error_txt}>{passwordError}</div>}
                    </div>
                    <div className={style.input_wrapper}>
                        <div className={style.input_title}>
                            비밀번호 확인 <span>*</span>
                        </div>
                        <input
                            type="password"
                            placeholder="비밀번호를 입력해 주세요."
                            onChange={onchangePasswordCheck}
                            value={passwordCheck}
                            name="password"
                            autoComplete="new-password"
                        />
                        {passwordCheckError && (
                            <div className={style.error_txt}>{passwordCheckError}</div>
                        )}
                    </div>
                </div>
                <button className={style.signup_btn} onClick={onClickSignUp}>
                    회원가입
                </button>
            </div>
            <Modal
                open={isModalOpen}
                onOk={handleOk}
                footer={null}
                centered
                closable={false}
                className={style.signup_modal}
                styles={{
                    body: {
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                    },
                }}
            >
                <div className={style.modal_txt}>회원가입을 축하드립니다.</div>
                <Image
                    src={'/images/signup_logo.png'}
                    alt="trip trip"
                    width={77}
                    height={48}
                    className={style.modal_img}
                ></Image>
                <Link href={'/user/logIn'} className={style.btn_goLogin}>
                    로그인 하기
                </Link>
            </Modal>
        </>
    );
}
