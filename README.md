# 고양이 쇼핑몰 포트폴리오

## 프로젝트 개요
고양이 쇼핑몰을 주제로 한 개인 포트폴리오 웹사이트입니다. 로그인 후 방문자와 소통할 수 있는 게시판 기능을 제공합니다.

## 기술 스택
- **Frontend**: HTML, CSS, JavaScript (바닐라)
- **Backend**: Supabase
- **배포**: Vercel
- **버전관리**: Git/GitHub

## 프로젝트 구조
```
my-portfolio/
├── .gitignore
├── .env.template
├── README.md
├── css/
├── js/
│   └── supabase-client.js
├── images/
└── assets/
```

## 설정 방법

### 1. Supabase 설정
1. [Supabase](https://supabase.com)에서 프로젝트 생성
2. 프로젝트 URL과 anon key 복사
3. `.env.template` 파일을 `.env`로 복사
4. `.env` 파일에 Supabase 정보 입력

### 2. 로컬 실행
```bash
# 간단한 HTTP 서버 실행 (Python)
python -m http.server 8000

# 또는 Node.js를 사용하는 경우
npx serve
```

브라우저에서 `http://localhost:8000` 접속

## 주요 기능
- 고양이 쇼핑몰 UI/UX
- 사용자 인증 (로그인/회원가입)
- 게시판 (CRUD)
- 방문자 소통 기능

## 배포
Vercel을 통해 배포됩니다.

## 라이선스
MIT License
