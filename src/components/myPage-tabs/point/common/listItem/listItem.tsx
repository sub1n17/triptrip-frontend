'use client';

import style from './styles.module.css';

interface IPointListItemProps {
    createdAt?: string;
    status?: string;
    amount?: number;
    balance?: number;
    impUid?: string | null;
    product?: string;
    seller?: string;
    type?: string;
}

export default function PointListItem(props: IPointListItemProps) {
    return (
        <>
            <button className={`${style.flex_wrap} ${style.board_list}`}>
                {props.createdAt && (
                    <div className={style.list_date}>
                        {props.createdAt.slice(0, 10).split('-').join('.')}
                    </div>
                )}
                {props.status && (
                    <div
                        className={style.list_description}
                        style={{ color: props.status === '구매' ? '#F66A6A' : '#2974E5' }}
                    >
                        {props.status}
                    </div>
                )}
                {props.impUid && <div className={style.list_paymentId}>{props.impUid}</div>}
                {props.product && (
                    <div className={props.type === 'buy' ? style.buy_product : style.sell_product}>
                        {props.product}
                    </div>
                )}
                {props.amount && (
                    <div
                        className={
                            props.type === 'total'
                                ? style.total_history
                                : props.type === 'charge' || props.type === 'sell'
                                  ? style.charge_history
                                  : props.type === 'buy'
                                    ? style.buy_history
                                    : style.list_history
                        }
                        style={{
                            color:
                                props.type === 'buy' || props.status === '구매'
                                    ? '#F66A6A'
                                    : '#2974E5',
                        }}
                    >
                        {props.type === 'buy' || props.status === '구매'
                            ? props.amount
                            : `+${props.amount.toLocaleString()}`}
                    </div>
                )}
                {props.balance && (
                    <div className={style.list_balance}>{props.balance.toLocaleString()}</div>
                )}
                {props.seller && <div className={style.list_seller}>{props.seller}</div>}
            </button>
        </>
    );
}
