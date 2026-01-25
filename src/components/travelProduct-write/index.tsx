'use client';

import style from './styles.module.css';
import Image from 'next/image';

// Antd - 모달창
import React from 'react';
import '@toast-ui/editor/dist/toastui-editor.css';

// react-hook-form
import { FormProvider } from 'react-hook-form';

// zod
import { FormData } from '@/commons/schema/travelProduct.schema';
import { Modal } from 'antd';
import DaumPostcodeEmbed from 'react-daum-postcode';
import { FetchTravelproductQuery } from '@/commons/graphql/graphql';
import InputSoft from '@/commons/ui/input';
// import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import dynamic from 'next/dynamic';
const ReactQuill = dynamic(() => import('react-quill'), {
    ssr: false,
});

import UseTravelProductWrite from './hooks';
import { ITravelProductWrite } from './types';
import { useParams, useRouter } from 'next/navigation';

const imgSrc = {
    addImage: '/images/add_image.png',
    imgCloseBtnImage: '/images/imgCloseBtn.png',
};

export default function TravelProductWrite<T extends FetchTravelproductQuery>({
    isEdit,
    data,
}: ITravelProductWrite<T>) {
    const {
        methods,
        onClickSubmit,
        onChangeContents,
        onClickAddressShow,
        isModalOpen,
        handleOk,
        handleCancel,
        handleComplete,
        imgUrl,
        fileRef,
        onChangeUrl,
        onClickFile,
        onClickDelete,
    } = UseTravelProductWrite({ isEdit, data });

    const router = useRouter();
    const { productId } = useParams();
    return (
        <main className={style.container}>
            <h3 className={style.title}>{isEdit ? '숙박권 수정하기' : '숙박권 판매하기'}</h3>
            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(onClickSubmit)}>
                    <div className={style.enroll_wrapper}>
                        <div className={style.input_wrapper}>
                            <p>
                                상품명 <span>*</span>
                            </p>
                            <InputSoft<FormData>
                                placeholder="상품명을 입력해 주세요."
                                //className={style.input_wrapperInput}
                                type="text"
                                keyname="name"
                                role="input-name"
                            ></InputSoft>
                            <div className={style.errorTxt}>
                                {methods.formState.errors.name?.message}
                            </div>
                        </div>
                        {/* 상품명 */}
                        <div className={style.input_wrapper}>
                            <p>
                                한줄 요약 <span>*</span>
                            </p>
                            <InputSoft
                                placeholder="상품을 한 줄로 요약해 주세요."
                                //className={style.input_wrapperInput}
                                type="text"
                                keyname="remarks"
                                role="input-remarks"
                            ></InputSoft>
                            <div className={style.errorTxt}>
                                {methods.formState.errors.remarks?.message}
                            </div>
                        </div>
                        {/* 한줄 요약 */}
                        <div className={style.input_wrapper}>
                            <p>
                                상품 설명 <span>*</span>
                            </p>

                            <div role="contents-editor">
                                <ReactQuill
                                    className={style.content_editor}
                                    onChange={onChangeContents}
                                    value={methods.watch('contents')} // watch : 폼 안의 값을 실시간으로 보여줌
                                ></ReactQuill>
                            </div>

                            <div className={style.errorTxt}>
                                {methods.formState.errors.contents?.message}
                            </div>
                        </div>
                        {/* 상품 설명 */}
                        <div className={style.input_wrapper}>
                            <p>
                                판매 가격 <span>*</span>
                            </p>
                            <InputSoft
                                placeholder="판매 가격을 입력해 주세요. (원 단위)"
                                //className={style.input_wrapperInput}
                                type="text"
                                keyname="price"
                                role="input-price"
                            ></InputSoft>
                            <div className={style.errorTxt}>
                                {methods.formState.errors.price?.message}
                            </div>
                        </div>
                        {/* 판매 가격 */}
                        <div className={style.input_wrapper}>
                            <p>태그 입력</p>
                            <InputSoft
                                placeholder="예시) 힐링, 여행"
                                //className={style.input_wrapperInput}
                                type="text"
                                keyname="tags"
                                role="input-tags"
                            ></InputSoft>
                        </div>
                        {/* 태그 입력 */}
                        <div className={`${style.input_wrapper} ${style.address_wrapper}`}>
                            <div className={style.address_left}>
                                <div>
                                    <p>
                                        주소 <span>*</span>
                                    </p>
                                    <div>
                                        <div className={style.address_flex}>
                                            <InputSoft
                                                placeholder="01234"
                                                // className={style.input_wrapperInput}
                                                type="text"
                                                readOnly
                                                keyname="travelproductAddress.zipcode"
                                                role="input-zipcode"
                                            ></InputSoft>
                                            <button
                                                onClick={onClickAddressShow}
                                                type="button"
                                                role="button-address"
                                            >
                                                우편번호 검색
                                            </button>
                                        </div>
                                        <InputSoft
                                            placeholder="상세주소"
                                            //className={style.input_wrapperInput}
                                            type="text"
                                            keyname="travelproductAddress.addressDetail"
                                            role="input-addressDetail"
                                        ></InputSoft>
                                    </div>
                                </div>
                                <div className={style.errorTxt}>
                                    {methods.formState.errors.travelproductAddress?.zipcode
                                        ?.message ||
                                        methods.formState.errors.travelproductAddress?.addressDetail
                                            ?.message}
                                </div>
                                {isModalOpen && (
                                    <div role="modal-postcode">
                                        <Modal
                                            open={isModalOpen}
                                            onOk={handleOk}
                                            onCancel={handleCancel}
                                            footer={null}
                                            className={style.postModal}
                                        >
                                            <DaumPostcodeEmbed onComplete={handleComplete} />
                                        </Modal>
                                    </div>
                                )}
                                {/* 주소 */}
                                <div className={style.lat_wrapper}>
                                    <p>위도 (LAT)</p>
                                    <InputSoft
                                        placeholder="주소를 먼저 입력해 주세요."
                                        //className={style.input_wrapperInput}
                                        readOnly
                                        type="text"
                                        keyname="travelproductAddress.lat"
                                        role="input-lat"
                                    ></InputSoft>
                                </div>
                                <div className={style.lng_wrapper}>
                                    <p>경도 (LNG)</p>
                                    <InputSoft
                                        placeholder="주소를 먼저 입력해 주세요."
                                        // className={style.input_wrapperInput}
                                        readOnly
                                        type="text"
                                        keyname="travelproductAddress.lng"
                                        role="input-lng"
                                    ></InputSoft>
                                </div>
                            </div>
                            <div className={style.address_right}>
                                <p>상세 위치</p>
                                <div className={style.address_location} id="map">
                                    <div>주소를 먼저 입력해주세요.</div>
                                </div>
                            </div>
                        </div>
                        {/* 주소 */}
                        <div className={`${style.input_wrapper} ${style.pic_wrapper}`}>
                            <div>
                                <p>사진 첨부</p>
                                <div className={style.img_flex}>
                                    {imgUrl.map((el, index) => (
                                        <div className={style.img_wrapper} key={index}>
                                            <input
                                                type="file"
                                                style={{ display: 'none' }}
                                                ref={(el) => {
                                                    if (el) fileRef.current[index] = el;
                                                }}
                                                onChange={(event) => onChangeUrl(event, index)}
                                                accept="image/jpeg, image/png"
                                                name="image"
                                            />
                                            <div style={{ position: 'relative', height: '100%' }}>
                                                <Image
                                                    src={
                                                        el
                                                            ? `https://storage.googleapis.com/${el}`
                                                            : imgSrc.addImage
                                                    }
                                                    alt="사진"
                                                    fill
                                                    sizes="160px"
                                                    priority
                                                    style={{ objectFit: 'cover' }}
                                                    onClick={() => onClickFile(index)}
                                                    role={`image-upload-${index}`}
                                                ></Image>
                                            </div>
                                            {el && (
                                                <Image
                                                    src={imgSrc.imgCloseBtnImage}
                                                    alt="삭제버튼"
                                                    width={0}
                                                    height={0}
                                                    sizes="24px"
                                                    className={style.closeImg}
                                                    onClick={() => onClickDelete(index)}
                                                    role={`image-delete-${index}`}
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        {/* 제목 */}
                    </div>
                    <div className={style.btn_wrapper}>
                        <div className={style.btn_inner}>
                            <button
                                className={style.cancel}
                                type="button"
                                onClick={
                                    () =>
                                        isEdit
                                            ? router.replace(`/travelProduct/${productId}`)
                                            : router.replace(`/travelProduct`)

                                    // () => router.push(`/travelProduct/${productId}`)
                                }
                            >
                                취소
                            </button>
                            <button
                                type="submit"
                                disabled={!methods.formState.isValid}
                                className={
                                    methods.formState.isValid
                                        ? style.submitActive
                                        : style.submitNotActive
                                }
                                role="button-submit"
                            >
                                {isEdit ? '수정하기' : '등록하기'}
                            </button>
                        </div>
                    </div>
                </form>
            </FormProvider>
        </main>
    );
}
