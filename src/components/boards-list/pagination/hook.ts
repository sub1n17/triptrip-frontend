'use client';

import { IPaginationProps } from './types';
import { useSearchParams } from 'next/navigation';

export default function usePagination(props: IPaginationProps) {
    const searchParams = useSearchParams();
    const search = searchParams.get('search') ?? '';
    //  const page = searchParams.get('page') ?? 1;
    const dateStart = searchParams.get('dateStart');
    const dateEnd = searchParams.get('dateEnd');

    // 페이지 클릭할 때 페이지 변수 전달하기
    const onClickPage = (page: number) => {
        props.setActivePage(page);
        props.setQueryString((prev) => ({
            ...prev,
            page: page,
        }));
    };

    // 이전 화살표 클릭했을 때
    const onClickPrev = () => {
        if (props.startPage === 1) return;
        props.setStartPage(props.startPage - 5);
        props.setActivePage(props.startPage - 5); //  activePage도 이동
        props.refetch({
            page: props.startPage - 5,
            search: search,
            startDate: dateStart || null,
            endDate: dateEnd || null,
        });
    };

    // 다음 화살표 클릭했을 때
    const onClickNext = () => {
        if (props.startPage + 5 <= props.lastPage) {
            props.setStartPage(props.startPage + 5);
            props.setActivePage(props.startPage + 5); //  activePage도 이동
            props.refetch({
                page: props.startPage + 5,
                search: search,
                startDate: dateStart || null,
                endDate: dateEnd || null,
            });
        }
    };

    return {
        onClickPage,
        onClickPrev,
        onClickNext,
    };
}
