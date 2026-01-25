'use client';

import _ from 'lodash';
import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { IUseBoardSearchProps } from './type';
import { RangePickerProps } from 'antd/es/date-picker';
import { usePathname, useRouter } from 'next/navigation';

export default function useBoardSearch({
    // keyword,
    setKeyword,
    setStartPage,
    setActivePage,
    setQueryString,
    setTravelQueryString,
    travelQueryString,
}: IUseBoardSearchProps) {
    // const searchParams = useSearchParams();

    // const dateStart = searchParams.get('dateStart');
    // const dateEnd = searchParams.get('dateEnd');

    // 날짜 지정
    // const [datePick, setDatePick] = useState<(Date | null)[]>([]);
    // const [datePick, setDatePick] = useState<[Dayjs | null, Dayjs | null] | null>(null);

    // useEffect(() => {
    //     if (dateStart && dateEnd) {
    //         setDatePick([dayjs(dateStart), dayjs(dateEnd)]);
    //     }
    //     // else {
    //     //     setDatePick(null);
    //     // }
    // }, [dateStart, dateEnd]);

    //  렌더될 때마다 debounce가 새로 생성되지 않게 메모이제이션
    const getDebounce = useMemo(
        () =>
            _.debounce((value) => {
                setKeyword?.(value);
                setStartPage?.(1); // 페이지네이션의 시작점도 1로
                setActivePage?.(1);

                setQueryString?.((prev) => ({
                    ...prev,
                    search: value,
                    page: 1,
                }));

                setTravelQueryString?.((prev) => ({
                    ...prev,
                    search: value,
                    productCount: 8,
                    soldOutCount: 8,
                }));
            }, 300),
        []
    );

    // 디바운스 클린업
    useEffect(() => {
        return () => {
            getDebounce.cancel();
        };
    }, [getDebounce]);

    // 검색창 인풋 value - 디바운스 0.3s 때문에 자음과 모음이 분리되는 문제 해결
    const [inputValue, setInputValue] = useState('');

    // 숙박권 - 탭메뉴 바뀌면 검색창 value 초기화
    useEffect(() => {
        setInputValue('');
    }, [travelQueryString?.tabMenu]);

    // 숙박권 - 상세 → 목록으로 갈 때 검색어 value 유지하기
    useEffect(() => {
        if (!pathname.includes('/travelProduct')) return;
        if (travelQueryString?.search) setInputValue(travelQueryString.search);
    }, []);

    // 검색하기
    const onChangeSearch = (event: ChangeEvent<HTMLInputElement>) => {
        getDebounce(event.target.value);
        setInputValue(event.target.value);
        // 검색어가 없으면 초기화
        if (event.target.value === '') {
            onClearSearch();
        }
    };

    const onClickSearch = () => {
        getDebounce(inputValue);
    };

    // 검색어 삭제 시: 전체 목록 1페이지로
    const onClearSearch = () => {
        setKeyword?.('');
        setStartPage?.(1);
        setActivePage?.(1);

        setQueryString?.((prev) => ({
            ...prev,
            search: '',
            page: 1,
        }));
    };

    // datePicker
    const onChangeDate: RangePickerProps['onChange'] = async (date) => {
        // 날짜가 dateString 전체 게시글 다시 조회
        if (!date || !date[0] || !date[1]) {
            // setDatePick(null);
            setQueryString?.((prev) => ({
                ...prev,
                dateStart: null,
                dateEnd: null,
                page: 1,
            }));

            return;
        }

        const dateStart = date[0].format('YYYY-MM-DD 00:00:00');
        const dateEnd = date[1].format('YYYY-MM-DD 23:59:59');

        // 한국 시간 보정 (+9시간)
        // const offset = 9 * 60 * 60 * 1000;

        setQueryString?.((prev) => ({
            ...prev,
            dateStart: dateStart,
            dateEnd: dateEnd,
            page: 1,
        }));
    };

    const router = useRouter();
    const pathname = usePathname();

    const onClickNew = () => {
        if (pathname === '/boards') router.push('/boards/new'); // 로그인 되어 있으면 이동
        if (pathname === '/travelProduct') router.push('/travelProduct/new'); // 로그인 되어 있으면 이동
    };

    return { onChangeSearch, onClickSearch, onChangeDate, onClickNew, inputValue };
}
