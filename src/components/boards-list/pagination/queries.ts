'use client';

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

export const FETCH_BOARDS_COUNT = gql`
    query fetchBoardsCount($search: String, $startDate: DateTime, $endDate: DateTime) {
        fetchBoardsCount(search: $search, startDate: $startDate, endDate: $endDate)
    }
`;
