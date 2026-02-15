import { gql } from '@apollo/client';

export const fetchTravleproducts = gql`
    query FetchTravelproducts($page: Int, $search: String, $isSoldout: Boolean) {
        fetchTravelproducts(page: $page, search: $search, isSoldout: $isSoldout) {
            _id
            name
            remarks
            price
            pickedCount
            images
            seller {
                name
            }
            tags
        }
    }
`;
