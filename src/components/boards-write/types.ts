import { FetchBoardQuery } from '@/commons/graphql/graphql';

export interface IBoardWriteProps {
    isEdit: boolean;
    data?: FetchBoardQuery;
}

export interface IUpdateInput {
    title?: string;
    contents?: string;
    boardAddress: {
        zipcode?: string;
        address?: string;
        addressDetail?: string;
    };
    youtubeUrl?: string;
    images?: string[];
}
