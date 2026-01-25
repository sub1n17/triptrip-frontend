'use client';

import { useQuery } from '@apollo/client';
import PointListItem from '../common/listItem/listItem';
import style from './styles.module.css';
import { FetchPointTransactionsOfSellingDocument } from '@/commons/graphql/graphql';

// const FETCH_POINT_SELLING = gql`
//     query fetchPointTransactionsOfSelling($search: String, $page: Int) {
//         fetchPointTransactionsOfSelling(search: $search, page: $page) {
//             createdAt
//             travelproduct {
//                 name
//             }
//             amount
//             balance
//         }
//     }
// `;
export default function Sell() {
    const { data } = useQuery(FetchPointTransactionsOfSellingDocument, {
        variables: { search: '', page: 1 },
    });
    return (
        <>
            <div className={style.list_wrapper}>
                <div className={`${style.flex_wrap} ${style.list_title}`}>
                    <div className={style.list_date}>거래일</div>
                    <div className={style.list_product}>상품명</div>
                    <div className={style.list_history}>거래 내역</div>
                    <div className={style.list_balance}>거래 후 잔액</div>
                </div>
                <div className={style.board_wrap}>
                    {data?.fetchPointTransactionsOfSelling.length === 0 ? (
                        <div style={{ color: '#999', textAlign: 'center' }}>
                            포인트 판매내역이 없습니다.
                        </div>
                    ) : (
                        data?.fetchPointTransactionsOfSelling.map((el, index: number) => (
                            <PointListItem
                                key={index}
                                type="sell"
                                createdAt={el.createdAt}
                                product={el.travelproduct?.name}
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
