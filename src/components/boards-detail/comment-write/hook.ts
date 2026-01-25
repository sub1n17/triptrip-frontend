'use client';

import { ChangeEvent, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { useParams } from 'next/navigation';
import { CREATE_BOARD_COMMENT, FETCH_BOARD_COMMENTS, UPDATE_BOARD_COMMENT } from './queries';
import { FetchBoardCommentsDocument, FetchBoardCommentsQuery } from '@/commons/graphql/graphql';

// MUI Rating
import Rating from '@mui/material/Rating';
import { styled } from '@mui/material/styles';
import { message } from 'antd';

interface IUseCommentWriteProps {
    isCommentEdit?: boolean;
    el?: FetchBoardCommentsQuery['fetchBoardComments'][0];
    setIsCommentEdit?: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function UseCommentWrite({
    isCommentEdit,
    el,
    setIsCommentEdit,
}: IUseCommentWriteProps) {
    // 별점 주기 - MUI Rating
    const StyledRating = styled(Rating)({
        '& .MuiRating-iconFilled': {
            color: '#ff6d75', // 채워진 하트 색
            fontSize: '1.5rem', // 하트 사이즈 조절
        },
        '& .MuiRating-iconHover': {
            color: '#ff3d47', // 호버 시 색
            fontSize: '1.5rem', // 하트 사이즈 조절
        },
    });

    // 별점 변수 만들기
    const [rating, setRating] = useState(isCommentEdit ? (el?.rating ?? 1) : 1);

    // 작성자명, 비밀번호, 댓글 변수 만들기
    const [writer, setWriter] = useState(isCommentEdit ? el?.writer : '');
    const [password, setPassword] = useState('');
    const [comment, setComment] = useState(isCommentEdit ? el?.contents : '');

    // 댓글등록 활성화/비활성화 시키기
    const [isActive, setIsActive] = useState(false);

    // 수정하기 버튼 활성화/비활성화
    const [editActive, setEditActive] = useState(true);

    //작성자 값 감지하기
    const onChangeWriter = (event: ChangeEvent<HTMLInputElement>) => {
        setWriter(event.target.value);

        if (!isCommentEdit) {
            // 댓글 작성 중일 때
            if (event.target.value.trim() && password.trim() && comment?.trim()) {
                // 작성자, 비밀번호, 댓글 모두 입력값이 있을 때 버튼 활성화
                setIsActive(true);
            } else {
                setIsActive(false);
            }
        } else {
            // 댓글 수정 중일 때
            if (event.target.value.trim() && comment?.trim()) {
                setEditActive(true); // 두 개 다 값이 있을 때 활성화
            } else {
                setEditActive(false); // 하나라도 비면 비활성화
            }
        }
    };

    // 비밀번호 값 감지하기
    const onChangePassword = (event: ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);

        if (writer && event.target.value.trim() && comment?.trim()) {
            setIsActive(true);
        } else {
            setIsActive(false);
        }
    };

    // 댓글 값 감지하기
    const onChangeComment = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setComment(event.target.value);

        if (!isCommentEdit) {
            if (writer?.trim() && password.trim() && event.target.value.trim()) {
                setIsActive(true);
            } else {
                setIsActive(false);
            }
        } else {
            // 댓글 수정 중일 때
            if (writer?.trim() && event.target.value.trim()) {
                setEditActive(true);
            } else {
                setEditActive(false);
            }
        }
    };

    // URI의 boardId를 가져오기
    const params = useParams();

    // 댓글등록 버튼 클릭 시 작성 쿼리 호출하기
    const [createBoardComment] = useMutation(CREATE_BOARD_COMMENT);

    // 댓글 등록하기
    const onClickSubmit = async () => {
        if (!writer?.trim() || !password.trim() || !comment?.trim()) {
            message.error('필수 입력창을 입력해주세요');
            return;
        }

        const result = await createBoardComment({
            variables: {
                createBoardCommentInput: {
                    writer: writer,
                    password: password,
                    contents: comment,
                    rating: rating,
                },
                boardId: params.boardId,
            },
            refetchQueries: [
                { query: FETCH_BOARD_COMMENTS, variables: { boardId: params.boardId } },
            ],
        });
        console.log(result);

        message.success('댓글이 등록되었습니다.');

        // 버튼 클릭 시 인풋 초기화, 버튼 비활성화
        setWriter('');
        setPassword('');
        setComment('');
        setRating(1);
        setIsActive(false);
    };

    // 댓글 목록 조회하는 쿼리 호출하기
    const { data } = useQuery(FetchBoardCommentsDocument, {
        variables: {
            boardId: String(params.boardId),
            page: 1,
        },
    });
    // console.log(data);

    // ********************************* 댓글 수정하기 *********************************
    const [updateBoardComment] = useMutation(UPDATE_BOARD_COMMENT);
    const onClickCommentEdit = async (boardCommentId: string) => {
        try {
            // 수정하는 쿼리 요청하기
            const resultUpdateComment = await updateBoardComment({
                variables: {
                    updateBoardCommentInput: {
                        contents: comment,
                        rating: rating,
                    },
                    password: password,
                    boardCommentId: boardCommentId,
                },
                refetchQueries: [
                    {
                        query: FetchBoardCommentsDocument,
                        variables: {
                            boardId: params.boardId,
                            page: 1,
                        },
                    },
                ],
            });
            console.log(resultUpdateComment);

            message.success('댓글이 수정되었습니다.');
            setIsCommentEdit?.(false);
        } catch (error) {
            message.error((error as Error).message);
        }
    };

    return {
        writer,
        password,
        comment,
        isActive,
        onChangeWriter,
        onChangePassword,
        onChangeComment,
        onClickSubmit,
        StyledRating,
        rating,
        setRating,
        data,
        onClickCommentEdit,
        editActive,
    };
}
