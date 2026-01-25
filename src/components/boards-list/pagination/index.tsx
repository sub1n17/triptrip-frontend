'use client';

import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import usePagination from './hook';
import { IPaginationProps } from './types';
import style from './styles.module.css';

export default function Pagination(props: IPaginationProps) {
    const { onClickPage, onClickPrev, onClickNext } = usePagination(props);

    return (
        <div className={style.pagination}>
            <button onClick={onClickPrev} disabled={props.startPage === 1}>
                <ArrowBackIosNewIcon
                    sx={{
                        color: props.startPage === 1 ? '#C7C7C7 ' : '#333333',
                        fontSize: '16px',
                        cursor: 'pointer',
                    }}
                ></ArrowBackIosNewIcon>
            </button>

            <div className={style.page_wrapper}>
                {new Array(5).fill('index').map((el, index) => {
                    return (
                        index + props.startPage <= props.lastPage && (
                            <div
                                key={index + props.startPage}
                                onClick={() => onClickPage(index + props.startPage)}
                                id={String(index + props.startPage)}
                                className={`${style.page} ${
                                    props.activePage === index + props.startPage
                                        ? style.active_page
                                        : ''
                                }`}
                            >
                                {index + props.startPage}
                            </div>
                        )
                    );
                })}
            </div>

            <button onClick={onClickNext} disabled={props.startPage + 5 > props.lastPage}>
                <ArrowForwardIosIcon
                    sx={{
                        width: '16px',
                        cursor: 'pointer',
                        color: props.startPage + 5 > props.lastPage ? '#C7C7C7 ' : '#333333',
                    }}
                ></ArrowForwardIosIcon>
            </button>
        </div>
    );
}
