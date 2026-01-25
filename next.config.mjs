/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        domains: [
            // openapi 고양이 사진 추가 (과제 18) 에러 도메인 추가
            'cdn2.thecatapi.com',
            'cdn3.thecatapi.com',
            '26.media.tumblr.com',
            '27.media.tumblr.com',
            // 외부 이미지 허용 도메인 추가 (과제 20)
            'storage.googleapis.com',
        ],
    },
};

export default nextConfig;
