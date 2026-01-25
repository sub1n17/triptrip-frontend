'use client';

import BoardList from '@/components/boards-list/list';
import Pagination from '@/components/boards-list/pagination';
import { FETCH_BOARDS_COUNT } from '@/components/boards-list/pagination/queries';
import { useQuery } from '@apollo/client';
import style from './styles.module.css';
import { FetchBoardsDocument } from '@/commons/graphql/graphql';
import { useEffect, useRef, useState } from 'react';
import Search from '@/components/boards-list/search';
import BoardBest from '@/components/boards-best';
import { useSearchParams } from 'next/navigation';
import dayjs from 'dayjs';

export default function BoardsPage() {
    // 샬로우 라이팅
    const searchParams = useSearchParams();
    const search = searchParams.get('search') ?? '';
    const page = Number(searchParams.get('page') ?? 1);
    const dateStart = searchParams.get('dateStart');
    const dateEnd = searchParams.get('dateEnd');

    const [keyword, setKeyword] = useState(search);

    // 쿼리스트링 객체 만들기
    const [queryString, setQueryString] = useState({
        search: search ?? '',
        page: page ?? 1,
        dateStart: dateStart,
        dateEnd: dateEnd,
    });
    const datePick =
        queryString.dateStart && queryString.dateEnd
            ? [dayjs(queryString.dateStart), dayjs(queryString.dateEnd)]
            : null;

    const { data, refetch } = useQuery(FetchBoardsDocument, {
        variables: {
            page: queryString.page,
            search: queryString.search || '',
            startDate: queryString.dateStart,
            endDate: queryString.dateEnd,
        },
        fetchPolicy: 'network-only',
        notifyOnNetworkStatusChange: true,
    });

    // 시작 페이지 start 만들기
    const [startPage, setStartPage] = useState(Math.floor((page - 1) / 5) * 5 + 1);
    // active된 페이지 state 만들기
    const [activePage, setActivePage] = useState(page);

    // 마지막 페이지 계산하기
    const { data: dataFetchBoardsCount } = useQuery(FETCH_BOARDS_COUNT, {
        variables: {
            search: queryString.search || '',
            startDate: queryString.dateStart,
            endDate: queryString.dateEnd,
        },
    });
    const lastPage = Math.ceil(dataFetchBoardsCount?.fetchBoardsCount / 10);

    // 페이지 바뀔 때마다 페이지 새로 계산
    useEffect(() => {
        setActivePage(page);
        setStartPage(Math.floor((page - 1) / 5) * 5 + 1);
    }, [page]);

    // 검색어, 페이지, 검색기간 바뀔 때마다 쿼리스트링 반영하기
    useEffect(() => {
        const params = new URLSearchParams();

        if (queryString.search) params.set('search', queryString.search);
        if (queryString.page) params.set('page', String(queryString.page));
        if (queryString.dateStart) params.set('dateStart', queryString.dateStart);
        if (queryString.dateEnd) params.set('dateEnd', queryString.dateEnd);

        window.history.replaceState(null, '', `?${params.toString()}`);
    }, [queryString]);

    // 페이지 클릭 시 data가 undefined 됐다가 다시 fetch돼서 깜빡임 -> 이전 데이터 저장해서 방지하기
    const prevDataRef = useRef(data);
    useEffect(() => {
        if (data) {
            prevDataRef.current = data;
        }
    }, [data]);
    const safeData = data ?? prevDataRef.current;

    return (
        <main className={style.container}>
            <BoardBest></BoardBest>
            <div className={style.boardTitle}>트립토크 게시판</div>
            <Search
                keyword={keyword}
                setKeyword={setKeyword}
                setStartPage={setStartPage}
                setActivePage={setActivePage}
                setQueryString={setQueryString}
                datePick={datePick}
            ></Search>
            <div className={style.board_wrapper}>
                <BoardList
                    data={safeData}
                    // data={data}
                    keyword={keyword}
                    refetch={refetch}
                    activePage={activePage}
                ></BoardList>
                {dataFetchBoardsCount?.fetchBoardsCount !== 0 && (
                    <Pagination
                        refetch={refetch}
                        lastPage={lastPage}
                        startPage={startPage}
                        setStartPage={setStartPage}
                        activePage={activePage}
                        setActivePage={setActivePage}
                        setQueryString={setQueryString}
                    ></Pagination>
                )}
            </div>
        </main>
    );
}
