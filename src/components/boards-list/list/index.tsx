'use client';

import style from './styles.module.css';
import useBoardList from './hook';
import { IBoardList } from './type';

export default function BoardList({ data, keyword, refetch, activePage }: IBoardList) {
    const { onClickDetail } = useBoardList({ refetch });

    return (
        <>
            <div>
                <div className={`${style.flex_wrap} ${style.list_title}`}>
                    <div className={style.board_number}>번호</div>
                    <div className={style.board_title}>제목</div>
                    <div className={style.board_writer}>작성자</div>
                    <div className={style.board_date}>날짜</div>
                </div>
                <div className={style.board_wrap}>
                    {data?.fetchBoards.length === 0 ? (
                        <div className={style.noBoards}>검색 결과가 없습니다.</div>
                    ) : (
                        data?.fetchBoards.map((el, index: number) => (
                            <button
                                key={el._id}
                                onClick={() => onClickDetail(el._id)}
                                className={`${style.flex_wrap} ${style.board_list}`}
                            >
                                <div className={style.board_number}>
                                    {((activePage ?? 1) - 1) * 10 + (index + 1)}
                                    {/* ㄴ> 이전 게시글 개수 + 현재 페이지에서 인덱스 번호 */}
                                </div>
                                <div className={style.board_title}>
                                    {el.title
                                        .replaceAll(keyword ?? '', `###${keyword ?? ''}###`)
                                        .split('###')
                                        .map((el, index) => (
                                            <span
                                                key={`${el}_${index}`}
                                                style={{
                                                    backgroundColor:
                                                        el === keyword ? '#d6ebff' : 'transparent',
                                                }}
                                            >
                                                {el}
                                            </span>
                                        ))}
                                </div>
                                <div className={style.board_writer}>{el.writer}</div>
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
