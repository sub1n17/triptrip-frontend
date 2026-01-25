'use client';

import { useQuery } from '@apollo/client';
import PointListItem from '../common/listItem/listItem';
import style from './styles.module.css';
import { FetchPointTransactionsOfBuyingDocument } from '@/commons/graphql/graphql';

// const FETCH_POINT_BUYING = gql`
//     query fetchPointTransactionsOfBuying($search: String, $page: Int) {
//         fetchPointTransactionsOfBuying(search: $search, page: $page) {
//             createdAt
//             travelproduct {
//                 name
//                 # seller {
//                 #     name
//                 # }
//             }
//             amount
//             balance
//         }
//     }
// `;

export default function Buy() {
    const { data, loading } = useQuery(FetchPointTransactionsOfBuyingDocument, {
        variables: { search: '', page: 1 },
    });
    if (loading) return null;
    return (
        <>
            <div className={style.list_wrapper}>
                <div className={`${style.flex_wrap} ${style.list_title}`}>
                    <div className={style.list_date}>거래일</div>
                    <div className={style.list_product}>상품명</div>
                    <div className={style.list_history}>거래 내역</div>
                    <div className={style.list_balance}>거래 후 잔액</div>
                    {/* <div className={style.list_seller}>판매자</div> */}
                </div>
                <div className={style.board_wrap}>
                    {data?.fetchPointTransactionsOfBuying.length === 0 ? (
                        <div style={{ color: '#999', textAlign: 'center' }}>
                            포인트 구매내역이 없습니다.
                        </div>
                    ) : (
                        data?.fetchPointTransactionsOfBuying.map((el, index: number) => (
                            <PointListItem
                                key={index}
                                type="buy"
                                createdAt={el.createdAt}
                                product={el.travelproduct?.name}
                                amount={el.amount}
                                balance={el.balance}
                                // seller={el?.travelproduct.seller}
                            ></PointListItem>
                        ))
                    )}
                </div>
            </div>
        </>
    );
}
