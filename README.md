# Whale Dashboard

Notion API와 연동하여 작업을 관리하는 대시보드 애플리케이션입니다.

## 주요 기능

- Notion 데이터베이스의 작업 목록 조회 및 표시
- 담당자별, 상태별 필터링
- 작업 제목 및 상태 수정
- 작업 상세 페이지에서 마크다운 콘텐츠 편집
- 다크/라이트 테마 지원

## 기술 스택

- **Framework**: Next.js 16 (App Router)
- **React**: 19.2 with React Compiler
- **Styling**: Tailwind CSS 4
- **Markdown**: @uiw/react-md-editor

## 시작하기

### 환경 변수 설정

`.env.local` 파일을 생성하고 다음 환경 변수를 설정합니다:

```
NOTION_API_KEY=<your-notion-integration-token>
NOTION_DATABASE_ID=<your-database-id>
```

### 설치 및 실행

```bash
# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm dev
```

[http://localhost:3000](http://localhost:3000)에서 애플리케이션을 확인할 수 있습니다.

## 스크립트

```bash
pnpm dev      # 개발 서버 실행
pnpm build    # 프로덕션 빌드
pnpm start    # 프로덕션 서버 실행
pnpm lint     # ESLint 실행
```

## Notion 데이터베이스 설정

다음 속성을 가진 Notion 데이터베이스가 필요합니다:

| 속성명 | 타입 | 설명 |
|--------|------|------|
| Task | Title | 작업 제목 |
| Status | Select | 작업 상태 |
| Assignee | Multi-select / People | 담당자 |
| 1Depth | Select | 1차 분류 (선택) |
| 2Depth | Select | 2차 분류 (선택) |

## 배포

Vercel에서 손쉽게 배포할 수 있습니다:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new?utm_medium=default-template&filter=next.js)
