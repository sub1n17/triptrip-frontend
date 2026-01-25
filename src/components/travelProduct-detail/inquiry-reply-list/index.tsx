'use client';

import style from './styles.module.css';
import InquiryReplyItem from '../inquiry-reply-list-item';
import { useQuery } from '@apollo/client';
import { FetchTravelproductQuestionAnswersDocument } from '@/commons/graphql/graphql';

interface IInquiryReplyListProps {
    questionId: string;
}
export default function InquiryReplyList({ questionId }: IInquiryReplyListProps) {
    const { data } = useQuery(FetchTravelproductQuestionAnswersDocument, {
        variables: {
            travelproductQuestionId: questionId,
        },
    });

    // 대댓글 없으면 렌더링하지 않기
    if (!data?.fetchTravelproductQuestionAnswers?.length) return null;

    return (
        <div className={style.reply_wrapper}>
            {data?.fetchTravelproductQuestionAnswers.map((el, index) => (
                <InquiryReplyItem
                    key={index}
                    el={el}
                    questionId={questionId}
                    borderStyle={{ marginTop: index === 0 ? '0' : '12px' }}
                ></InquiryReplyItem>
            ))}
        </div>
    );
}
