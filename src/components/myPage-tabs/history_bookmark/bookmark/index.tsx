'use client';

import { useQuery } from '@apollo/client';
import style from './styles.module.css';
import { useRouter } from 'next/navigation';
import { FetchTravelproductsIPickedDocument } from '@/commons/graphql/graphql';

// const FETCH_TRAVELPRODUCTS_IPICKED = gql`
//     query fetchTravelproductsIPicked($search: String, $page: Int) {
//         fetchTravelproductsIPicked(search: $search, page: $page) {
//             _id
//             name
//             price
//             seller {
//                 name
//             }
//             createdAt
//         }
//     }
// `;

export default function Bookmark() {
    const { data } = useQuery(FetchTravelproductsIPickedDocument, {
        variables: { search: '', page: 1 },
        fetchPolicy: 'network-only', // 항상 새 데이터 받아오기
    });

    const router = useRouter();
    const onClickDetail = (id: string) => {
        router.push(`/travelProduct/${id}`);
    };

    return (
        <>
            <div className={style.list_wrapper}>
                <div className={`${style.flex_wrap} ${style.list_title}`}>
                    <div className={style.board_number}>번호</div>
                    <div className={style.board_title}>상품명</div>
                    <div className={style.board_writer}>판매 가격</div>
                    <div className={style.board_date}>판매자</div>
                    <div className={style.board_date}>날짜</div>
                </div>
                <div className={style.board_wrap}>
                    {data?.fetchTravelproductsIPicked.length === 0 ? (
                        <div className={style.noBookmark}>북마크한 상품이 없습니다.</div>
                    ) : (
                        data?.fetchTravelproductsIPicked.map((el, index: number) => (
                            <button
                                key={el._id}
                                onClick={() => onClickDetail(el._id)}
                                className={`${style.flex_wrap} ${style.board_list}`}
                            >
                                <div className={style.board_number}>{index + 1}</div>
                                <div className={style.board_title}>{el.name}</div>
                                <div className={style.board_writer}>
                                    {el.price?.toLocaleString()}
                                </div>
                                <div className={style.board_writer}>{el?.seller?.name}</div>
                                <div className={style.board_date}>
                                    {el.createdAt.slice(0, 10).split('-').join('.')}
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </div>
        </>
    );
}
