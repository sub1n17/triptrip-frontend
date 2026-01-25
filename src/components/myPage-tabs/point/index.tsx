'use client';

import Buy from './buy';
import Charge from './charge';
import Sell from './sell';
import Total from './total';
import style from './styles.module.css';
import { useState } from 'react';

export default function Point() {
    const [activeTab, setActiveTab] = useState('total');

    return (
        <>
            <div className={style.tabBtn_wrapper}>
                <button
                    className={`${style.tabBtn} ${activeTab === 'total' ? style.active : ''} `}
                    onClick={() => setActiveTab('total')}
                >
                    전체
                </button>
                <button
                    className={`${style.tabBtn} ${activeTab === 'charge' ? style.active : ''}`}
                    onClick={() => setActiveTab('charge')}
                >
                    충전내역
                </button>
                <button
                    className={`${style.tabBtn} ${activeTab === 'buy' ? style.active : ''}`}
                    onClick={() => setActiveTab('buy')}
                >
                    구매내역
                </button>
                <button
                    className={`${style.tabBtn} ${activeTab === 'sell' ? style.active : ''}`}
                    onClick={() => setActiveTab('sell')}
                >
                    판매내역
                </button>
            </div>

            <div className={style.tabContent_wrapper}>
                {activeTab === 'total' && <Total></Total>}
                {activeTab === 'charge' && <Charge></Charge>}
                {activeTab === 'buy' && <Buy></Buy>}
                {activeTab === 'sell' && <Sell></Sell>}
            </div>
        </>
    );
}
