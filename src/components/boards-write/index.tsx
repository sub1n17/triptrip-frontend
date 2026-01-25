'use client';

import style from './styles.module.css';
import Image from 'next/image';
import { IBoardWriteProps } from './types';
import useBoardsWrite from './hooks';

// Antd - 모달창
import React from 'react';
import { Modal, Input, Space } from 'antd';

// react-daum-postcode - 우편번호검색
import DaumPostcodeEmbed from 'react-daum-postcode';

// import addImage from '../../../images/add_image.png';
// ㄴ> 오류나는 이유: TypeScript는 기본적으로 .ts/.tsx 파일 타입만 알 수 있음
// .png 같은 이미지 파일은 타입 정의가 없으면 모듈로 인식하지 못함
// 해결방법: require써서 타입을 체크하지 않고 그냥 any 타입으로 받아줌
// 이미지가 많을 때 객체로 모아서 사용하면 됨
const imgSrc = {
    // addImage: require('../../../images/add_image.png'), -> 옛날방식으므로 현재는 절대경로/import해서 사용함
    addImage: '/images/add_image.png',
    imgCloseBtnImage: '/images/imgCloseBtn.png',
};

export default function BoardWritePage(props: IBoardWriteProps) {
    const {
        password,
        errorName,
        errorPassword,
        errorTitle,
        errorContent,
        isActive,
        onChangePassword,
        onChangeInput,
        onClickSubmit,
        addressToggle,
        modalAddressComplete,
        modalAddress,
        zoneCode,
        address,
        detailAddress,
        onChangeDetailAddress,
        onChangeYoutube,
        youtubeUrl,
        fileRef,
        onClickFile,
        onChangeUrl,
        imgUrl,
        onClickClose,
        onClickCancel,
        isModalOpen,
        setIsModalOpen,
        boardPw,
        setBoardPw,
        onConfirmPassword,
    } = useBoardsWrite(props);

    return (
        <main className={style.container}>
            <h3 className={style.title}> {props.isEdit ? '게시물 수정하기' : '게시물 등록하기'}</h3>
            <div className={style.enroll_wrapper}>
                <div className={`${style.input_wrapper} ${style.name_wrapper}`}>
                    <div className={style.name_box}>
                        <p>
                            작성자 <span>*</span>
                        </p>
                        <input
                            type="text"
                            placeholder="작성자 명을 입력해 주세요."
                            onChange={onChangeInput}
                            className={style.input_wrapperInput}
                            defaultValue={props.data?.fetchBoard.writer ?? ''}
                            disabled={props.isEdit}
                            // disabled는 true이면 input이 비활성화됨 => 수정하기 페이지는 isEdit={true}이므로 비활성화됨
                            id="writer"
                        />

                        <div className={style.errorTxt}>{errorName}</div>
                    </div>
                    <div className={style.pw_box}>
                        <p>
                            비밀번호 <span>*</span>
                        </p>
                        <input
                            placeholder="비밀번호를 입력해 주세요."
                            onChange={onChangePassword}
                            className={style.input_wrapperInput}
                            disabled={props.isEdit}
                            defaultValue={props.isEdit ? '*********' : password}
                            name="password"
                        ></input>
                        <div className={style.errorTxt}>{errorPassword}</div>
                    </div>
                </div>
                {/* 작성자, 비밀번호 */}
                <div className={style.input_wrapper}>
                    <div>
                        <p>
                            제목 <span>*</span>
                        </p>
                        <input
                            placeholder="제목을 입력해 주세요."
                            onChange={onChangeInput}
                            className={style.input_wrapperInput}
                            defaultValue={props.data?.fetchBoard.title}
                            id="title"
                        ></input>
                        <div className={style.errorTxt}>{errorTitle}</div>
                    </div>
                </div>
                {/* 제목 */}
                <div className={style.input_wrapper}>
                    <div>
                        <p>
                            내용 <span>*</span>
                        </p>
                        <textarea
                            placeholder="내용을 입력해 주세요."
                            onChange={onChangeInput}
                            className={style.input_wrapperTextarea}
                            defaultValue={props.data?.fetchBoard.contents}
                            id="contents"
                        ></textarea>
                        <div className={style.errorTxt}>{errorContent}</div>
                    </div>
                </div>
                {/* 내용 */}
                <div className={`${style.input_wrapper} ${style.address_wrapper}`}>
                    <div>
                        <p>주소</p>
                        <div>
                            <div className={style.address_flex}>
                                <input
                                    placeholder="01234"
                                    className={style.input_wrapperInput}
                                    value={zoneCode}
                                    readOnly
                                    name="zoneCode"
                                ></input>
                                <button onClick={addressToggle}>우편번호 검색</button>
                            </div>
                            <input
                                placeholder="주소를 입력해 주세요."
                                className={`${style.sec_input} ${style.input_wrapperInput}`}
                                value={address}
                                readOnly
                                name="address"
                                autoComplete="address"
                            ></input>
                            <input
                                placeholder="상세주소"
                                className={style.input_wrapperInput}
                                onChange={onChangeDetailAddress}
                                value={detailAddress}
                                name="detailAddress"
                            ></input>
                        </div>
                    </div>
                </div>
                {modalAddress && (
                    <Modal
                        // title='완료'
                        open={modalAddress}
                        // onOk={addressToggle}

                        onCancel={addressToggle}
                        footer={null}
                        cancelText="취소"
                        centered
                        className={style.postModal}
                    >
                        <DaumPostcodeEmbed onComplete={modalAddressComplete} />
                    </Modal>
                )}
                {/* 주소 */}

                <div className={style.input_wrapper}>
                    <div>
                        <p>유튜브 링크</p>
                        <input
                            placeholder="링크를 입력해 주세요."
                            className={style.input_wrapperInput}
                            onChange={onChangeYoutube}
                            value={String(youtubeUrl)}
                            name="youtubeUrl"
                        ></input>
                    </div>
                </div>
                {/* 유튜브 */}
                <div className={`${style.input_wrapper} ${style.pic_wrapper}`}>
                    <div>
                        <p>사진 첨부</p>
                        <div className={style.img_wrapper}>
                            {imgUrl.map((el, index) => (
                                <div key={index}>
                                    <input
                                        type="file"
                                        style={{ display: 'none' }}
                                        ref={(el) => {
                                            fileRef.current[index] = el!;
                                        }}
                                        // ㄴ> 배열처럼 여러 개의 input을 렌더링할 때는,
                                        // React는 “각각의 input이 어떤 ref에 연결되어야 하는지” 모름
                                        // 실제로 클릭되는 요소니까 el은 input임
                                        // fileRef.current = <input type="file" />; 이니까  index번째 input을 ref로 지정한다는 의미
                                        // “index번째 input 요소를 fileRef.current의 해당 위치에 저장한다”
                                        //fileRef.current[2] → 세 번째 <input> DOM
                                        onChange={(event) => {
                                            onChangeUrl(event, index);
                                        }}
                                        accept="image/jpg, image/png"
                                        name="file"
                                    ></input>
                                    <div className={style.imgBox}>
                                        {imgUrl[index] && (
                                            <Image
                                                // src={`https://storage.googleapis.com/${imgUrl[index]}`} 이미지 성능 개선 전
                                                src={
                                                    imgUrl[index].startsWith('data')
                                                        ? imgUrl[index]
                                                        : `https://storage.googleapis.com/${imgUrl[index]}`
                                                }
                                                // 이미지를 업로드할 때는 미리보기로 해서 data:image/png;base64,... 이런 형태로 저장되는데
                                                // 등록할 때는 실제 이미지 url로 db에 저장됨, 수정하려고 게시글을 조회할 때 db에서 가져오기 때문에 실제 url형태로 보이게 해야 되는데
                                                // src={${imgUrl[index]}} 이렇게만 적으면 수정 시 이미지를 불러올 수 없음
                                                // 그래서 imgUrl이 data가 아닐 때 (즉, uploadFile 후 db에 저장되었을 때)는 실제 클라우드에 저장되어있는 이미지를 불러오도록 삼항연산자 사용하기
                                                alt="추가 이미지"
                                                width={160}
                                                height={160}
                                                sizes="100vw"
                                                style={{
                                                    width: '100%',
                                                    height: 'auto',
                                                    aspectRatio: '1/1',
                                                    overflow: 'hidden',
                                                    objectFit: 'cover',
                                                }}
                                                className={style.afterImg}
                                                onClick={() => onClickFile(index)}
                                            ></Image>
                                        )}
                                        {imgUrl[index] && (
                                            <Image
                                                src={imgSrc.imgCloseBtnImage}
                                                alt="삭제버튼"
                                                width={0}
                                                height={204}
                                                sizes="100vw"
                                                onClick={() => onClickClose(index)}
                                                className={style.closeImg}
                                            ></Image>
                                        )}

                                        {!imgUrl[index] && (
                                            <Image
                                                src={imgSrc.addImage}
                                                alt="추가 이미지"
                                                width={0}
                                                height={0}
                                                sizes="100vw"
                                                style={{
                                                    width: '100%',
                                                    height: 'auto',
                                                    cursor: 'pointer',
                                                }}
                                                onClick={() => onClickFile(index)}
                                                className={style.beforeImg}
                                                priority
                                            ></Image>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                {/* 사진 */}
            </div>
            <div className={style.btn_wrapper}>
                <div className={style.btn_inner}>
                    <button className={style.cancel} onClick={onClickCancel}>
                        취소
                    </button>
                    <button
                        onClick={onClickSubmit}
                        className={
                            props.isEdit || isActive ? style.submitActive : style.submitNotActive
                        }
                    >
                        {props.isEdit ? '수정' : '등록'}하기
                    </button>
                </div>
            </div>
            <Modal
                open={isModalOpen}
                onOk={onConfirmPassword}
                onCancel={() => {
                    setIsModalOpen(false);
                    setBoardPw('');
                }}
                okText="수정"
                cancelText="취소"
                centered
                className={style.modal}
            >
                <div>게시글 비밀번호를 입력해주세요.</div>
                <Space>
                    <Input.Password
                        placeholder="비밀번호를 입력해주세요."
                        onChange={(e) => setBoardPw(e.target.value)}
                        className={style.input_pw}
                        value={boardPw}
                    />
                </Space>
            </Modal>
        </main>
    );
}
