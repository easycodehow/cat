// Supabase 클라이언트 초기화
const SUPABASE_URL = 'https://dcanjipfggnwumchazqc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRjYW5qaXBmZ2dud3VtY2hhenFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzMjcxODYsImV4cCI6MjA3OTkwMzE4Nn0.-4lPgoxjPW8ywwwg2AP-XhNEnVgCv1eMGD9-thdm-5o';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 현재 로그인된 사용자 정보 가져오기
async function getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
}

// 로그인 상태 확인
async function isLoggedIn() {
    const user = await getCurrentUser();
    return user !== null;
}

// 세션 변경 감지 (로그인/로그아웃 시 자동 갱신)
supabase.auth.onAuthStateChange((event, session) => {
    console.log('Auth state changed:', event, session);

    // 로그인 상태가 변경되면 헤더 업데이트
    if (typeof updateAuthUI === 'function') {
        updateAuthUI();
    }
});
