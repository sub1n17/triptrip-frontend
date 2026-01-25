'use client';

import style from './styles.module.css';

import { firebaseApp } from '@/commons/libraries/firebase';
import { collection, getDocs, getFirestore } from 'firebase/firestore/lite';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface IMyAPI {
    id: string;
    title?: string;
    content?: string;
    writer?: string;
}

export default function MyApiList() {
    const [apiList, setApiList] = useState<IMyAPI[]>([]);

    useEffect(() => {
        async function showList() {
            const myAPI = collection(getFirestore(firebaseApp), 'myAPI');
            const list = await getDocs(myAPI);

            const dataList = list.docs.map((el) => {
                return {
                    id: el.id,
                    title: el.data().title,
                    writer: el.data().writer,
                    content: el.data().content,
                };
            });
            setApiList(dataList);
        }
        showList();
    }, []);

    const router = useRouter();
    const onClickDetail = (id: string) => {
        router.push(`/myapis/${id}`);
    };

    return (
        <>
            <div className={`${style.flex_wrap} ${style.list_title}`}>
                <div className={style.board_number}>번호</div>
                <div className={style.board_title}>제목</div>
                <div className={style.board_writer}>작성자</div>
            </div>

            <div className={style.board_wrap}>
                {apiList.map((el, index) => (
                    <button
                        key={el.id}
                        onClick={() => onClickDetail(el.id)}
                        className={`${style.flex_wrap} ${style.board_list}`}
                    >
                        <div className={style.board_number}>{index + 1}</div>
                        <div className={style.board_title}>{el.title}</div>
                        <div className={style.board_writer}>{el.writer}</div>
                    </button>
                ))}
            </div>
        </>
    );
}
