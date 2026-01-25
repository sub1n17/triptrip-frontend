import { Dispatch, SetStateAction } from 'react';
import { Dayjs } from 'dayjs';

export interface IUseBoardSearchProps {
    keyword?: string;
    setKeyword?: React.Dispatch<React.SetStateAction<string>>;
    setStartPage?: Dispatch<SetStateAction<number>>;
    setActivePage?: Dispatch<SetStateAction<number>>;

    setQueryString?: Dispatch<
        SetStateAction<{
            search: string;
            page: number;
            dateStart: string | null;
            dateEnd: string | null;
        }>
    >;
    datePick?: Dayjs[] | null;
    setTravelQueryString?: Dispatch<
        SetStateAction<{
            tabMenu: string;
            search: string | null;
            productCount: number;
            soldOutCount: number;
        }>
    >;
    travelQueryString?: {
        tabMenu: string;
        search: string | null;
        productCount: number;
        soldOutCount: number;
    };
}
