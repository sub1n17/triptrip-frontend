'use client';

import { FETCH_BOARD } from '@/components/boards-detail/detail/queries';
import BoardWritePage from '@/components/boards-write';
import { useQuery } from '@apollo/client';
import { useParams } from 'next/navigation';

// 수정화면에서 입력값 보여주기
// const FETCH_BOARD = gql`
//     query ($boardId: ID!) {
//         fetchBoard(boardId: $boardId) {
//             writer
//             title
//             contents
//         }
//     }
// `;

export default function BoardEditPage() {
    // 비밀번호를 입력받기
    // const boardPw = prompt("글을 입력할때 입력하셨던 비밀번호를 입력해주세요")
    // 입력받은 비밀번호를 updateBoard 할때 variables에 넣어서 전송해주세요.

    // 수정할 때 입력값 받아오기 위해 게시판아이디 가져오기
    const params = useParams();

    // 수정화면에서 작성자, 비번, 제목, 내용 보여주기
    const { data } = useQuery(FETCH_BOARD, {
        variables: {
            boardId: params.boardId,
        },
    });
    // console.log(data);

    return (
        <>
            <BoardWritePage isEdit={true} data={data}></BoardWritePage>
        </>
    );
}
