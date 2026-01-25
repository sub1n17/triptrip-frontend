import { gql } from '@apollo/client';

// 게시글 조회하는 쿼리 선언하기 (이걸 요청할 거다)
export const FETCH_BOARD = gql`
    query fetchBoard($boardId: ID!) {
        fetchBoard(boardId: $boardId) {
            _id
            writer
            title
            contents
            likeCount
            dislikeCount
            createdAt
            youtubeUrl
            boardAddress {
                zipcode
                address
                addressDetail
            }
            images
            createdAt
            user {
                _id
            }
        }
    }
`;

export const LIKE_BOARD = gql`
    mutation likeBoard($boardId: ID!) {
        likeBoard(boardId: $boardId)
    }
`;

export const DISLIKE_BOARD = gql`
    mutation dislikeBoard($boardId: ID!) {
        dislikeBoard(boardId: $boardId)
    }
`;
