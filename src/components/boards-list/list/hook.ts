import { useMutation } from '@apollo/client';
import { useRouter, useSearchParams } from 'next/navigation';
import { DeleteBoardDocument } from '@/commons/graphql/graphql';
import { IBoardList } from './type';

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
        await deleteBoard({
            variables: {
                boardId: id,
            },
        });
        refetch();
    };

    return {
        deleteBoard,
        onClickDetail,
        onClickDelete,
    };
}
