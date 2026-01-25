'use client';

import React from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// // Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

// import required modules
import { Pagination } from 'swiper/modules';

import Image from 'next/image';

import style from './styles.module.css';
import '@/app/globals.css';

const imgSrc = {
    banner01Img: '/images/banner01.png',
    banner02Img: '/images/banner02.png',
    banner03Img: '/images/banner03.png',
};

export default function BoardsListBanner() {
    return (
        <>
            <Swiper pagination={true} modules={[Pagination]} className={style.mySwiper}>
                <SwiperSlide className={style.swiper_slide}>
                    <div>
                        <Image
                            src={imgSrc.banner03Img}
                            fill
                            sizes="100vw"
                            priority
                            loading="eager"
                            alt="banner03"
                        ></Image>
                    </div>
                </SwiperSlide>
                <SwiperSlide className={style.swiper_slide}>
                    <div>
                        <Image src={imgSrc.banner02Img} fill sizes="100vw" alt="banner02"></Image>
                    </div>
                </SwiperSlide>
                <SwiperSlide className={style.swiper_slide}>
                    <div>
                        <Image src={imgSrc.banner01Img} fill sizes="100vw" alt="banner01"></Image>
                    </div>
                </SwiperSlide>
            </Swiper>
        </>
    );
}
