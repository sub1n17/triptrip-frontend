'use client';

// import Image from 'next/image';
import style from './styles.module.css';
import { gql, useQuery } from '@apollo/client';
// import { Modal } from 'antd';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { FetchTravelproductsISoldQuery } from '@/commons/graphql/graphql';

// const imgSrc = {
//     deleteImg: '/images/delete.png',
// };

const FETCH_TRAVELPRODUCTS_ISOLD = gql`
    query fetchTravelproductsISold($page: Int) {
        fetchTravelproductsISold(page: $page) {
            _id
            name
            price
            createdAt
            soldAt
        }
    }
`;

// const DELETE_TRAVLE_PRODUCT = gql`
//     mutation deleteTravelproduct($travelproductId: ID!) {
//         deleteTravelproduct(travelproductId: $travelproductId)
//     }
// `;

export default function History() {
    const { data, refetch } = useQuery(FETCH_TRAVELPRODUCTS_ISOLD, {
        variables: {
            page: 1,
        },
    });

    // 숙박 상품 등록하고 바로 refetch 시키기
    useEffect(() => {
        refetch();
    }, [refetch]);

    // const [deleteTravelproduct] = useMutation(DELETE_TRAVLE_PRODUCT);
    // const onClickDelete =
    //     (delete_boardId: string) => async (event: React.MouseEvent<HTMLDivElement>) => {
    //         event.stopPropagation();

    //         try {
    //             await deleteTravelproduct({
    //                 variables: {
    //                     travelproductId: delete_boardId,
    //                 },

    //                 update(cache) {
    //                     cache.modify({
    //                         fields: {
    //                             fetchTravelproductsISold: (prev, { readField }) => {
    //                                 const deletedId = delete_boardId;
    //                                 const filteredId = prev.filter(
    //                                     (el: FetchTravelproductsISoldQuery) =>
    //                                         readField('_id', el) !== deletedId,
    //                                 );
    //                                 return [...filteredId];
    //                             },
    //                         },
    //                     });
    //                 },
    //             });
    //         } catch (error) {
    //             Modal.error({ title: '삭제 실패', content: (error as Error).message });
    //         }
    //     };

    const router = useRouter();
    const onClickDetail = (boardId: string) => {
        router.push(`/travelProduct/${boardId}`);
    };

    return (
        <div className={style.history_wrapper}>
            {/* <Search></Search> */}
            <div className={style.list_wrapper}>
                <div className={`${style.flex_wrap} ${style.list_title}`}>
                    <div className={style.board_number}>번호</div>
                    <div className={style.board_title}>상품명</div>
                    <div className={style.board_writer}>판매 가격</div>
                    <div className={style.board_date}>날짜</div>
                </div>
                <div className={style.board_wrap}>
                    {data?.fetchTravelproductsISold.length === 0 ? (
                        <div className={style.empty}>판매한 상품이 없습니다.</div>
                    ) : (
                        data?.fetchTravelproductsISold.map(
                            (
                                el: FetchTravelproductsISoldQuery['fetchTravelproductsISold'][0],
                                index: number,
                            ) => (
                                <button
                                    key={el._id}
                                    onClick={() => onClickDetail(el._id)}
                                    className={`${style.flex_wrap} ${style.board_list}`}
                                >
                                    <div className={style.board_number}>{index + 1}</div>
                                    <div
                                        className={style.board_title}
                                        style={{ color: el.soldAt ? '#ABABAB' : '' }}
                                    >
                                        {el.name}
                                        {el.soldAt && (
                                            <span className={style.board_sold}>판매완료</span>
                                        )}
                                    </div>
                                    <div className={style.board_writer}>
                                        {el.price?.toLocaleString()}
                                    </div>
                                    <div className={style.board_date}>
                                        {el.createdAt.slice(0, 10).split('-').join('.')}
                                    </div>
                                    {/* <div className={style.delete} onClick={onClickDelete(el._id)}>
                                        <Image
                                            src={imgSrc.deleteImg}
                                            alt="삭제이미지"
                                            width={100}
                                            height={100}
                                            style={{ width: '100%', height: 'auto' }}
                                            sizes="100vw"
                                        ></Image>
                                    </div> */}
                                </button>
                            ),
                        )
                    )}
                </div>
            </div>
        </div>
    );
}
