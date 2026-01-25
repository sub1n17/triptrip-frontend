import { gql } from '@apollo/client';

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
