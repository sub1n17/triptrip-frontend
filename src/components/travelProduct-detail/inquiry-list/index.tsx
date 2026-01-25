'use client';

import { useQuery } from '@apollo/client';
import InquiryListItem from '../inquiry-list-item';
import { useParams } from 'next/navigation';
import { FetchTravelproductQuestionsDocument } from '@/commons/graphql/graphql';
import style from './styles.module.css';

export default function InquiryList() {
    const params = useParams();

    // 문의 조회
    const { data } = useQuery(FetchTravelproductQuestionsDocument, {
        variables: {
            travelproductId: String(params.productId),
        },
    });

    // 문의 없을 때
    if (data?.fetchTravelproductQuestions.length === 0) {
        return <div className={style.noInquiry}>등록된 문의사항이 없습니다.</div>;
    }
    return (
        <div>
            {data?.fetchTravelproductQuestions.map((el, index) => (
                <InquiryListItem
                    key={index}
                    el={el}
                    borderStyle={{ borderTop: index === 0 ? 'none' : '1px solid #E4E4E4' }}
                ></InquiryListItem>
            ))}
        </div>
    );
}
