import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import ApolloSetting from '@/commons/settings/apollo-setting';
import BoardLayout from '@/commons/layout';
import React from 'react';

const geistSans = localFont({
    src: './fonts/GeistVF.woff',
    variable: '--font-geist-sans',
    weight: '100 900',
});
const geistMono = localFont({
    src: './fonts/GeistMonoVF.woff',
    variable: '--font-geist-mono',
    weight: '100 900',
});

export const metadata: Metadata = {
    title: 'trip trip',
    description: 'trip trip',

    // Next.js에서 전역 오픈그래프(OG)를 설정
    openGraph: {
        title: 'trip trip',
        description: '여행을 더 특별하게, trip trip',
        images: [
            {
                url: '/images/productThumbnail.jpg',
            },
        ],
    },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                <ApolloSetting>
                    <BoardLayout>{children}</BoardLayout>
                </ApolloSetting>
            </body>
        </html>
    );
}
