import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ChangeEvent, useEffect, useState } from 'react';
import {
    CREATE_TRAVEL_PRODUCT_QUESTION,
    CREATE_TRAVEL_PRODUCT_QUESTION_ANSWER,
    FETCH_TRAVEL_PRODUCT_QUESTION_ANSWERS,
    FETCH_TRAVEL_PRODUCT_QUESTIONS,
    IInquiryWriteProps,
    UPDATE_TRAVEL_PRODUCT_QUESTION,
    UPDATE_TRAVEL_PRODUCT_QUESTION_ANSWER,
} from './type';
import { useMutation } from '@apollo/client';
import { message } from 'antd';
import { useTokenStore } from '@/commons/stores/token';

export default function UseInquiryWrite(props: IInquiryWriteProps = {}) {
    const {
        isEdit,
        setIsEdit,
        inquiry,
        questionId,
        isAnswer,
        setAnswer,
        isAnswerEdit,
        setIsAnswerEdit,
        answer,
        questionAnswerId,
    } = props;

    const params = useParams();

    // 문의 textarea
    const [contents, setContents] = useState('');
    const onChangeContents = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setContents(event.target.value);
    };

    // 답변 textarea
    const [answerContents, setAnswerContents] = useState('');
    const onChangeAnswerContents = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setAnswerContents(event.target.value);
    };

    // 문의, 답변 수정할 때 값 불러오기
    useEffect(() => {
        // 문의 수정할 때
        if (isEdit) {
            setContents(inquiry ?? '');
        }
        // 답변 수정할 때
        if (isAnswerEdit) {
            setAnswerContents(answer ?? '');
        }
    }, [inquiry, isEdit, isAnswerEdit, answer]);

    // 취소할 시 작성 컴포넌트 비활성화
    const onClickCancel = () => {
        if (isAnswer) setAnswer?.(false);
        if (isEdit) setIsEdit?.(false);
        if (isAnswerEdit) setIsAnswerEdit?.(false);
    };

    const { accessToken } = useTokenStore();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // 문의하기
    const [create_travel_product_question] = useMutation(CREATE_TRAVEL_PRODUCT_QUESTION);
    const onClickQuestion = async () => {
        if (!accessToken) {
            message.warning('로그인 후 이용 가능합니다.');

            // 로그인 완료 후 원래 보던 페이지로 이동시키기 위해 url 반영하기
            const redirect =
                pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');
            router.push(`/user/logIn?redirect=${encodeURIComponent(redirect)}`);
            return;
        }

        if (!contents.trim()) {
            // 띄워쓰기, 탭, 줄바꿈 등의 공백을 제거(trim)하고 contents가 빈 값일 때
            // 문자열의 앞뒤 공백을 전부 없앤 상태
            message.error('문의 내용을 입력해주세요');
            return;
        }

        try {
            await create_travel_product_question({
                variables: {
                    travelproductId: params.productId,
                    createTravelproductQuestionInput: {
                        contents: contents,
                    },
                },
                // refetchQueries: [
                //     {
                //         query: FETCH_TRAVEL_PRODUCT_QUESTIONS,
                //         variables: { travelproductId: params.productId },
                //     },
                // ],
                update(cache, { data }) {
                    cache.modify({
                        // fields: {
                        //     fetchTravelproductQuestions: (prev) => {
                        //         return [...prev, data.createTravelproductQuestion];
                        //     },
                        // },
                        fields: {
                            fetchTravelproductQuestions(prev = [], { toReference }) {
                                const newQuestionRef = toReference(
                                    data.createTravelproductQuestion,
                                    true // 캐시에 등록까지 같이 해줌
                                );

                                return [...prev, newQuestionRef];
                            },
                        },
                    });
                },
            });

            setContents('');
            message.success('문의사항이 등록되었습니다.');
        } catch (error) {
            alert((error as Error).message);
        }
    };

    // 문의 수정하기
    const [update_travel_product_question] = useMutation(UPDATE_TRAVEL_PRODUCT_QUESTION);
    const onClickEdit = async () => {
        await update_travel_product_question({
            variables: {
                travelproductQuestionId: questionId,
                updateTravelproductQuestionInput: {
                    contents: contents,
                },
            },
            refetchQueries: [
                {
                    query: FETCH_TRAVEL_PRODUCT_QUESTIONS,
                    variables: { travelproductId: params.productId },
                },
            ],
        });

        setIsEdit?.(false);
        message.success('문의사항이 수정되었습니다.');
    };

    // 답변하기
    const [create_travel_product_question_answer] = useMutation(
        CREATE_TRAVEL_PRODUCT_QUESTION_ANSWER
    );
    const onClickAnswer = async () => {
        try {
            await create_travel_product_question_answer({
                variables: {
                    travelproductQuestionId: questionId,
                    createTravelproductQuestionAnswerInput: {
                        contents: answerContents,
                    },
                },
                refetchQueries: [
                    {
                        query: FETCH_TRAVEL_PRODUCT_QUESTION_ANSWERS,
                        variables: { travelproductQuestionId: questionId },
                    },
                ],
            });

            // textarea 초기화
            setAnswerContents('');

            // 답변하고 textarea 사라지게 하기
            setAnswer?.(false);

            message.success('답변이 등록되었습니다.');
        } catch (error) {
            message.error((error as Error).message);
        }
    };

    // 답변 수정하기
    const [update_question_answer] = useMutation(UPDATE_TRAVEL_PRODUCT_QUESTION_ANSWER);
    const onClickAnswerEdit = async () => {
        try {
            await update_question_answer({
                variables: {
                    travelproductQuestionAnswerId: questionAnswerId,
                    updateTravelproductQuestionAnswerInput: {
                        contents: answerContents,
                    },
                },
            });

            // textarea 없애기
            setIsAnswerEdit?.(false);

            message.success('답변이 수정되었습니다.');
        } catch (error) {
            alert((error as Error).message);
        }
    };

    // textarea 공백일 때 버튼 비활성화
    const isButtonDisabled =
        // 답변하기/답변 수정하기
        ((isAnswer || isAnswerEdit) && answerContents.trim() === '') ||
        // 문의하기/수정하기
        (!isAnswer && !isAnswerEdit && contents.trim() === '');

    return {
        onChangeContents,
        onChangeAnswerContents,
        onClickCancel,
        onClickQuestion,
        onClickEdit,
        onClickAnswer,
        onClickAnswerEdit,
        answerContents,
        contents,
        isButtonDisabled,
    };
}
