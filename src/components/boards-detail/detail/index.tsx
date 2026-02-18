'use client';

import useBoardDetail from './hook';
import style from './styles.module.css';
import Image from 'next/image';
import CommentWrite from '../comment-write';
import CommentList from '../comment-list';
// Antd tooltip
import { Tooltip } from 'antd';
// MUI icon
import SentimentSatisfiedOutlinedIcon from '@mui/icons-material/SentimentSatisfiedOutlined';
import SentimentDissatisfiedOutlinedIcon from '@mui/icons-material/SentimentDissatisfiedOutlined';
// YouTube
import YouTube from 'react-youtube';

const imgSrc = {
    profileImg: '/images/profile.svg',
    linkImg: '/icons/link.svg',
    locationSvg: '/images/location.svg',
    listImg: '/icons/list.svg',
    pencilImg: '/icons/edit.svg',
};

export default function BoardDetail({ isCommentEdit }: { isCommentEdit?: boolean }) {
    const { data, onClickList, onClickEdit, onClickLike, onClickDislike, onClickCopy } =
        useBoardDetail();

    return (
        <main className={style.detail_wrapper}>
            <div className={style.container}>
                <div className={style.detail_top}>
                    <div className={style.detail_title}>{data?.fetchBoard.title}</div>
                    <div className={style.name_date}>
                        <div className={style.name}>
                            <div className={style.profileImg}>
                                <Image
                                    src={imgSrc.profileImg}
                                    alt="프로필이미지"
                                    fill
                                    sizes="24px"
                                ></Image>
                            </div>
                            <p>{data?.fetchBoard.writer}</p>
                        </div>
                        <p className={style.date}>
                            {data?.fetchBoard?.createdAt?.slice(0, 10).split('-').join('.')}
                        </p>
                    </div>
                </div>
                <div className={style.detail_center}>
                    <div className={style.link_location}>
                        <button onClick={onClickCopy} className={style.linkImg}>
                            <Image src={imgSrc.linkImg} fill alt="링크이미지" sizes="24px"></Image>
                        </button>
                        {data?.fetchBoard?.boardAddress?.address && (
                            <div className={style.locationImg}>
                                <Tooltip title={data?.fetchBoard?.boardAddress?.address}>
                                    <Image
                                        src={imgSrc.locationSvg}
                                        fill
                                        alt="로케이션이미지"
                                        style={{ objectFit: 'contain' }}
                                        sizes="24px"
                                    ></Image>
                                </Tooltip>
                            </div>
                        )}
                    </div>

                    {data?.fetchBoard.images?.map(
                        (el, index) =>
                            el !== '' && (
                                <Image
                                    key={index}
                                    src={`https://storage.googleapis.com/${el}`}
                                    width={0}
                                    height={0}
                                    sizes="100vw"
                                    alt="이미지"
                                    className={style.fetchBoardImg}
                                ></Image>
                            ),
                    )}
                    {/* a&&b => a와 b가 모두 참일 때 b가 실행됨 */}

                    <div className={style.txt_wrap}>{data?.fetchBoard.contents}</div>
                    {(data?.fetchBoard?.youtubeUrl?.includes('v=') ||
                        data?.fetchBoard?.youtubeUrl?.includes('youtu.be/')) && (
                        <div className={style.video_wrap}>
                            <YouTube
                                className={style.youtube_wrap}
                                videoId={
                                    data?.fetchBoard?.youtubeUrl?.includes('v=')
                                        ? data?.fetchBoard?.youtubeUrl?.split('v=')[1].split('&')[0]
                                        : data?.fetchBoard?.youtubeUrl
                                              ?.split('youtu.be/')[1]
                                              ?.split('?')[0]
                                }
                            ></YouTube>
                        </div>
                    )}
                </div>
                <div className={style.detail_bottom}>
                    <div className={style.good_wrapper} onClick={onClickLike}>
                        <div>
                            <SentimentSatisfiedOutlinedIcon></SentimentSatisfiedOutlinedIcon>
                        </div>
                        <div>{data?.fetchBoard.likeCount ?? 0}</div>
                    </div>
                    <div className={style.bad_wrapper} onClick={onClickDislike}>
                        <div>
                            <SentimentDissatisfiedOutlinedIcon></SentimentDissatisfiedOutlinedIcon>
                        </div>
                        <div>{data?.fetchBoard?.dislikeCount ?? 0}</div>
                    </div>
                </div>
                <div className={style.detail_btn_wrapper}>
                    <button className={style.list_wrapper} onClick={onClickList}>
                        <div className={style.listImg}>
                            <Image
                                src={imgSrc.listImg}
                                fill
                                alt="리스트이미지"
                                sizes="24px"
                            ></Image>
                        </div>
                        <p>목록으로</p>
                    </button>

                    <button className={style.modify_wrapper} onClick={onClickEdit}>
                        <div className={style.pencilImg}>
                            <Image
                                src={imgSrc.pencilImg}
                                fill
                                alt="연필이미지"
                                sizes="24px"
                            ></Image>
                        </div>
                        <p>수정하기</p>
                    </button>
                </div>
            </div>
            <CommentWrite isCommentEdit={isCommentEdit}></CommentWrite>
            <CommentList></CommentList>
        </main>
    );
}
