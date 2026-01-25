'use client';

import { gql, useQuery } from '@apollo/client';
import PointListItem from '../common/listItem/listItem';
import style from './styles.module.css';

const FETCH_POINT_TRANSACTIONS = gql`
    query fetchPointTransactions($search: String, $page: Int) {
        fetchPointTransactions(search: $search, page: $page) {
            _id
            createdAt
            status
            amount
            balance
        }
    }
`;

export default function Total() {
    const { data } = useQuery(FETCH_POINT_TRANSACTIONS, {
        variables: { search: '', page: 1 },
    });

    return (
        <>
            <div className={style.list_wrapper}>
                <div className={`${style.flex_wrap} ${style.list_title}`}>
                    <div className={style.list_date}>날짜</div>
                    <div className={style.list_description}>내용</div>
                    <div className={style.list_history}>거래 및 충전 내역</div>
                    <div className={style.list_balance}>잔액</div>
                </div>
                <div className={style.board_wrap}>
                    {data?.fetchPointTransactions.length === 0 ? (
                        <div style={{ textAlign: 'center', color: '#999' }}>
                            포인트 사용 내역이 없습니다.
                        </div>
                    ) : (
                        data?.fetchPointTransactions.map((el) =>
                            data?.fetchPointTransactions.length === 0 ? (
                                <div key={el._id} style={{ textAlign: 'center', color: '#999' }}>
                                    포인트 사용 내역이 없습니다.
                                </div>
                            ) : (
                                <PointListItem
                                    key={el._id}
                                    type="total"
                                    createdAt={el.createdAt}
                                    status={el.status}
                                    amount={el.amount}
                                    balance={el.balance}
                                ></PointListItem>
                            ),
                        )
                    )}
                </div>
            </div>
        </>
    );
}
