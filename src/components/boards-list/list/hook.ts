import { useMutation } from '@apollo/client';
import { useRouter, useSearchParams } from 'next/navigation';
import { DeleteBoardDocument } from '@/commons/graphql/graphql';
import { IBoardList } from './type';
// import { useEffect } from 'react';

export default function useBoardList({ refetch }: IBoardList) {
    const searchParams = useSearchParams();

    // 게시글 디테일로 페이지 이동
    const router = useRouter();
    const onClickDetail = (id: string) => {
        router.push(`/boards/${id}?${searchParams.toString()}`);
    };

    // 게시글 삭제
    const [deleteBoard] = useMutation(DeleteBoardDocument);
    const onClickDelete = async (event: React.MouseEvent<HTMLDivElement>, id: string) => {
        event.stopPropagation();

        // 클릭하면 서버에 요청한 후 결과 받아오기
        const result = await deleteBoard({
            variables: {
                boardId: id,
            },
            // refetchQueries: [{ query: FetchBoardsDocument }],
            //  ㄴ> variables를 안 넣어서 제대로 리패치 되지 않음, FetchBoards useQuery의 refetch함수를 props로 내려받아서 사용해주면 됨
        });
        console.log(result);
        refetch();
    };

    return {
        deleteBoard,
        onClickDetail,
        onClickDelete,
    };
}
