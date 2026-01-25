export const imageValidation = (file: File) => {
    // if (!file) return; // file이 undefined면 바로 종료

    if (file?.size > 5 * 1024 * 1024) {
        alert('5MB 이상의 이미지는 업로드할 수 없습니다.');
        return;
    }
    return true;
};
