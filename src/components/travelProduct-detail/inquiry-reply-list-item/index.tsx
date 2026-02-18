'use client';

import Image from 'next/image';
import style from './styles.module.css';
import { gql, useMutation, useQuery } from '@apollo/client';
import InquiryWrite from '../inquiry-write';
import { useState } from 'react';
import {
    // DeleteTravelproductQuestionAnswerDocument,
    FetchTravelproductQuestionAnswersQuery,
} from '@/commons/graphql/graphql';
import { FETCH_USER_LOGIN } from '../detail/queries';
import { message, Modal } from 'antd';

const imgSrc = {
    profileImg: '/images/profile.svg',
    return: '/icons/return.svg',
    pencil: '/icons/pencil.svg',
    close: '/icons/close.svg',
};

const DELETE_TRAVEL_PRODUCT_QUESTION_ANSWER = gql`
    mutation deleteTravelproductQuestionAnswer($travelproductQuestionAnswerId: ID!) {
        deleteTravelproductQuestionAnswer(
            travelproductQuestionAnswerId: $travelproductQuestionAnswerId
        )
    }
`;

const FETCH_TRAVEL_PRODUCT_QUESTION_ANSWERS = gql`
    query fetchTravelproductQuestionAnswers($travelproductQuestionId: ID!) {
        fetchTravelproductQuestionAnswers(travelproductQuestionId: $travelproductQuestionId) {
            _id
            contents
            user {
                _id
                name
                createdAt
                updatedAt
            }
            createdAt
            updatedAt
        }
    }
`;
interface IInquiryReplyItemProps {
    el: FetchTravelproductQuestionAnswersQuery['fetchTravelproductQuestionAnswers'][number];

    borderStyle: React.CSSProperties;
    questionId: string;
}

export default function InquiryReplyItem({ el, borderStyle, questionId }: IInquiryReplyItemProps) {
    const [isAnswerEdit, setIsAnswerEdit] = useState(false);

    // 대댓글 수정하기
    const onClickEdit = async () => {
        setIsAnswerEdit(true);
    };
    // 대댓글 삭제하기
    const [delete_question_answer] = useMutation(DELETE_TRAVEL_PRODUCT_QUESTION_ANSWER);
    const onClickDelete = () => {
        Modal.confirm({
            title: '답글을 삭제하시겠습니까?',
            okText: '삭제',
            cancelText: '취소',
            okType: 'danger',
            centered: true,
            onOk: async () => {
                await delete_question_answer({
                    variables: {
                        travelproductQuestionAnswerId: el._id,
                    },
                    refetchQueries: [
                        {
                            query: FETCH_TRAVEL_PRODUCT_QUESTION_ANSWERS,
                            variables: {
                                travelproductQuestionId: questionId,
                            },
                        },
                    ],
                });
                setTimeout(() => {
                    message.success('답글이 삭제되었습니다.');
                }, 100);
            },
        });
    };

    const { data: userData } = useQuery(FETCH_USER_LOGIN);

    return (
        <div className={style.inquiry_wrapper} style={borderStyle}>
            <div className={style.reply_img}>
                <Image
                    src={imgSrc.return}
                    alt="답변"
                    width={100}
                    height={100}
                    sizes="100vw"
                ></Image>
            </div>
            <div className={style.reply_wrapper}>
                <div className={style.profileBtn_wrapper}>
                    <div className={style.profile_wrapper}>
                        <div className={style.profile_img}>
                            <Image
                                src={imgSrc.profileImg}
                                alt="프로필"
                                width={100}
                                height={100}
                                sizes="100vw"
                            ></Image>
                        </div>
                        <div className={style.profile_txt}>{el.user.name} </div>
                    </div>

                    {el.user._id === userData?.fetchUserLoggedIn._id && (
                        <div className={style.btn_wrapper}>
                            <button onClick={onClickEdit}>
                                <Image
                                    src={imgSrc.pencil}
                                    alt="수정"
                                    width={100}
                                    height={100}
                                    sizes="100vw"
                                ></Image>
                            </button>
                            <button onClick={onClickDelete}>
                                <Image
                                    src={imgSrc.close}
                                    alt="닫기"
                                    width={100}
                                    height={100}
                                    sizes="100vw"
                                ></Image>
                            </button>
                        </div>
                    )}
                </div>
                <div className={style.inquiry}>{el.contents} </div>
                <div className={style.date}>{el.createdAt.split('T')[0].split('-').join('.')} </div>
                {isAnswerEdit && (
                    <InquiryWrite
                        isAnswerEdit={isAnswerEdit}
                        setIsAnswerEdit={setIsAnswerEdit}
                        answer={el.contents}
                        questionAnswerId={el._id}
                    ></InquiryWrite>
                )}
            </div>
        </div>
    );
}
