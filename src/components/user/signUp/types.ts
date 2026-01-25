import { gql } from '@apollo/client';

export const CREATE_USER = gql`
    mutation createUser($email: String!, $password: String!, $name: String!) {
        createUser(createUserInput: { email: $email, password: $password, name: $name }) {
            _id
            email
            name
            picture
            userPoint {
                amount
            }
            createdAt
        }
    }
`;
