'use client';

import Image from 'next/image';
import style from './styles.module.css';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import UseTravelProductRecent from '../hooks';

export default function TravelProductRecentPc() {
    const { recentProduct } = UseTravelProductRecent();

    const searchParams = useSearchParams();

    // 최근 본 상품 없으면 null
    if (recentProduct.length === 0) return null;

    return (
        <div className={style.recent_wrapper}>
            <div className={style.recent_txt}>최근 본 상품</div>
            <div className={style.recent_product}>
                {recentProduct.slice(0, 3).map((el) => {
                    return (
                        <div key={el._id}>
                            <Link href={`/travelProduct/${el._id}?${searchParams.toString()}`}>
                                <div className={style.recent_img}>
                                    <Image
                                        src={
                                            el.image
                                                ? `https://storage.googleapis.com/${el.image}`
                                                : '/images/productThumbnail.jpg'
                                        }
                                        alt="recent"
                                        fill
                                        sizes="50vw"
                                        className={style.objectFit_img}
                                    ></Image>
                                </div>
                            </Link>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
