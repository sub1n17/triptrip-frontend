import { graphql } from 'msw';
// create_travel_product;
export const apis = [
    graphql.mutation('createTravelproduct', (req, res, ctx) => {
        return res(
            ctx.data({
                createTravelproduct: {
                    _id: 'qqq',
                    name: '상품명',
                    remarks: '한줄요약',
                    contents: '내용',
                    price: 100,
                    tags: ['태그'],
                    images: ['a.png'],
                    travelproductAddress: {
                        zipcode: '12345',
                        addressDetail: '상세주소',
                        lat: '위도',
                        lng: '경도',
                    },
                },
            })
        );
    }),
    graphql.mutation('uploadFile', (req, res, ctx) => {
        return res(
            ctx.data({
                uploadFile: {
                    url: 'mock-image.png',
                },
            })
        );
    }),
];
