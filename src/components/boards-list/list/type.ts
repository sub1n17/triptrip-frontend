import { FetchBoardsQuery, FetchBoardsQueryVariables } from '@/commons/graphql/graphql';
import { ApolloQueryResult } from '@apollo/client';

export interface IBoardList {
    data?: FetchBoardsQuery;
    keyword?: string;
    refetch: (
        variables?: Partial<FetchBoardsQueryVariables>
    ) => Promise<ApolloQueryResult<FetchBoardsQuery>>;
    activePage?: number;
}
