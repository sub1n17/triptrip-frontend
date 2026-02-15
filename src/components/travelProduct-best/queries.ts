import { gql } from '@apollo/client';

export const FETCH_TRAVEL_PRODUCTS_OF_THE_BEST = gql`
    query FetchTravelproductsOfTheBest {
        fetchTravelproductsOfTheBest {
            pickedCount
            name
            remarks
            contents
            price
            _id
            soldAt
            images
        }
    }
`;
