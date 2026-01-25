'use client';

import style from './styles.module.css';
import Image from 'next/image';

const imgSrc = {
    // profileImg: require('../../../public/images/profile.png'), => 요즘엔 require()보다는 절대 경로나 import를 권장
    profileImg: '/images/profile.png', // 이미지에서 / 절대경로는 public을 기준으로 함 (Link 컴포넌트에서는 그대로)
    linkImg: '/images/link.png',
    locationImg: '/images/location.png',
    beachImg: '/images/beach.png',
    videoImg: '/images/video.png',
    badImg: '/images/bad.png',
    goodImg: '/images/good.png',
    listImg: '/images/list.png',
    pencilImg: '/images/pencil.png',
};

const BoardsDetail = () => {
    return (
        <main className={style.container}>
            <div className={style.detail_top}>
                <div className={style.detail_title}>
                    살어리 살어리랏다 쳥산(靑山)애 살어리랏다멀위랑 ᄃᆞ래랑 먹고 쳥산(靑山)애
                    살어리랏다얄리얄리 얄랑셩 얄라리 얄라
                </div>
                <div className={style.name_date}>
                    <div className={style.name}>
                        <div>
                            <Image
                                src={imgSrc.profileImg}
                                alt="프로필이미지"
                                width={0}
                                height={0}
                                sizes="100vw"
                                style={{ width: '100%', height: 'auto' }}
                            ></Image>
                        </div>

                        <p>홍길동</p>
                    </div>
                    <p className={style.date}>2024.11.11</p>
                </div>
            </div>
            <div className={style.detail_center}>
                <div className={style.link_location}>
                    <div>
                        <Image
                            src={imgSrc.linkImg}
                            width={0}
                            height={0}
                            sizes="100vw"
                            style={{ width: 'auto', height: 'auto' }}
                            alt="링크이미지"
                        ></Image>
                    </div>

                    <div>
                        <Image
                            src={imgSrc.locationImg}
                            width={0}
                            height={0}
                            sizes="100vw"
                            alt="로케이션이미지"
                            style={{ width: '100%', height: 'auto' }}
                        ></Image>
                    </div>
                </div>
                <div>
                    <Image
                        src={imgSrc.beachImg}
                        width={0}
                        height={0}
                        sizes="100vw"
                        style={{ width: 'auto', height: 'auto' }}
                        alt="해변이미지"
                    ></Image>
                </div>
                <div className={style.txt_wrap}>
                    <div>
                        <p>살겠노라 살겠노라. 청산에 살겠노라.</p>
                        <p>머루랑 다래를 먹고 청산에 살겠노라.</p>
                        <p>얄리얄리 얄랑셩 얄라리 얄라</p>
                    </div>
                    <div>
                        <p>우는구나 우는구나 새야. 자고 일어나 우는구나 새야.</p>
                        <p>너보다 시름 많은 나도 자고 일어나 우노라.</p>
                        <p>얄리얄리 얄라셩 얄라리 얄라</p>
                    </div>
                    <div>
                        <p>갈던 밭(사래) 갈던 밭 보았느냐. 물 아래(근처) 갈던 밭 보았느냐</p>
                        <p>이끼 묻은 쟁기를 가지고 물 아래 갈던 밭 보았느냐..</p>
                        <p>얄리얄리 얄라셩 얄라리 얄라</p>
                    </div>
                    <div>
                        <p>이럭저럭 하여 낮일랑 지내 왔건만</p>
                        <p>올 이도 갈 이도 없는 밤일랑 또 어찌 할 것인가.</p>
                        <p>얄리얄리 얄라셩 얄라리 얄라</p>
                    </div>
                    <div>
                        <p>어디다 던지는 돌인가 누구를 맞히려던 돌인가.</p>
                        <p>미워할 이도 사랑할 이도 없이 맞아서 우노라.</p>
                        <p>얄리얄리 얄라셩 얄라리 얄라</p>
                    </div>
                    <div>
                        <p>살겠노라 살겠노라. 청산에 살겠노라.</p>
                        <p>나문재, 굴, 조개를 먹고 바다에 살겠노라.</p>
                        <p>얄리얄리 얄라셩 얄라리 얄라</p>
                    </div>
                    <div>
                        <p>가다가 가다가 듣노라. 에정지(미상) 가다가 듣노라.</p>
                        <p>사슴(탈 쓴 광대)이 솟대에 올라서 해금을 켜는 것을 듣노라.</p>
                        <p>얄리얄리 얄라셩 얄라리 얄라</p>
                    </div>
                    <div>
                        <p>가다 보니 배불룩한 술독에 독한 술을 빚는구나.</p>
                        <p>조롱박꽃 모양 누룩이 매워 (나를) 붙잡으니 내 어찌 하리이까.[1]</p>
                        <p>얄리얄리 얄라셩 얄라리 얄라</p>
                    </div>
                </div>
                <div className={style.video_wrap}>
                    <Image
                        src={imgSrc.videoImg}
                        width={0}
                        height={0}
                        sizes="100vw"
                        style={{ width: '100%', height: 'auto' }}
                        alt="비디오이미지"
                    ></Image>
                </div>
            </div>
            <div className={style.detail_bottom}>
                <div className={style.bad_wrapper}>
                    <div>
                        <Image
                            src={imgSrc.badImg}
                            width={0}
                            height={0}
                            sizes="100vw"
                            style={{ width: '100%', height: 'auto' }}
                            alt="나빠요이미지"
                        ></Image>
                    </div>
                    <div>24</div>
                </div>
                <div className={style.good_wrapper}>
                    <div>
                        <Image
                            src={imgSrc.goodImg}
                            width={0}
                            height={0}
                            sizes="100vw"
                            style={{ width: '100%', height: 'auto' }}
                            alt="좋아요이미지"
                        ></Image>
                    </div>
                    <div>12</div>
                </div>
            </div>
            <div className={style.detail_btn_wrapper}>
                <div className={style.list_wrapper}>
                    <div>
                        <Image
                            src={imgSrc.listImg}
                            width={0}
                            height={0}
                            sizes="100vw"
                            style={{ width: '100%', height: 'auto' }}
                            alt="리스트이미지"
                        ></Image>
                    </div>
                    <p>목록으로</p>
                </div>
                <div className={style.modify_wrapper}>
                    <div>
                        <Image
                            src={imgSrc.pencilImg}
                            width={0}
                            height={0}
                            sizes="100vw"
                            style={{ width: '100%', height: 'auto' }}
                            alt="연필이미지"
                        ></Image>
                    </div>
                    <p>수정하기</p>
                </div>
            </div>
        </main>
    );
};
export default BoardsDetail;
