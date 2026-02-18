'use client';

import { FETCH_BOARD } from '@/components/boards-detail/detail/queries';
import BoardWritePage from '@/components/boards-write';
import { useQuery } from '@apollo/client';
import { useParams } from 'next/navigation';

export default function BoardEditPage() {
    // 수정할 때 입력값 받아오기 위해 게시판아이디 가져오기
    const params = useParams();

    // 수정화면에서 작성자, 비번, 제목, 내용 보여주기
    const { data } = useQuery(FETCH_BOARD, {
        variables: {
            boardId: params.boardId,
        },
    });

    return (
        <>
            <BoardWritePage isEdit={true} data={data}></BoardWritePage>
        </>
    );
}
