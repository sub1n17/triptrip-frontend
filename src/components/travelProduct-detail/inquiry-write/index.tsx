'use client';

import style from './styles.module.css';
import Image from 'next/image';
import { IInquiryWriteProps } from './type';
import UseInquiryWrite from './hooks';

const imgSrc = {
    chat: '/icons/chat.svg',
};

export default function InquiryWrite(props: IInquiryWriteProps) {
    const {
        isAnswer,
        isEdit,
        isAnswerEdit,
        inquiry,
        questionId,
        setIsEdit,
        answer,
        setAnswer,
        questionAnswerId,
        setIsAnswerEdit,
    } = props;

    const {
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
    } = UseInquiryWrite({
        isAnswer,
        isEdit,
        isAnswerEdit,
        inquiry,
        questionId,
        setIsEdit,
        answer,
        setAnswer,
        questionAnswerId,
        setIsAnswerEdit,
    });
    return (
        <div className={style.chat_wrapper}>
            {!isAnswer && !isEdit && !isAnswerEdit && (
                <div className={style.title_wrapper}>
                    <div className={style.chat_img}>
                        <Image
                            src={imgSrc.chat}
                            alt="문의"
                            width={100}
                            height={100}
                            sizes="100vw"
                        ></Image>
                    </div>
                    <div className={style.title}>문의하기</div>
                </div>
            )}
            <textarea
                className={isAnswer ? style.answer_textarea : style.textarea}
                placeholder={isAnswer ? '답변할 내용을 입력해주세요.' : '문의사항을 입력해 주세요.'}
                onChange={isAnswer || isAnswerEdit ? onChangeAnswerContents : onChangeContents}
                value={isAnswer || isAnswerEdit ? answerContents : contents}
                name="answer_textarea"
            ></textarea>
            <div className={style.btn_wrapper}>
                {(isAnswer || isEdit || isAnswerEdit) && (
                    <button className={style.cancel_btn} onClick={onClickCancel}>
                        취소
                    </button>
                )}
                <button
                    className={isButtonDisabled ? style.inquiry_disabled : style.inquiry_btn}
                    onClick={
                        isAnswer
                            ? onClickAnswer // 답변하기
                            : isEdit
                              ? onClickEdit // 수정하기
                              : isAnswerEdit
                                ? onClickAnswerEdit // 답변 수정하기
                                : onClickQuestion // 문의하기
                    }
                    disabled={isButtonDisabled}
                >
                    {isAnswer ? '답변하기' : isEdit || isAnswerEdit ? '수정하기' : '문의하기'}
                </button>
            </div>
        </div>
    );
}
