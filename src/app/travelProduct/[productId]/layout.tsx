import { gql } from '@apollo/client';
import { GraphQLClient } from 'graphql-request';
import { ReactNode } from 'react';

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
interface ITravelProductDetailLayoutProps {
    children: ReactNode;
    params: { productId: string };
}

export async function generateMetadata({ params }: { params: { productId: string } }) {
    const graphQLClient = new GraphQLClient('https://main-practice.codebootcamp.co.kr/graphql');
    const data = await graphQLClient.request(FETCH_TRAVEL_PRODUCT, {
        travelproductId: params.productId,
    });
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://triptrip-frontend.vercel.app';

    return {
        openGraph: {
            title: data?.fetchTravelproduct?.name,
            description: data?.fetchTravelproduct?.remarks,
            images: [
                data?.fetchTravelproduct?.images?.[0]
                    ? `https://storage.googleapis.com/${data.fetchTravelproduct.images[0]}`
                    : `${baseUrl}/images/productThumbnail.jpg`,
            ],
        },
    };
}

export default function TravelProductDetailLayout({ children }: ITravelProductDetailLayoutProps) {
    return <>{children}</>;
}
