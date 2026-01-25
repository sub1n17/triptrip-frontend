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

export default function BoardBanner() {
    return (
        <>
            <Swiper pagination={true} modules={[Pagination]} loop={true} className={style.mySwiper}>
                <SwiperSlide>
                    <div className={style.slideImg}>
                        <Image
                            src={imgSrc.banner03Img}
                            sizes="(max-width: 768px) 100vw, 1920px"
                            fill
                            alt="banner03"
                            priority
                        ></Image>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className={style.slideImg}>
                        <Image
                            src={imgSrc.banner02Img}
                            sizes="(max-width: 768px) 100vw, 1920px"
                            fill
                            alt="banner02"
                        ></Image>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className={style.slideImg}>
                        <Image
                            src={imgSrc.banner01Img}
                            sizes="(max-width: 768px) 100vw, 1920px"
                            fill
                            alt="banner01"
                        ></Image>
                    </div>
                </SwiperSlide>
            </Swiper>
        </>
    );
}
