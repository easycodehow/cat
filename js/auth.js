// 회원가입 함수
async function signUp(email, password) {
    try {
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                emailRedirectTo: window.location.origin,
                data: {
                    email_confirm: false
                }
            }
        });

        if (error) throw error;

        return { success: true, data };
    } catch (error) {
        console.error('Sign up error:', error);
        return { success: false, error: error.message };
    }
}

// 로그인 함수
async function signIn(email, password) {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (error) throw error;

        return { success: true, data };
    } catch (error) {
        console.error('Sign in error:', error);
        return { success: false, error: error.message };
    }
}

// 로그아웃 함수
async function signOut() {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;

        return { success: true };
    } catch (error) {
        console.error('Sign out error:', error);
        return { success: false, error: error.message };
    }
}

// 로그인 체크 및 리다이렉트
async function requireAuth(redirectTo = 'login.html') {
    const user = await getCurrentUser();
    if (!user) {
        // 현재 페이지를 저장하여 로그인 후 돌아올 수 있도록
        sessionStorage.setItem('redirectAfterLogin', window.location.href);
        window.location.href = redirectTo;
        return null;
    }
    return user;
}

// 헤더의 로그인 상태 UI 업데이트
async function updateAuthUI() {
    const user = await getCurrentUser();
    const headerIcons = document.querySelector('.header-icons');

    if (!headerIcons) return;

    // 기존 인증 관련 버튼 제거
    const existingAuthUI = document.querySelector('.auth-ui');
    if (existingAuthUI) {
        existingAuthUI.remove();
    }

    // 새 인증 UI 생성
    const authUI = document.createElement('div');
    authUI.className = 'auth-ui';
    authUI.style.display = 'flex';
    authUI.style.alignItems = 'center';
    authUI.style.gap = '10px';

    if (user) {
        // 로그인된 상태
        authUI.innerHTML = `
            <span class="user-email" style="font-size: 14px; color: #333;">${user.email}</span>
            <button onclick="handleLogout()" class="btn-logout" style="padding: 8px 16px; background: #ff6b6b; color: white; border: none; border-radius: 4px; cursor: pointer;">로그아웃</button>
        `;
    } else {
        // 로그인 안 된 상태 - 아이콘만 표시
        authUI.innerHTML = `
            <a href="login.html" class="icon-btn" title="로그인" style="color: #555; text-decoration: none; display: flex; align-items: center; justify-content: center; padding: 5px; transition: color 0.3s;">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" style="stroke-width: 2;">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                </svg>
            </a>
        `;
    }

    headerIcons.appendChild(authUI);
}

// 로그아웃 처리
async function handleLogout() {
    const result = await signOut();
    if (result.success) {
        window.location.href = 'index.html';
    } else {
        alert('로그아웃 실패: ' + result.error);
    }
}

// 페이지 로드 시 인증 UI 업데이트
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateAuthUI);
} else {
    updateAuthUI();
}
