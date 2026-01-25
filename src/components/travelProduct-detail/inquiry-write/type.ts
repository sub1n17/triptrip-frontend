import { gql } from '@apollo/client';
import { Dispatch, SetStateAction } from 'react';

interface IIsEditProps {
    isEdit: boolean;
    setIsEdit: Dispatch<SetStateAction<boolean>>;
    inquiry: string;
    questionId: string;
}

interface IIsAnswerProps {
    isAnswer: boolean;
    setAnswer: Dispatch<SetStateAction<boolean>>;
    questionId: string;
}

interface IIsAnswerEditProps {
    isAnswerEdit: boolean;
    setIsAnswerEdit: Dispatch<SetStateAction<boolean>>;
    answer: string;
    questionAnswerId: string;
    questionId: string;
}

export type IInquiryWriteProps = Partial<IIsEditProps & IIsAnswerProps & IIsAnswerEditProps>;

export const CREATE_TRAVEL_PRODUCT_QUESTION = gql`
    mutation createTravelproductQuestion(
        $travelproductId: ID!
        $createTravelproductQuestionInput: CreateTravelproductQuestionInput!
    ) {
        createTravelproductQuestion(
            travelproductId: $travelproductId
            createTravelproductQuestionInput: $createTravelproductQuestionInput
        ) {
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

export const CREATE_TRAVEL_PRODUCT_QUESTION_ANSWER = gql`
    mutation createTravelproductQuestionAnswer(
        $travelproductQuestionId: ID!
        $createTravelproductQuestionAnswerInput: CreateTravelproductQuestionAnswerInput!
    ) {
        createTravelproductQuestionAnswer(
            createTravelproductQuestionAnswerInput: $createTravelproductQuestionAnswerInput
            travelproductQuestionId: $travelproductQuestionId
        ) {
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

export const FETCH_TRAVEL_PRODUCT_QUESTION_ANSWERS = gql`
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

export const UPDATE_TRAVEL_PRODUCT_QUESTION = gql`
    mutation updateTravelproductQuestion(
        $updateTravelproductQuestionInput: UpdateTravelproductQuestionInput!
        $travelproductQuestionId: ID!
    ) {
        updateTravelproductQuestion(
            updateTravelproductQuestionInput: $updateTravelproductQuestionInput
            travelproductQuestionId: $travelproductQuestionId
        ) {
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

export const UPDATE_TRAVEL_PRODUCT_QUESTION_ANSWER = gql`
    mutation updateTravelproductQuestionAnswer(
        $travelproductQuestionAnswerId: ID!
        $updateTravelproductQuestionAnswerInput: UpdateTravelproductQuestionAnswerInput!
    ) {
        updateTravelproductQuestionAnswer(
            travelproductQuestionAnswerId: $travelproductQuestionAnswerId
            updateTravelproductQuestionAnswerInput: $updateTravelproductQuestionAnswerInput
        ) {
            _id
            contents
            user {
                _id
                name
            }
            createdAt
            updatedAt
        }
    }
`;
