'use client';

import TravelProductWrite from '@/components/travelProduct-write';
import { gql, useQuery } from '@apollo/client';
import { useParams } from 'next/navigation';

const FETCH_TRAVEL_PRODUCT = gql`
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

export default function TravelProductDetailEditPage() {
    const params = useParams();
    const travelproductId = params.productId;

    const { data } = useQuery(FETCH_TRAVEL_PRODUCT, {
        variables: {
            travelproductId: travelproductId,
        },
    });

    return <TravelProductWrite isEdit={true} data={data}></TravelProductWrite>;
}
