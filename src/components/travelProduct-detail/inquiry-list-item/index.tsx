'use client';

import Image from 'next/image';
import style from './styles.module.css';
import InquiryReplyList from '../inquiry-reply-list';
import { gql, useMutation, useQuery } from '@apollo/client';
import InquiryWrite from '../inquiry-write';
import { useState } from 'react';
import { FetchTravelproductQuestionsQuery } from '@/commons/graphql/graphql';
import { message, Modal } from 'antd';
import { FETCH_TRAVEL_PRODUCT } from '../detail/queries';
import { useParams } from 'next/navigation';

const imgSrc = {
    profileImg: '/images/profile.svg',
    reply: '/icons/reply.svg',
    pencil: '/icons/edit.svg',
    close: '/icons/close.svg',
};

const DELETE_TRAVEL_PRODUCT_QUESTION = gql`
    mutation deleteTravelproductQuestion($travelproductQuestionId: ID!) {
        deleteTravelproductQuestion(travelproductQuestionId: $travelproductQuestionId)
    }
`;

const FETCH_USER_LOGIN = gql`
    query fetchUserLoggedIn {
        fetchUserLoggedIn {
            _id
            email
            name
            userPoint {
                amount
            }
        }
    }
`;

export const FETCH_TRAVEL_PRODUCT_QUESTIONS = gql`
    query fetchTravelproductQuestions($travelproductId: ID!) {
        fetchTravelproductQuestions(travelproductId: $travelproductId) {
            _id
            contents
            user {
                _id
                email
                name
                createdAt
                updatedAt
            }
            createdAt
            updatedAt
        }
    }
`;

interface IInquiryListItemProps {
    el: FetchTravelproductQuestionsQuery['fetchTravelproductQuestions'][number];
    borderStyle: React.CSSProperties;
}

export default function InquiryListItem({ el, borderStyle }: IInquiryListItemProps) {
    const { productId } = useParams();
    const { data: productData } = useQuery(FETCH_TRAVEL_PRODUCT, {
        variables: { travelproductId: productId },
    });
    const { data: userData } = useQuery(FETCH_USER_LOGIN);
    const seller = productData?.fetchTravelproduct.seller._id;
    const me = userData?.fetchUserLoggedIn._id;

    const [answer, setAnswer] = useState(false);
    const onClickAnswer = () => {
        if (!seller || !me) return;

        if (seller !== me) {
            message.error('판매자만 답변 가능합니다.');
            return;
        }
        setAnswer(true);
    };

    const [isEdit, setIsEdit] = useState(false);
    const onClickEdit = () => {
        setIsEdit(true);
    };

    // 문의 삭제하기
    const [delete_travel_product_question] = useMutation(DELETE_TRAVEL_PRODUCT_QUESTION);
    const onClickDelete = () => {
        Modal.confirm({
            title: '댓글을 삭제하시겠습니까?',
            okText: '삭제',
            cancelText: '취소',
            okType: 'danger',
            centered: true,
            // icon: null,
            onOk: async () => {
                try {
                    await delete_travel_product_question({
                        variables: {
                            travelproductQuestionId: el._id,
                        },

                        update(cache, { data }) {
                            cache.modify({
                                fields: {
                                    fetchTravelproductQuestions: (prev, { readField }) => {
                                        const deletedId = data?.deleteTravelproductQuestion;
                                        const filteredId = prev.filter(
                                            (el: FetchTravelproductQuestionsQuery) =>
                                                readField('_id', el) !== deletedId,
                                        );
                                        return [...filteredId];
                                    },
                                },
                            });
                        },
                    });
                    setTimeout(() => {
                        message.success('댓글이 삭제되었습니다.');
                    }, 100);
                } catch (error) {
                    message.error((error as Error).message);
                }
            },
        });
    };

    return (
        <div className={style.inquiry_wrapper} style={borderStyle}>
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
                {userData?.fetchUserLoggedIn._id === el.user._id && (
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
                                alt="삭제"
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

            {seller === me && (
                <button className={style.reply_wrapper} onClick={onClickAnswer}>
                    <div className={style.reply_img}>
                        <Image
                            src={imgSrc.reply}
                            alt="답변하기"
                            width={100}
                            height={100}
                            sizes="100vw"
                        ></Image>
                    </div>
                    <div className={style.reply}>답변하기</div>
                </button>
            )}
            {/* 댓글 수정 */}
            {isEdit && (
                <InquiryWrite
                    isEdit={isEdit}
                    setIsEdit={setIsEdit}
                    inquiry={el.contents}
                    questionId={el._id}
                ></InquiryWrite>
            )}

            {/* 대댓글 작성 */}
            {answer && (
                <InquiryWrite
                    isAnswer={true}
                    setAnswer={setAnswer}
                    questionId={el._id}
                ></InquiryWrite>
            )}

            {/*  대댓글 목록 */}
            <InquiryReplyList questionId={el._id} />
        </div>
    );
}
