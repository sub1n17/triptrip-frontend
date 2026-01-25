import { gql } from '@apollo/client';

export const CREATE_POINT_TRANSACTION_OF_LOADING = gql`
    mutation createPointTransactionOfLoading($paymentId: ID!) {
        createPointTransactionOfLoading(paymentId: $paymentId) {
            _id
            amount
            status
            statusDetail
            createdAt
            updatedAt
        }
    }
`;

export const FETCH_USER_LOGGED_IN = gql`
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

// 충전 시 리패치
export const FETCH_POINT_TRANSACTIONS = gql`
    query fetchPointTransactions($search: String, $page: Int) {
        fetchPointTransactions(search: $search, page: $page) {
            _id
            createdAt
            status
            amount
            balance
        }
    }
`;

// 충전 시 리패치
export const FETCH_POINT_LOADING = gql`
    query fetchPointTransactionsOfLoading($search: String, $page: Int) {
        fetchPointTransactionsOfLoading(search: $search, page: $page) {
            createdAt
            impUid
            amount
            balance
        }
    }
`;

export const LOGOUT = gql`
    mutation logoutUser {
        logoutUser
    }
`;
