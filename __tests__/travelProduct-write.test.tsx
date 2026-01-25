import TravelProductWrite from '@/components/travelProduct-write';
import { ApolloClient, ApolloProvider, HttpLink, InMemoryCache } from '@apollo/client';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useRouter } from 'next/navigation';

jest.mock('next/navigation', () => {
    return {
        useRouter: jest.fn().mockReturnValue({
            push: jest.fn(),
        }),
        useParams: () => ({ productId: 'test-id' }),
    };
});

// jest.mock('next/navigation', () => ({
//     useRouter: () => ({
//         push: jest.fn(),
//     }),
//     useParams: () => ({ productId: 'test-id' }),
// }));

it('여행상품 등록페이지 모킹테스트', async () => {
    // 가짜 api 서버 주소 입력하기
    const client = new ApolloClient({
        link: new HttpLink({
            uri: 'http://mock.com/graphql',
        }),
        cache: new InMemoryCache(),
    });

    // jest가 화면에 그리기
    render(
        <ApolloProvider client={client}>
            <TravelProductWrite></TravelProductWrite>
        </ApolloProvider>
    );

    // 상품명
    fireEvent.change(screen.getByRole('input-name'), { target: { value: '상품명' } });
    // 한 줄 요약
    fireEvent.change(screen.getByRole('input-remarks'), { target: { value: '한줄요약' } });
    // 내용
    // fireEvent.change(screen.getByRole('contents-editor'), { target: { innerHTML: '내용' } });
    // 가격
    fireEvent.change(screen.getByRole('input-price'), { target: { value: 100 } });
    // 태그
    fireEvent.change(screen.getByRole('input-tags'), { target: { value: '태그' } });
    // 우편번호
    fireEvent.change(screen.getByRole('input-zipcode'), { target: { value: '12345' } });
    // 상세주소
    fireEvent.change(screen.getByRole('input-addressDetail'), { target: { value: '상세주소' } });
    // 위도
    fireEvent.change(screen.getByRole('input-lat'), { target: { value: '위도' } });
    // 경도
    fireEvent.change(screen.getByRole('input-lng'), { target: { value: '경도' } });
    // 이미지 업로드
    fireEvent.click(screen.getByRole('image-upload-0'));

    // 파일 준비
    const file = new File(['dummy'], 'test.png', { type: 'image/png' });

    // input 찾기
    const uploadInput = screen
        .getByRole('image-upload-0')
        .closest('div')
        ?.querySelector('input[type="file"]');

    if (!uploadInput) throw new Error('파일 input을 찾을 수 없습니다.');

    // 파일 업로드 트리거
    fireEvent.change(uploadInput, {
        target: { files: [file] },
    });

    // // ⭐ 업로드 후 상태 업데이트 기다림
    // await waitFor(() => {
    //     expect(screen.getByRole('image-delete-0')).toBeInTheDocument();
    // });

    // // 이제 삭제 버튼 생김 → 삭제 클릭 가능
    // fireEvent.click(screen.getByRole('image-delete-0'));

    // 등록하기 버튼
    fireEvent.click(screen.getByRole('button-submit'));

    // 모달 텍스트("완료") 뜰 때까지 기다림 → 모달이 떴다는 증거
    const modalText = await screen.findByText('등록 완료');
    expect(modalText).toBeInTheDocument();

    // OK 버튼 클릭
    const okButton = screen.getByRole('button', { name: 'OK' });
    fireEvent.click(okButton);

    // router.push 호출되었는지 검증
    await waitFor(() => {
        const mockRouter = useRouter();
        expect(mockRouter.push).toHaveBeenCalled();
    });
});
