import { gql } from '@apollo/client';

export const FETCH_TRAVEL_PRODUCT = gql`
    query fetchTravelproduct($travelproductId: ID!) {
        fetchTravelproduct(travelproductId: $travelproductId) {
            _id
            name
            remarks
            contents
            price
            tags
            images
            pickedCount
            travelproductAddress {
                zipcode
                address
                addressDetail
                lat
                lng
            }
            buyer {
                _id
                email
                name
            }
            seller {
                _id
                email
                name
            }
            soldAt
            createdAt
            updatedAt
        }
    }
`;

export const TOGGLE_TRAVEL_PRODUCT_PICK = gql`
    mutation toggleTravelproductPick($travelproductId: ID!) {
        toggleTravelproductPick(travelproductId: $travelproductId)
    }
`;

export const CREATE_POINT_TRANSACTION_OF_BUYING_AND_SELLING = gql`
    mutation createPointTransactionOfBuyingAndSelling($useritemId: ID!) {
        createPointTransactionOfBuyingAndSelling(useritemId: $useritemId) {
            _id
            name
            remarks
            contents
            price
            tags
            images
            pickedCount
            travelproductAddress {
                zipcode
                address
                addressDetail
                lat
                lng
                # createdAt
                # updatedAt
            }
            createdAt
            updatedAt
        }
    }
`;

export const FETCH_USER_LOGIN = gql`
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

export const DELETE_PRODUCT = gql`
    mutation deleteTravelproduct($travelproductId: ID!) {
        deleteTravelproduct(travelproductId: $travelproductId)
    }
`;
