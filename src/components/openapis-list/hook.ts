'use client';

import { useEffect, useState } from 'react';
import { Cat } from './type';

export default function UseCatList() {
    const [catList, setCatList] = useState<Cat[]>([]);

    // 맨처음 고양이 사진 보여주기 (초기값)
    useEffect(() => {
        fetch('https://api.thecatapi.com/v1/images/search?limit=10').then((result) => {
            result.json().then((data) => {
                console.log(data);
                setCatList(data);
            });
        });
    }, []);

    // 스크롤이 맨끝에 닿았을 때 실행할 함수
    const onNext = async () => {
        fetch('https://api.thecatapi.com/v1/images/search?limit=10').then((result) => {
            result.json().then((data) => {
                setCatList((prev) => [...prev, ...data]);
            });
        });
    };
    return { catList, onNext };
}
