'use client';

import { gql, useQuery } from '@apollo/client';
import PointListItem from '../common/listItem/listItem';
import style from './styles.module.css';

const FETCH_POINT_LOADING = gql`
    query fetchPointTransactionsOfLoading($search: String, $page: Int) {
        fetchPointTransactionsOfLoading(search: $search, page: $page) {
            createdAt
            impUid
            amount
            balance
        }
    }
`;

export default function Charge() {
    const { data } = useQuery(FETCH_POINT_LOADING, {
        variables: { search: '', page: 1 },
    });

    return (
        <>
            <div className={style.list_wrapper}>
                <div className={`${style.flex_wrap} ${style.list_title}`}>
                    <div className={style.list_date}>충전일</div>
                    <div className={style.list_paymentId}>결제 ID</div>
                    <div className={style.list_history}>충전 내역</div>
                    <div className={style.list_balance}>거래 후 잔액</div>
                </div>
                <div className={style.board_wrap}>
                    {data?.fetchPointTransactionsOfLoading.length === 0 ? (
                        <div style={{ color: '#999', textAlign: 'center' }}>
                            포인트 충전내역이 없습니다.
                        </div>
                    ) : (
                        data?.fetchPointTransactionsOfLoading.map((el, index: number) => (
                            <PointListItem
                                key={index}
                                type="charge"
                                createdAt={el.createdAt}
                                impUid={el.impUid}
                                amount={el.amount}
                                balance={el.balance}
                            ></PointListItem>
                        ))
                    )}
                </div>
            </div>
        </>
    );
}
