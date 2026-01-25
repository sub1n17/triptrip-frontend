'use client';

import { ChangeEvent, useState } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_USER } from './types';
import { message } from 'antd';

export default function useSignUp() {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [passwordCheck, setPasswordCheck] = useState('');

    // 에러메시지
    let isValid = true;
    const [emailError, setEmailError] = useState('');
    const [nameError, setNameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [passwordCheckError, setPasswordCheckError] = useState('');

    const onchangeEmail = (event: ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    };
    const onchangeName = (event: ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    };
    const onchangePassword = (event: ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };
    const onchangePasswordCheck = (event: ChangeEvent<HTMLInputElement>) => {
        setPasswordCheck(event.target.value);
    };

    const [create_user] = useMutation(CREATE_USER);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const onClickSignUp = async () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            setEmailError('이메일을 입력해 주세요.');
            isValid = false;
        } else if (!emailRegex.test(email)) {
            setEmailError('이메일 형식이 올바르지 않습니다.');
            isValid = false;
        } else {
            setEmailError('');
        }

        if (!name) {
            setNameError('이름을 입력해 주세요.');
            isValid = false;
        } else {
            setNameError('');
        }

        if (!password) {
            setPasswordError('비밀번호를 입력해 주세요.');
            isValid = false;
        } else {
            setPasswordError('');
        }

        if (!passwordCheck) {
            setPasswordCheckError('비밀번호가 일치히지 않습니다.');
            isValid = false;
        } else if (password !== passwordCheck) {
            setPasswordCheckError('비밀번호가 일치히지 않습니다.');
            isValid = false;
        } else {
            setPasswordCheckError('');
        }

        // 에러메시지 없을 때 try-catch 통과시키기
        if (!isValid) return;

        if (email && name && password && passwordCheck) {
            try {
                const result = await create_user({
                    variables: {
                        email: email,
                        name: name,
                        password: password,
                    },
                });
                console.log(result);
                setIsModalOpen(true);
            } catch (error) {
                message.error((error as Error).message);
            }
        }
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    return {
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
    };
}
