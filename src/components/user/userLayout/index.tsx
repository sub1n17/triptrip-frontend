'use client';

import Image from 'next/image';
import style from './styles.module.css';

const imgSrc = {
    userRight: '/images/user_right.png',
};
export default function UserLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className={style.layout_wrapper}>
            <div className={style.input_wrapper}>{children}</div>
            <div className={style.right_img}>
                <Image
                    src={imgSrc.userRight}
                    alt="해변"
                    width={100}
                    height={100}
                    sizes="100vw"
                ></Image>
            </div>
        </div>
    );
}
