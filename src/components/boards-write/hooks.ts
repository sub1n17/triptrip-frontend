import { ApolloError, useMutation, useQuery } from '@apollo/client';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { IBoardWriteProps, IUpdateInput } from './types';
import {
    CreateBoardDocument,
    FetchBoardDocument,
    FetchBoardsDocument,
    UpdateBoardDocument,
} from '@/commons/graphql/graphql';

// 우편번호 모달
import { Address } from 'react-daum-postcode';
import { UPLOAD_FILE } from './queries';
import { imageValidation } from '@/commons/libraries/imageValidation';
import { message } from 'antd';

export default function useBoardsWrite(props: IBoardWriteProps) {
    // 수정할 때 입력값 받아오기 위해 게시판아이디 가져오기
    const params = useParams();

    // API 실행시킬 함수 생성하기
    const [createBoard] = useMutation(CreateBoardDocument);

    // 수정화면에서 작성자, 비번, 제목, 내용 보여주기
    const { data } = useQuery(FetchBoardDocument, {
        variables: {
            boardId: String(params.boardId),
        },
    });

    // 수정하기 뮤테이션
    const [updateBoard] = useMutation(UpdateBoardDocument);

    // 인풋 변수 만들기
    const [password, setPassword] = useState('');

    // ***************** 작성자, 제목, 내용 state 리팩토링 *****************
    const [boardInput, setBoardInput] = useState({
        writer: '',
        title: '',
        contents: '',
    });

    // 에러메시지 보여주는 변수 만들기
    const [errorName, setErrorName] = useState('');
    const [errorPassword, setErrorPassword] = useState('');
    const [errorTitle, setErrorTitle] = useState('');
    const [errorContent, setErrorContent] = useState('');

    // 등록하기 버튼 활성화/비활성화 상태 만들기
    const [isActive, setIsActive] = useState(props.isEdit ? true : false);

    // 게시글 등록 후 해당 게시물로 페이지 이동하게 해주기
    const router = useRouter();

    // ***************** 작성자, 제목, 내용 state 리팩토링 *****************
    const onChangeInput = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setBoardInput((prev) => ({
            ...prev,
            [event.target.id]: event.target.value,
        }));
    };

    // 버튼 활성화하기
    useEffect(() => {
        if (
            boardInput.writer !== '' &&
            boardInput.title !== '' &&
            boardInput.contents !== '' &&
            password !== ''
        ) {
            return setIsActive(true);
        }
        setIsActive(false);
    }, [boardInput, password]);

    // ************************** 비밀번호 **************************
    // 비밀번호 인풋 감지하기
    const onChangePassword = (event: ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    // ************************** 우편번호 **************************
    // 우편번호 모달 열기 변수 만들기
    const [modalAddress, setModalAddress] = useState(false);

    // 우편번호 모달 열기/닫기 토글 만들기
    const addressToggle = () => {
        setModalAddress((prev) => !prev);
    };

    // 우편번호, 상세주소 입력값 가져오기
    const [zoneCode, setZoneCode] = useState('');
    const [address, setAddress] = useState('');
    const [detailAddress, setDetailAddress] = useState('');

    // 주소는 중첩객체라 받아오는 시간이 느리기 때문에 데이터가 다 전달되면 주소 인풋값을 변경함
    useEffect(() => {
        if (props.isEdit && data) {
            setZoneCode(data.fetchBoard.boardAddress?.zipcode ?? '');
            setAddress(data.fetchBoard.boardAddress?.address ?? '');
            setDetailAddress(data.fetchBoard.boardAddress?.addressDetail ?? '');
            setYoutubeUrl(data.fetchBoard.youtubeUrl ?? '');

            setBoardInput({
                writer: data.fetchBoard.writer ?? '',
                title: data.fetchBoard.title ?? '',
                contents: data.fetchBoard.contents ?? '',
            });

            // 기존 이미지들을 인덱스대로 채워넣기
            setImgUrl([
                data.fetchBoard.images?.[0] ?? '',
                data.fetchBoard.images?.[1] ?? '',
                data.fetchBoard.images?.[2] ?? '',
            ]);

            //  기존 이미지는 이미 서버에 있는 거라 파일은 null
            setFiles([null, null, null]);
        }
    }, [data, props.isEdit]);

    // 우편번호 검색 완료 시 모달창도 같이 닫기
    const modalAddressComplete = (data: Address) => {
        addressToggle();
        setZoneCode(data.zonecode);
        setAddress(data.address);
    };

    // 상세주소 입력값 가져오기
    const onChangeDetailAddress = (event: ChangeEvent<HTMLInputElement>) => {
        // console.log(event.target.value);
        setDetailAddress(event.target.value);
    };

    // ************************** 유튜브 링크 **************************
    // 유튜브 링크 입력값 가져오기
    const [youtubeUrl, setYoutubeUrl] = useState('');
    const onChangeYoutube = (event: ChangeEvent<HTMLInputElement>) => {
        setYoutubeUrl(event.target.value);
        // console.log(event.target.value);
    };

    // ************************** 이미지 첨부 **************************
    const fileRef = useRef<HTMLInputElement[]>([]);

    // 이미지 미리보기
    const [imgUrl, setImgUrl] = useState<string[]>(['', '', '']);
    // 임시 url
    const [files, setFiles] = useState<(File | null)[]>([null, null, null]);

    const [uploadFile] = useMutation(UPLOAD_FILE);

    // 이미지 클릭하면 인풋이 클릭되게 하기
    const onClickFile = (index: number) => {
        fileRef.current[index]?.click();
    };

    // 이미지 추가하면 url 바꾸기
    const onChangeUrl = (event: ChangeEvent<HTMLInputElement>, index: number) => {
        const file = event.target.files?.[0]; // undefined 방지
        if (!file) return;
        // console.log(file);

        // 이미지의 최대용량 5MB로 제한
        const isValid = imageValidation(file);
        if (!isValid) return;

        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = (event) => {
            // console.log(event.target?.result);

            if (typeof event.target?.result === 'string') {
                const tempImgUrl = [...imgUrl];
                tempImgUrl[index] = event.target?.result; // 미리보기
                setImgUrl(tempImgUrl);

                const tempFiles = [...files];
                tempFiles[index] = file; // 실제 파일
                setFiles(tempFiles);
            }
        };
    };

    // 삭제버튼 클릭시 초기화하기
    const onClickClose = (index: number) => {
        // 미리보기 제거
        setImgUrl((prev) => {
            const newArr = [...prev];
            newArr[index] = '';
            return newArr;
        });

        // 실제 파일 제거
        setFiles((prev) => {
            const newArr = [...prev];
            newArr[index] = null;
            return newArr;
        });
    };

    // ************************** 비밀번호 확인 모달 **************************
    const [isModalOpen, setIsModalOpen] = useState(false);

    // ************************** 등록 취소 버튼 **************************
    const onClickCancel = () => {
        if (props.isEdit) {
            router.replace(`/boards/${data?.fetchBoard._id}`);
        } else {
            router.push('/boards');
        }
    };

    const searchParams = useSearchParams();
    const search = searchParams.get('search');
    const dateStart = searchParams.get('dateStart');
    const dateEnd = searchParams.get('dateEnd');

    // ************************** 등록하기 버튼 **************************
    // 등록하기 버튼 실행
    const onClickSubmit = async () => {
        // 등록하기 페이지일 때
        if (!props.isEdit) {
            try {
                if (boardInput.writer === '') {
                    // 입력하지 않을 때 에러메시지 띄우기 - 이름
                    setErrorName('필수입력사항입니다.');
                    return;
                } else {
                    setErrorName('');
                }

                // 입력하지 않을 때 에러메시지 띄우기 - 비밀번호
                if (password === '') {
                    setErrorPassword('필수입력사항입니다.');
                    return;
                } else {
                    setErrorPassword('');
                }

                // 입력하지 않을 때 에러메시지 띄우기 - 제목
                if (boardInput.title === '') {
                    setErrorTitle('필수입력사항입니다.');
                    return;
                } else {
                    setErrorTitle('');
                }

                // 입력하지 않을 때 에러메시지 띄우기 - 내용
                if (boardInput.contents === '') {
                    setErrorContent('필수입력사항입니다.');
                    return;
                } else {
                    setErrorContent('');
                }

                const resultImgUrl = await Promise.all(
                    files.map(async (el, index) => {
                        if (!el) return imgUrl[index]; // 기존 이미지 유지

                        const result = await uploadFile({
                            variables: { file: el },
                        });

                        return result.data.uploadFile.url;
                    }),
                );

                // 버튼 눌렸을 때 API 요청하기
                const result = await createBoard({
                    variables: {
                        createBoardInput: {
                            //  writer: boardInput.name,
                            password: password,
                            // title: boardInput.title ?? '',
                            //  contents: boardInput.content ?? '',
                            ...boardInput,
                            youtubeUrl: youtubeUrl,
                            boardAddress: {
                                zipcode: zoneCode,
                                address: address,
                                addressDetail: detailAddress,
                            },
                            images: resultImgUrl,
                        },
                    },
                    refetchQueries: [
                        {
                            query: FetchBoardsDocument,
                            variables: {
                                page: 1,
                                search: search ?? '',
                                dateStart: dateStart ?? null,
                                dateEnd: dateEnd ?? null,
                            },
                        },
                    ],
                });
                // console.log(result);

                // 입력 다 됐을 때 버튼 활성화시키기
                if (boardInput && password !== '') {
                    router.replace(`/boards/${result?.data?.createBoard._id}`);
                    message.success('게시글이 등록되었습니다.');
                }
                return;
            } catch (error) {
                // console.error(error);
                message.error((error as Error).message);
            }
        } else {
            // ************************** 수정하기 **************************
            // 수정하기 페이지일 때
            try {
                // 제목, 내용 입력값 없으면 에러 메시지 띄우기
                if (boardInput.title === '' && boardInput.contents === '') {
                    setErrorTitle('필수입력사항입니다.');
                    setErrorContent('필수입력사항입니다.');
                    setIsActive(true);
                    return; // 값이 입력되지 않으면 아래 코드 실행시키지 않기
                }
                // 제목 입력값 없으면 에러 메시지 띄우기
                if (boardInput.title === '') {
                    setErrorTitle('필수입력사항입니다.');
                    return;
                }
                // 내용 입력값 없으면 에러 메시지 띄우기
                if (boardInput.contents === '') {
                    setErrorContent('필수입력사항입니다.');
                    return;
                }

                setIsModalOpen(true);
            } catch (error) {
                const err = error as ApolloError;
                // error.graphQLErrors는 배열이고 에러가 하나라도 있는지 확인하기 위해 .length 사용
                if (err.graphQLErrors?.length > 0) {
                    // 서버에서 "비밀번호가 일치하지 않습니다" 같은 메시지를 반환해줌
                    message.error(err.graphQLErrors[0].message);
                } else {
                    message.error('네트워크 오류가 발생했습니다.');
                }
            }
        }
    };

    // 모달 비밀번호 받기
    const [boardPw, setBoardPw] = useState('');

    // 비밀번호 모달창
    const onConfirmPassword = async () => {
        try {
            // 바뀐 값만 넣기 위한 객체
            const updateInput: IUpdateInput = {
                // 주소는 중첩객체니까 객체 하나 더 만들기
                boardAddress: {
                    zipcode: '',
                    address: '',
                    addressDetail: '',
                },
            };

            if (boardInput.title) {
                updateInput.title = boardInput.title;
            }
            if (boardInput.contents) {
                updateInput.contents = boardInput.contents;
            }
            if (zoneCode) {
                updateInput.boardAddress.zipcode = zoneCode;
            }
            if (address) {
                updateInput.boardAddress.address = address;
            }
            if (detailAddress) {
                updateInput.boardAddress.addressDetail = detailAddress;
            }

            updateInput.youtubeUrl = youtubeUrl;

            // 새 이미지 추가하면 url 받아서 업로드시키기
            const resultImgUrl = await Promise.all(
                files.map(async (el, index) => {
                    if (!el) return imgUrl[index]; // 새로 추가한 이미지 없으면, 기존 이미지 유지

                    const result = await uploadFile({
                        variables: { file: el },
                    });

                    return result.data.uploadFile.url;
                }),
            );
            if (imgUrl) {
                updateInput.images = resultImgUrl;
            }

            const result = await updateBoard({
                variables: {
                    boardId: String(params.boardId),
                    password: boardPw,
                    updateBoardInput: updateInput,
                },
                refetchQueries: [
                    { query: FetchBoardDocument, variables: { boardId: params.boardId } },
                ],
            });
            // console.log(result);

            message.success('게시글이 수정되었습니다.');
            router.replace(`/boards/${result?.data?.updateBoard._id}`);
        } catch (error) {
            const err = error as ApolloError;
            if (err.graphQLErrors?.length > 0) {
                message.error(err.graphQLErrors[0].message);
            } else {
                message.error('네트워크 오류가 발생했습니다.');
            }
        }
    };

    return {
        data,
        password,
        errorName,
        errorPassword,
        errorTitle,
        errorContent,
        isActive,
        onChangePassword,
        boardInput,
        onChangeInput,
        onClickSubmit,
        modalAddress,
        addressToggle,
        modalAddressComplete,
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
        setBoardPw,
        boardPw,
        onConfirmPassword,
    };
}
