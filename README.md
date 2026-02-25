# 숙박권 거래 플랫폼 (Web)

여행자 간 숙박권을 거래하고 소통할 수 있는 웹 서비스입니다.
Next.js 기반의 반응형 웹을 제작했으며, 결제 기능과 인증 흐름 설계에 집중한 메인 프로젝트입니다.

## 🔗 Links

- Deploy: https://triptrip-frontend.vercel.app
- GitHub: https://github.com/sub1n17/triptrip-frontend

## 🛠 Tech Stack

- Next.js
- React
- TypeScript
- Zustand
- React Hook Form
- PortOne API
- Kakao Maps API

## 📄 Pages

- **트립토크**  
  자유 게시판, 게시글 작성·조회·댓글 기능

- **숙박권 거래**  
  숙박권 등록·구매, 포인트 결제, 문의 기능

- **마이페이지**  
  활동 내역, 포인트 내역, 비밀번호 변경

## 📌 주요 구현 기능

- refreshToken은 쿠키에 저장하고, accessToken은 Zustand 메모리 상태로 관리하여 로그인 유지 구현
- 토큰 만료 시 자동 로그아웃 및 로그인 페이지 리다이렉션 처리
- PortOne 결제 API 연동을 통한 포인트 충전 및 숙박권 구매 기능 구현
- 더보기 버튼 기반 데이터 추가 로딩 및 게시판 페이지네이션
- LocalStorage를 활용한 최근 본 숙박권 기능
- 로그인 상태에 따른 접근 제어 처리
- 반응형 레이아웃 구현

## 🔥 Trouble Shooting

**비로그인 사용자의 보호 페이지 접근 제어**

- 로그인 여부에 따라 접근 가능한 페이지가 달라 일관된 인증 설계의 어려움
- 전역 인증 체크 로직을 구성하고, 토큰 만료 또는 미보유 시 로그인 페이지로 리다이렉션 처리

**토큰 관리 방식 설계**

- accessToken을 브라우저 저장소에 보관할 경우 XSS 공격에 노출될 가능성 존재
- accessToken은 Zustand 메모리 상태로 관리하고, refreshToken은 쿠키에 저장해 역할을 분리
- 보안성과 로그인 유지 기능을 함께 고려한 토큰 관리 구조 설계
