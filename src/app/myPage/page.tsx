'use client';

import Image from 'next/image';
import style from './styles.module.css';
import MyPageMenu from '@/components/myPage-menu';
import PointPage from './point/page';
import PasswordPage from './password/page';
import HistoryBookmarkPage from '@/components/myPage-tabs/history_bookmark';
import { useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import { withLoginCheck } from '@/commons/hocs/withLoginCheck';

const imgSrc = {
    profile: '/images/myPage_profileImg.png',
    profile2: '/images/profile.svg',
    point: '/icons/point.svg',
};

const FETCH_USER_LOGGED_IN = gql`
    query fetchUserLoggedIn {
        fetchUserLoggedIn {
            _id
            email
            name
            userPoint {
                amount
            }
        }
    }
`;

function MyPage() {
    const [activeTab, setActiveTab] = useState('history');

    const { data } = useQuery(FETCH_USER_LOGGED_IN, {
        fetchPolicy: 'network-only',
    });

    return (
        <main className={style.myPage_wrapper}>
            <div className={style.title}>마이 페이지</div>
            <div className={style.myPage_top}>
                <div className={style.top_title}>내 정보</div>
                <div className={style.profile_wrapper}>
                    <div className={style.profile_img}>
                        <Image
                            src={imgSrc.profile2}
                            alt="프로필"
                            fill
                            sizes="40px"
                            priority
                        ></Image>
                    </div>
                    <div className={style.profile_name}>{data?.fetchUserLoggedIn.name} </div>
                </div>
                <div className={style.point_wrapper}>
                    <div className={style.point_img}>
                        <Image src={imgSrc.point} alt="포인트" fill sizes="24px"></Image>
                    </div>
                    <div className={style.point_txt}>
                        {data?.fetchUserLoggedIn.userPoint.amount.toLocaleString()} P
                    </div>
                </div>
                <MyPageMenu activeTab={activeTab} setActiveTab={setActiveTab}></MyPageMenu>
            </div>
            <div className={style.menu_contents}>
                {activeTab === 'history' ? <HistoryBookmarkPage></HistoryBookmarkPage> : ''}
                {activeTab === 'point' ? <PointPage></PointPage> : ''}
                {activeTab === 'password' ? <PasswordPage></PasswordPage> : ''}
            </div>
        </main>
    );
}

export default withLoginCheck(MyPage);
