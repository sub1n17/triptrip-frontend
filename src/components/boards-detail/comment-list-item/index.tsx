'use client';

import Image from 'next/image';
import style from './styles.module.css';

// MUI Rating
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

import UseCommentList from '../comment-list/hook';

import CommentWrite from '../comment-write';
import { FetchBoardCommentsQuery } from '@/commons/graphql/graphql';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { gql, useMutation } from '@apollo/client';
import { Input, message, Modal, Space } from 'antd';

const imgSrc = {
    profileImg: '/images/profile.png',
    commentListStarsImg: '/images/commentList_star.png',
    editImg: '/images/edit.png',
    closeImg: '/images/close.png',
};
interface ICommentListProps {
    el: FetchBoardCommentsQuery['fetchBoardComments'][0];
}

const DELETE_COMMENT = gql`
    mutation deleteBoardComment($password: String, $boardCommentId: ID!) {
        deleteBoardComment(password: $password, boardCommentId: $boardCommentId)
    }
`;
const FETCH_BOARD_COMMENTS = gql`
    query fetchBoardComments($boardId: ID!, $page: Int) {
        fetchBoardComments(boardId: $boardId, page: $page) {
            _id
            writer
            contents
            rating
            createdAt
            user {
                _id
            }
        }
    }
`;

export default function CommentItem({ el }: ICommentListProps) {
    const { StyledRating } = UseCommentList();

    const [isCommentEdit, setIsCommentEdit] = useState(false);

    const onClickEdit = () => {
        setIsCommentEdit(true);
    };

    // 댓글 삭제 시 비밀번호 입력받기
    const [deletePW, setDeletePw] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    // 댓글 삭제하기
    const [delete_comment] = useMutation(DELETE_COMMENT);
    const params = useParams();
    const onClickDelete = () => {
        setIsModalOpen(true);
    };

    // 모달 확인 시 삭제하기
    const onOkDelete = async (commentId: string) => {
        try {
            await delete_comment({
                variables: {
                    password: deletePW,
                    boardCommentId: commentId,
                },
                refetchQueries: [
                    {
                        query: FETCH_BOARD_COMMENTS,
                        variables: { boardId: params.boardId },
                    },
                ],
            });
            message.success('댓글이 삭제되었습니다.');
            setIsModalOpen(false);
            setDeletePw('');
        } catch (err) {
            message.error((err as Error).message);
        }
    };

    // 모달 취소 시 모달 닫기
    const onCancelDelete = () => {
        setIsModalOpen(false);
        setDeletePw('');
    };

    return (
        <div className={style.comment}>
            {isCommentEdit ? (
                // 댓글 수정 중일 때
                <CommentWrite
                    key={el._id}
                    isCommentEdit={isCommentEdit}
                    el={el}
                    setIsCommentEdit={setIsCommentEdit}
                ></CommentWrite>
            ) : (
                // 댓글 수정 중이 아닐 때
                <div>
                    <div key={el._id} className={style.comment_list}>
                        <div className={style.list_top}>
                            <div className={style.top_left}>
                                <div className={style.profileImg}>
                                    <Image src={imgSrc.profileImg} alt="profileImg" fill></Image>
                                </div>
                                <div className={style.comment_writer}>{el.writer}</div>
                                <StyledRating
                                    name="customized-color"
                                    // defaultValue={2} //useState로 대체
                                    getLabelText={(value: number) =>
                                        `${value} Heart${value !== 1 ? 's' : ''}`
                                    }
                                    precision={0.5}
                                    icon={<FavoriteIcon fontSize="inherit" />}
                                    emptyIcon={<FavoriteBorderIcon fontSize="inherit" />}
                                    value={el.rating}
                                    readOnly
                                />
                            </div>
                            {
                                <div className={style.top_right}>
                                    <button onClick={onClickEdit} id={el._id}>
                                        <Image
                                            src={imgSrc.editImg}
                                            alt="editImg"
                                            width={20}
                                            height={20}
                                            style={{ width: '20px', height: '20px' }}
                                        ></Image>
                                    </button>
                                    <button onClick={onClickDelete}>
                                        <Image
                                            src={imgSrc.closeImg}
                                            alt="editImg"
                                            width={20}
                                            height={20}
                                            style={{ width: '20px', height: '20px' }}
                                        ></Image>
                                    </button>
                                </div>
                            }
                        </div>
                        <div className={style.list_content}>{el.contents}</div>
                        <div className={style.list_date}>
                            {el.createdAt?.slice(0, 10).split('-').join('.')}
                        </div>
                    </div>
                    <Modal
                        open={isModalOpen}
                        onOk={() => onOkDelete(el._id)}
                        onCancel={onCancelDelete}
                        okText="삭제"
                        okType="danger"
                        cancelText="취소"
                        centered
                        className={style.modal}
                    >
                        <div>댓글을 삭제하시겠습니까?</div>
                        <Space className={style.input_wrapper}>
                            <Input.Password
                                placeholder="비밀번호를 입력해주세요."
                                onChange={(e) => setDeletePw(e.target.value)}
                                value={deletePW}
                                className={style.input_pw}
                            />
                        </Space>
                    </Modal>
                </div>
            )}
        </div>
    );
}
