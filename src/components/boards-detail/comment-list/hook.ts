'use client';
import { useQuery } from '@apollo/client';
import { useParams } from 'next/navigation';
import { FetchBoardCommentsDocument, FetchBoardCommentsQuery } from '@/commons/graphql/graphql';

// MUI Rating
import Rating from '@mui/material/Rating';
import { styled } from '@mui/material/styles';
import { useState } from 'react';
// import { useState } from 'react';

export default function UseCommentList() {
    //  URI의 boardId를 가져오기
    const params = useParams();

    //  댓글 목록 조회하는 쿼리 호출하기
    const { data, fetchMore } = useQuery(FetchBoardCommentsDocument, {
        variables: {
            boardId: String(params.boardId),
        },
    });
    // console.log(data);

    // 별점 주기 - MUI Rating
    const StyledRating = styled(Rating)({
        '& .MuiRating-iconFilled': {
            color: '#ff6d75', // 채워진 하트 색
            fontSize: '1rem', // 하트 사이즈 조절
        },
        '& .MuiRating-iconHover': {
            color: '#ff3d47', // 호버 시 색
            fontSize: '1rem', // 하트 사이즈 조절
        },
        '&.MuiRating-root': {
            // 기본 하트 틀
            fontSize: '1rem', // 하트 사이즈 조절
        },
    });

    // ********************************* 댓글 스크롤 *********************************
    // 댓글 무한 스크롤

    const [IsHasMore, setIsHasMore] = useState(true);
    const onNext = () => {
        fetchMore({
            variables: {
                boardId: String(params.boardId),
                page: Math.ceil((data?.fetchBoardComments.length ?? 10) / 10) + 1,
            },
            updateQuery: (
                prev: FetchBoardCommentsQuery,
                { fetchMoreResult }: { fetchMoreResult?: FetchBoardCommentsQuery },
            ) => {
                if (!fetchMoreResult?.fetchBoardComments.length) {
                    setIsHasMore(false);
                    return prev; // 지금까지 보여준 모든 댓글들이 누적되어 있는 prev를 보여줘
                }
                return {
                    fetchBoardComments: [
                        ...(prev.fetchBoardComments ?? []), // 데이터를 늦게 받아올 수도 있는데 그때 undefined일 수도 있으니까 그럴 땐 안전하게 배열로 만들어줌
                        ...fetchMoreResult.fetchBoardComments,
                    ],
                };
            },
        });
    };

    return {
        data,
        StyledRating,
        onNext,
        IsHasMore,
    };
}
