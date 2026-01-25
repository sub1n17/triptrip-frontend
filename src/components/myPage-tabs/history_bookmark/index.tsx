'use client';

import { useState } from 'react';
import Bookmark from './bookmark';
import History from './history';
import style from './styles.module.css';

export default function HistoryBookmarkPage() {
    const [activeTab, setActiveTab] = useState('history');

    return (
        <div>
            <div className={style.tabBtn_wrapper}>
                <button
                    className={`${style.tabBtn} ${activeTab === 'history' ? style.active : ''}`}
                    onClick={() => setActiveTab('history')}
                >
                    나의 상품
                </button>
                <button
                    className={`${style.tabBtn} ${activeTab === 'bookmark' ? style.active : ''}`}
                    onClick={() => setActiveTab('bookmark')}
                >
                    북마크
                </button>
            </div>
            <div className={style.tabContent_wrapper}>
                {activeTab === 'history' ? <History></History> : ''}
                {activeTab === 'bookmark' ? <Bookmark></Bookmark> : ''}
            </div>
        </div>
    );
}
