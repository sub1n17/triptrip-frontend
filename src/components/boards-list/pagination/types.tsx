'use client';

import { FetchBoardsQuery } from '@/commons/graphql/graphql';
import { ApolloQueryResult, OperationVariables } from '@apollo/client';
import { Dispatch, SetStateAction } from 'react';

export interface IPaginationProps {
    refetch: (
        variables?: Partial<OperationVariables> | undefined
    ) => Promise<ApolloQueryResult<FetchBoardsQuery>>;

    lastPage: number;
    startPage: number;
    setStartPage: Dispatch<SetStateAction<number>>;
    activePage: number;
    setActivePage: (page: number) => void;
    search?: string;

    setQueryString: Dispatch<
        SetStateAction<{
            search: string;
            page: number;
            dateStart: string | null;
            dateEnd: string | null;
        }>
    >;
}
