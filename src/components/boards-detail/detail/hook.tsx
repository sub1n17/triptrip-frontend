'use client';

import { useMutation, useQuery } from '@apollo/client';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { FetchBoardDocument } from '@/commons/graphql/graphql';
import { DISLIKE_BOARD, LIKE_BOARD } from './queries';
import { message } from 'antd';

export default function useBoardDetail() {
    // 링크 복사하기
    const onClickCopy = async () => {
        await navigator.clipboard.writeText(window.location.href);
        message.success('링크가 복사되었습니다.');
    };

    // 게시글 이동할 라우터 객체 가져오기
    const router = useRouter();

    // 게시글 URI 가져오기
    const params = useParams();

    // 게시글 조회 쿼리 요청하고 데이터 받아오기
    const { data } = useQuery(FetchBoardDocument, {
        variables: {
            boardId: String(params.boardId),
        },
    });
    // console.log(data);

    // 게시판 목록 페이지로 이동
    const searchParams = useSearchParams();

    const onClickList = () => {
        router.push(`/boards?${searchParams.toString()}`);
    };

    // 수정하기 페이지로 이동
    const onClickEdit = () => {
        router.push(`/boards/${params.boardId}/edit`);
    };

    // 좋아요 누르기
    const [like_board] = useMutation(LIKE_BOARD);
    const onClickLike = async () => {
        try {
            await like_board({
                variables: { boardId: String(params.boardId) },

                optimisticResponse: {
                    likeBoard: (data?.fetchBoard.likeCount ?? 0) + 1,
                },

                update(cache, { data }) {
                    const boardId = cache.identify({
                        __typename: 'Board',
                        _id: String(params.boardId),
                    }); // 정확한 캐시 객체 id 찾기 => 특정 id의 게시글을 수정해야 되기 때문에 id: 를 반드시 지정

                    cache.modify({
                        id: boardId,
                        fields: {
                            likeCount: (prev) => {
                                return data?.likeBoard ?? prev;
                            },
                        },
                    });
                },
            });
        } catch (error) {
            console.log('좋아요 에러 발생:', error);
        }
    };

    // 싫어요 누르기
    const [dislike_board] = useMutation(DISLIKE_BOARD);
    const onClickDislike = async () => {
        try {
            await dislike_board({
                variables: {
                    boardId: String(params.boardId),
                },
                optimisticResponse: {
                    dislikeBoard: (data?.fetchBoard?.dislikeCount ?? 0) + 1,
                },
                update(cache, { data }) {
                    cache.modify({
                        id: cache.identify({ __typename: 'Board', _id: String(params.boardId) }),
                        // ex) "Board:691aa5a3d4299d0029cd2987" => 어떤 엔티티 객체를 수정할지 선택
                        fields: {
                            dislikeCount: (prev) => {
                                return data?.dislikeBoard ?? prev;
                            },
                        },
                        // 그 엔티티 안에서 어떤 필드(key) 를 수정할지 정의 = dislikeCount 필드를 수정
                    });
                },
            });
        } catch (error) {
            console.log('싫어요 에러 발생:', error);
        }
    };

    return { data, onClickList, onClickEdit, onClickLike, onClickDislike, onClickCopy };
}
