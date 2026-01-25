declare module 'apollo-upload-client/createUploadLink.mjs';

// 카카오지도
declare global {
    interface Window {
        kakao: any; // ← 필요하다면 여기서 any 유지해도 ESLint 에러 없음
    }
}

export {};
