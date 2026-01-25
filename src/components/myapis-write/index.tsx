/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { ChangeEvent, useEffect, useState } from 'react';
import style from './styles.module.css';

import { addDoc, collection, doc, getFirestore, updateDoc } from 'firebase/firestore/lite';
import { firebaseApp } from '@/commons/libraries/firebase';
import { useParams, useRouter } from 'next/navigation';

export default function ApiWrite({ isEdit, data }: { isEdit: boolean; data?: any }) {
    const [writer, setWriter] = useState('');
    const [password, setPassword] = useState('');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const onChangeWriter = (event: ChangeEvent<HTMLInputElement>) => {
        setWriter(event.target.value);
    };

    const onChangePassword = (event: ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    const onChangeTitle = (event: ChangeEvent<HTMLInputElement>) => {
        setTitle(event.target.value);
    };

    const onChangeContent = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setContent(event.target.value);
    };

    const router = useRouter();
    const param = useParams();
    const id = String(param.myapiId);

    useEffect(() => {
        if (isEdit && data) {
            setWriter(data.writer);

            setTitle(data.title);
            setContent(data.content);
        }
    }, [isEdit, data]);

    const onClickSubmit = async () => {
        // 수정하기 페이지
        if (isEdit) {
            try {
                const db = getFirestore(firebaseApp);

                // 🔹 특정 문서(id)의 경로를 지정해야 함
                const docRef = doc(db, 'myAPI', id);

                if (data.password !== password) {
                    throw new Error('비밀번호가 일치하지 않습니다.');
                }

                await updateDoc(docRef, {
                    title: title,
                    writer: writer,
                    content: content,
                });
                router.push(`/myapis/${id}`);
            } catch (error) {
                alert((error as Error).message);
                // console.error('업데이트 실패:', error);
            }
        } else {
            // 등록하기 페이지
            const myAPI = collection(getFirestore(firebaseApp), 'myAPI'); // 'boards' 라는 테이블(컬렉션)

            // 데이터 추가하기
            const result = await addDoc(myAPI, {
                writer: writer,
                password: password,
                title: title,
                content: content,
            });
            console.log(result.id);

            // 해당 아이디로 이동
            router.push(`/myapis/${result.id}`);
        }
    };

    return (
        <>
            <div className={`${style.input_wrapper} ${style.name_wrapper}`}>
                <div className={style.name_box}>
                    <p>
                        작성자 <span>*</span>
                    </p>
                    <input
                        type="text"
                        placeholder="작성자 명을 입력해 주세요."
                        className={style.input_wrapperInput}
                        onChange={onChangeWriter}
                        value={writer}
                    />
                </div>
                <div className={style.pw_box}>
                    <p>
                        비밀번호 <span>*</span>
                    </p>
                    <input
                        placeholder="비밀번호를 입력해 주세요."
                        className={style.input_wrapperInput}
                        onChange={onChangePassword}
                        value={password}
                    ></input>
                </div>
            </div>
            {/* 작성자, 비밀번호 */}
            <div className={style.input_wrapper}>
                <div>
                    <p>
                        제목 <span>*</span>
                    </p>
                    <input
                        placeholder="제목을 입력해 주세요."
                        className={style.input_wrapperInput}
                        onChange={onChangeTitle}
                        value={title}
                    ></input>
                </div>
            </div>
            {/* 제목 */}
            <div className={style.input_wrapper}>
                <div>
                    <p>
                        내용 <span>*</span>
                    </p>
                    <textarea
                        placeholder="내용을 입력해 주세요."
                        className={style.input_wrapperInput}
                        onChange={onChangeContent}
                        value={content}
                    ></textarea>
                </div>
            </div>

            <div className={style.btn_wrapper}>
                <div className={style.btn_inner}>
                    <button className={style.cancel}>취소</button>
                    <button onClick={onClickSubmit}> {isEdit ? '수정' : '등록'}</button>
                </div>
            </div>
        </>
    );
}
