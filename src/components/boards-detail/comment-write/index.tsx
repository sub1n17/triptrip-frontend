'use client';

import Image from 'next/image';
import style from './styles.module.css';
import UseCommentWrite from './hook';

// MUI - 별점
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

// Antd - 모달창
import React from 'react';
// import { Modal } from 'antd';
import { FetchBoardCommentsQuery } from '@/commons/graphql/graphql';

const imgSrc = {
    chatImg: '/icons/chat.svg',
};
interface ICommentWriteProps {
    isCommentEdit?: boolean;
    el?: FetchBoardCommentsQuery['fetchBoardComments'][0];
    setIsCommentEdit?: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function CommentWrite({ isCommentEdit, el, setIsCommentEdit }: ICommentWriteProps) {
    const {
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
        onClickCommentEdit,
        editActive,
    } = UseCommentWrite({
        isCommentEdit,
        el,
        setIsCommentEdit,
    });

    return (
        <div className={`${style.comment_wrap} ${isCommentEdit ? style.isCommentEdit : ''}`}>
            {!isCommentEdit && (
                <div className={style.comment_title}>
                    <div>
                        <Image
                            src={imgSrc.chatImg}
                            alt="chatImg"
                            width={0}
                            height={0}
                            style={{ width: '100%', height: 'auto' }}
                        ></Image>
                    </div>
                    <div className={style.title_txt}>댓글</div>
                </div>
            )}
            <div className={`${style.star_Img} ${isCommentEdit ? style.isCommentEdit : ''}`}>
                <StyledRating
                    name="customized-color"
                    // defaultValue={2} // useState로 대체
                    getLabelText={(value: number) => `${value} Heart${value !== 1 ? 's' : ''}`}
                    precision={0.5}
                    icon={<FavoriteIcon fontSize="inherit" />}
                    emptyIcon={<FavoriteBorderIcon fontSize="inherit" />}
                    onChange={(event, value) => {
                        console.log(value);
                        {
                            setRating?.(Number(value));
                        }
                    }}
                    value={rating}
                />
            </div>
            <div className={style.comment_form}>
                <div className={style.form_top}>
                    <div className={style.form_writer}>
                        <div className={style.txt_wrap}>
                            <div className={style.form_txt}>작성자</div>
                            <span>*</span>
                        </div>
                        <input
                            type="text"
                            placeholder="작성자 명을 입력해주세요."
                            onChange={onChangeWriter}
                            value={String(writer)}
                            readOnly={isCommentEdit}
                            name="writer"
                        ></input>
                    </div>
                    <div className={style.form_password}>
                        <div className={style.txt_wrap}>
                            <div className={style.form_txt}>비밀번호</div>
                            <span>*</span>
                        </div>
                        <input
                            type="password"
                            placeholder="비밀번호를 입력해주세요."
                            onChange={onChangePassword}
                            value={password}
                            // readOnly={isCommentEdit}
                            name="password"
                        ></input>
                    </div>
                </div>
                <div className={style.form_bot}>
                    <div className={style.txt_wrap}>
                        <div className={style.form_txt}>댓글</div>
                        <span>*</span>
                    </div>
                    <textarea
                        placeholder="댓글을 입력해주세요."
                        onChange={onChangeComment}
                        value={comment}
                        name="comment"
                    ></textarea>
                    {/* <div className={style.comment_length}>0/100</div> */}
                </div>
            </div>
            <div className={style.btn_wrap}>
                {isCommentEdit ? (
                    <div>
                        <button
                            className={style.comment_edit_cancel}
                            onClick={() => setIsCommentEdit?.(false)}
                        >
                            취소
                        </button>
                        <button
                            disabled={!editActive}
                            onClick={() => onClickCommentEdit(String(el?._id))}
                            className={`${style.comment_edit} ${
                                editActive ? style.editActive : ''
                            }`}
                        >
                            수정하기
                        </button>
                    </div>
                ) : (
                    <button
                        className={`${style.comment_submit} ${isActive ? style.active : ''}`}
                        onClick={onClickSubmit}
                        disabled={!isActive}
                    >
                        댓글 등록
                    </button>
                )}
            </div>
        </div>
    );
}
