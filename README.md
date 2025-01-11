# GreenMate

GreenMate는 환경 운동가들을 위한 모임 독려 및 커뮤니티 플랫폼입니다. 이 프로젝트는 환경 보호에 관심 있는 사람들이 쉽게 모임을 만들고 참여할 수 있도록 돕는 것을 목표로 합니다.

## 주요 기능

1. 팀 모집
   - 환경 보호 활동을 위한 팀원 모집 글 작성
   - 지도를 통한 활동 영역 설정 (원형 또는 다각형)
   - 모집 글 목록 조회 및 상세 보기

2. 커뮤니티
   - 환경 보호 활동 관련 게시글 작성 및 공유
   - 이미지 업로드 및 캐러셀 형태의 이미지 표시
   - 좋아요, 댓글 기능

3. 분리수거 학습
   - 다양한 재활용 품목에 대한 정보 제공
   - 품목별 올바른 분리수거 방법 안내

4. 사용자 관리
   - 회원가입 및 로그인 기능
   - 프로필 이미지 업로드

5. 실시간 채팅
   - AI 챗봇을 통한 사용자 지원

## 기술 스택

- Frontend: React, Next.js
- UI 라이브러리: shadcn/ui
- 지도 서비스: Google Maps API
- 상태 관리: React Hooks (useState, useEffect)
- 스타일링: Tailwind CSS
- 아이콘: Lucide React

## 설치 및 실행 방법

1. 저장소 클론
   ```
   git clone https://github.com/your-username/greenmate.git
   cd greenmate
   ```

2. 의존성 설치
   ```
   npm install
   ```

3. 환경 변수 설정
   `.env.local` 파일을 생성하고 다음 변수를 설정합니다:
   ```
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   ```

4. 개발 서버 실행
   ```
   npm run dev
   ```

5. 브라우저에서 `http://localhost:3000` 접속
