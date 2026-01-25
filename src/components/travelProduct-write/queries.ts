import { gql } from '@apollo/client';

export const CREATE_TRAVEL_PRODUCT = gql`
    mutation createTravelproduct($createTravelproductInput: CreateTravelproductInput!) {
        createTravelproduct(createTravelproductInput: $createTravelproductInput) {
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

export const UPDATE_TRAVEL_PRODUCT = gql`
    mutation updateTravelproduct(
        $updateTravelproductInput: UpdateTravelproductInput!
        $travelproductId: ID!
    ) {
        updateTravelproduct(
            updateTravelproductInput: $updateTravelproductInput
            travelproductId: $travelproductId
        ) {
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

export const UPLOAD_FILE = gql`
    mutation uploadFile($file: Upload!) {
        uploadFile(file: $file) {
            _id
            url
            size
        }
    }
`;
