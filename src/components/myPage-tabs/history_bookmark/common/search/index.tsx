'use client';

import Image from 'next/image';
import style from './styles.module.css';

const imgSrc = {
    search: '/images/search.png',
};

export default function Search() {
    return (
        <div className={style.search_container}>
            <div className={style.search_wrapper}>
                <div className={style.input_wrapper}>
                    <Image src={imgSrc.search} alt="검색이미지" width={24} height={24}></Image>
                    <input
                        type="text"
                        className={style.input_search}
                        placeholder="제목을 검색해 주세요."
                    ></input>
                </div>
                <button className={style.btn_search}>검색</button>
            </div>
        </div>
    );
}
