'use client';

import Image from 'next/image';
import style from './styles.module.css';
import useBoardSearch from './hook';
import { IUseBoardSearchProps } from './type';
import { DatePicker } from 'antd';
import { usePathname } from 'next/navigation';
import { Dayjs } from 'dayjs';

const imgSrc = {
    search: '/icons/search.svg',
    newBtn: '/icons/new.svg',
};

export default function Search({
    keyword,
    setKeyword,
    setStartPage,
    setActivePage,
    setQueryString,
    datePick,
    setTravelQueryString,
    travelQueryString,
}: IUseBoardSearchProps) {
    const { onChangeSearch, onClickSearch, onChangeDate, onClickNew, inputValue } = useBoardSearch({
        keyword,
        setKeyword,
        setStartPage,
        setActivePage,
        setQueryString,
        datePick,
        setTravelQueryString,
        travelQueryString,
    });

    const { RangePicker } = DatePicker;

    const pathname = usePathname();

    return (
        <div className={style.dateSearchNew_wrapper}>
            <div className={style.dateSearch_wrapper}>
                {pathname === '/boards' && (
                    <RangePicker
                        onChange={onChangeDate}
                        value={datePick as [Dayjs | null, Dayjs | null] | null}
                        name="startDate"
                        className={style.rangePicker}
                        classNames={{
                            popup: {
                                root: style.popup,
                            },
                        }}
                    />
                )}
                <div className={style.search_wrapper}>
                    <div className={style.input_wrapper}>
                        <Image src={imgSrc.search} alt="검색이미지" width={24} height={24}></Image>
                        <input
                            type="text"
                            name="search"
                            onChange={onChangeSearch}
                            className={style.input_search}
                            placeholder={
                                pathname === '/boards'
                                    ? '제목을 검색해 주세요.'
                                    : '숙소명을 검색해 주세요.'
                            }
                            value={inputValue}
                        ></input>
                    </div>
                    <button onClick={onClickSearch} className={style.btn_search}>
                        검색
                    </button>
                </div>
            </div>

            <button
                onClick={onClickNew}
                className={pathname === '/boards' ? style.newBtn : style.newTravelBtn}
            >
                <div className={style.newBtn_img}>
                    <Image src={imgSrc.newBtn} alt="등록" width={24} height={24}></Image>
                </div>
                <p>{pathname === '/boards' ? '트립토크 등록' : '숙박권 판매하기'}</p>
            </button>
        </div>
    );
}
