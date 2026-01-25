import { gql } from '@apollo/client';

// 게시글 목록 조회
export const FETCH_BOARDS = gql`
    query fetchBoards($page: Int, $search: String, $endDate: DateTime, $startDate: DateTime) {
        fetchBoards(page: $page, search: $search, endDate: $endDate, startDate: $startDate) {
            _id
            writer
            title
            contents
            youtubeUrl
            likeCount
            dislikeCount
            boardAddress {
                zipcode
                address
                addressDetail
            }
            createdAt
            images
        }
    }
`;

// 게시글 삭제
export const DELETE_BOARD = gql`
    mutation deleteBoard($boardId: ID!) {
        deleteBoard(boardId: $boardId)
    }
`;

// // 본인인지 확인 -> 직접 작성한 게시글만 삭제
// export const FETCH_USER_LOGIN = gql`
//     query fetchUserLoggedIn {
//         fetchUserLoggedIn {
//             _id
//             email
//             name
//         }
//     }
// `;
