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

export default async function TravelProductDetailLayout({
    children,
    params,
}: ITravelProductDetailLayoutProps) {
    console.log('여기는 서버입니다.');

    const graphQLClient = new GraphQLClient('https://main-practice.codebootcamp.co.kr/graphql');
    const data = await graphQLClient.request(FETCH_TRAVEL_PRODUCT, {
        travelproductId: params.productId,
    });

    return (
        <>
            <meta property="og:title" content={data?.fetchTravelproduct?.name} />
            <meta property="og:description" content={data?.fetchTravelproduct?.remarks} />
            <meta
                property="og:image"
                content={
                    data?.fetchTravelproduct?.images?.[0]
                        ? `https://storage.googleapis.com/${data.fetchTravelproduct.images[0]}`
                        : '/images/productThumbnail.jpg'
                }
            />
            <>{children}</>
        </>
    );
}
