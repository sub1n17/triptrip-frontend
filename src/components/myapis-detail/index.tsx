'use client';

import { collection, doc, getDoc, getFirestore } from 'firebase/firestore/lite';
import style from './styles.module.css';
import { firebaseApp } from '@/commons/libraries/firebase';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface IMyAPI {
    writer?: string;
    title?: string;
    content?: string;
}

export default function MyApiDetail() {
    const [result, setResult] = useState<IMyAPI>({});

    const param = useParams();
    console.log(param);
    const id = String(param.myapiId);

    const router = useRouter();

    useEffect(() => {
        async function fetchData() {
            const myAPI = collection(getFirestore(firebaseApp), 'myAPI');
            const data = await getDoc(doc(myAPI, id)); //myAPI 컬렉션 안의 해당 id 문서를 가져올게
            console.log(data);

            if (data.exists()) {
                setResult(data.data());
            } else {
                console.log('문서가 없습니다.');
            }
        }
        fetchData();
    }, [id]);
    // ㄴ> useParams로 가져온 id가 undefined일 수도 있는데 getDoc과 같은 비동기작업을 요청하면 에러남

    const onClickList = () => {
        router.push('./');
    };

    const onClickEdit = () => {
        router.push(`/myapis/${id}/edit`);
    };

    return (
        <div className={style.detail_wrapper}>
            <div className={style.container}>
                <div className={style.detail_top}>
                    <div className={style.detail_title}>{result.title} </div>
                    <div className={style.name_date}>
                        <div className={style.name}>
                            <p>{result.writer} </p>
                        </div>
                    </div>
                </div>
                <div className={style.detail_center}>
                    <div className={style.txt_wrap}>{result.content}</div>
                </div>

                <div className={style.detail_btn_wrapper}>
                    <button className={style.list_wrapper} onClick={onClickList}>
                        <p>목록</p>
                    </button>
                    <button className={style.modify_wrapper} onClick={onClickEdit}>
                        <p>수정</p>
                    </button>
                </div>
            </div>
        </div>
    );
}
