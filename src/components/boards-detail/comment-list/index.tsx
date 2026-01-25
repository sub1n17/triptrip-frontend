'use client';

import InfiniteScroll from 'react-infinite-scroll-component';
import CommentItem from '../comment-list-item';
import UseCommentList from './hook';

export default function CommentList() {
    const { data, onNext, IsHasMore } = UseCommentList();

    if (data?.fetchBoardComments?.length === 0) {
        return (
            <div style={{ textAlign: 'center', color: '#777777', paddingBottom: '40px' }}>
                등록된 댓글이 없습니다.
            </div>
        );
    }

    return (
        <>
            <InfiniteScroll
                next={onNext}
                hasMore={IsHasMore}
                loader={<div>로드 중</div>}
                dataLength={data?.fetchBoardComments?.length ?? 0}
            >
                {data?.fetchBoardComments.map((el) => (
                    <CommentItem key={el._id} el={el}></CommentItem>
                ))}
            </InfiniteScroll>
        </>
    );
}
