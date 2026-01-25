import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
    mutation loginUser($email: String!, $password: String!) {
        loginUser(password: $password, email: $email) {
            accessToken
        }
    }
`;
