'use client';

import Image from 'next/image';
import style from './styles.module.css';

const imgSrc = {
    rightArr: '/icons/my_right.svg',
};

interface IMyPageMenuProps {
    activeTab: string;
    setActiveTab: React.Dispatch<React.SetStateAction<string>>;
}

export default function MyPageMenu({ activeTab, setActiveTab }: IMyPageMenuProps) {
    return (
        <div>
            <div className={style.menu_wrapper}>
                <button
                    className={`${style.menuBtn_wrapper} ${
                        activeTab === 'history' ? style.active : ''
                    }`}
                    onClick={() => setActiveTab('history')}
                >
                    <div className={style.menu_txt}>거래내역 & 북마크</div>
                    <div className={style.arr_img}>
                        <Image src={imgSrc.rightArr} alt="화살표" width={0} height={0}></Image>
                    </div>
                </button>
                <button
                    className={`${style.menuBtn_wrapper} ${
                        activeTab === 'point' ? style.active : ''
                    }`}
                    onClick={() => setActiveTab('point')}
                >
                    <div className={style.menu_txt}>포인트 사용 내역</div>
                    <div className={style.arr_img}>
                        <Image src={imgSrc.rightArr} alt="화살표" width={0} height={0}></Image>
                    </div>
                </button>
                <button
                    className={`${style.menuBtn_wrapper} ${
                        activeTab === 'password' ? style.active : ''
                    }`}
                    onClick={() => setActiveTab('password')}
                >
                    <div className={style.menu_txt}>비밀번호 변경</div>
                    <div className={style.arr_img}>
                        <Image src={imgSrc.rightArr} alt="화살표" width={0} height={0}></Image>
                    </div>
                </button>
            </div>
        </div>
    );
}
