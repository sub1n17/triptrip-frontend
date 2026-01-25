'use client';

import Image from 'next/image';
import InfiniteScroll from 'react-infinite-scroll-component';
import UseCatList from './hook';

export default function CatList() {
    const { catList, onNext } = UseCatList();

    return (
        <div style={{}}>
            <InfiniteScroll
                dataLength={catList.length}
                next={onNext}
                hasMore={true}
                loader={<div> 로딩중</div>}
            >
                {catList.map((el, index) => (
                    <div
                        key={index}
                        style={{
                            objectFit: 'cover',
                            marginBottom: '16px',
                        }}
                    >
                        <Image src={el.url} alt="cat" width={el.width} height={el.height}></Image>
                    </div>
                ))}
            </InfiniteScroll>
        </div>
    );
}
