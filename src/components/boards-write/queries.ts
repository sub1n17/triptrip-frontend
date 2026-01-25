import { gql } from '@apollo/client';

// GraphQL 서버에 보낼 뮤테이션(Mutation) 쿼리 정의하기
export const CREATE_BOARD = gql`
    mutation createBoard($createBoardInput: CreateBoardInput!) {
        createBoard(createBoardInput: $createBoardInput) {
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
        }
    }
`;

// 수정화면에서 입력값 보여주기
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

// 수정하는 쿼리
export const UPDATE_BOARD = gql`
    mutation updateBoard($boardId: ID!, $password: String, $updateBoardInput: UpdateBoardInput!) {
        updateBoard(boardId: $boardId, password: $password, updateBoardInput: $updateBoardInput) {
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
        }
    }
`;

// 이미지 첨부하는 쿼리
export const UPLOAD_FILE = gql`
    mutation uploadFile($file: Upload!) {
        uploadFile(file: $file) {
            _id
            url
            size
        }
    }
`;
