// 전역 변수
let allPosts = [];
let currentPage = 1;
const postsPerPage = 10;

// 게시글 목록 조회
async function loadPosts() {
    try {
        const { data: posts, error } = await supabase
            .from('posts')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        allPosts = posts;
        displayPosts(allPosts);
    } catch (error) {
        console.error('Error loading posts:', error);
        document.getElementById('boardTableBody').innerHTML = '<tr><td colspan="5" class="error-message">게시글을 불러오는데 실패했습니다.</td></tr>';
    }
}

// 게시글 목록 화면에 표시 (테이블 형식)
function displayPosts(posts) {
    const tbody = document.getElementById('boardTableBody');

    if (!posts || posts.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="no-posts-message">아직 게시글이 없습니다. 첫 번째 글을 작성해보세요!</td></tr>';
        updatePagination(0);
        return;
    }

    // 페이지네이션 계산
    const totalPages = Math.ceil(posts.length / postsPerPage);
    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    const currentPosts = posts.slice(startIndex, endIndex);

    // 테이블 행 생성
    tbody.innerHTML = currentPosts.map((post, index) => {
        const postNumber = posts.length - startIndex - index;
        const authorId = post.author_email ? post.author_email.split('@')[0] : '-';

        return `
            <tr class="board-row">
                <td class="col-num">${postNumber}</td>
                <td class="col-title">
                    <a href="detail.html?id=${post.id}" class="post-title-link">${escapeHtml(post.title)}</a>
                </td>
                <td class="col-email">${escapeHtml(authorId)}</td>
                <td class="col-date">${formatDateShort(post.created_at)}</td>
                <td class="col-views">0</td>
            </tr>
        `;
    }).join('');

    updatePagination(totalPages);
}

// 페이지네이션 업데이트
function updatePagination(totalPages) {
    const pageInfo = document.getElementById('pageInfo');
    if (pageInfo) {
        pageInfo.textContent = `${currentPage} page / ${totalPages} pages`;
    }
}

// 검색 함수
function searchPosts() {
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput.value.trim().toLowerCase();

    if (!searchTerm) {
        displayPosts(allPosts);
        return;
    }

    const filteredPosts = allPosts.filter(post =>
        post.title.toLowerCase().includes(searchTerm) ||
        post.content.toLowerCase().includes(searchTerm) ||
        (post.author_email && post.author_email.toLowerCase().includes(searchTerm))
    );

    currentPage = 1;
    displayPosts(filteredPosts);
}

// 이전 페이지
function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        displayPosts(allPosts);
    }
}

// 다음 페이지
function nextPage() {
    const totalPages = Math.ceil(allPosts.length / postsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        displayPosts(allPosts);
    }
}

// 게시글 작성
async function createPost(title, content) {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return { success: false, error: '로그인이 필요합니다.' };
        }

        const { data, error } = await supabase
            .from('posts')
            .insert([
                {
                    user_id: user.id,
                    title: title,
                    content: content,
                    author_email: user.email
                }
            ])
            .select();

        if (error) throw error;

        return { success: true, data };
    } catch (error) {
        console.error('Error creating post:', error);
        return { success: false, error: error.message };
    }
}

// 게시글 수정
async function updatePost(postId, title, content) {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return { success: false, error: '로그인이 필요합니다.' };
        }

        const { data, error } = await supabase
            .from('posts')
            .update({
                title: title,
                content: content,
                updated_at: new Date().toISOString()
            })
            .eq('id', postId)
            .eq('user_id', user.id)
            .select();

        if (error) throw error;

        return { success: true, data };
    } catch (error) {
        console.error('Error updating post:', error);
        return { success: false, error: error.message };
    }
}

// 게시글 삭제
async function deletePost(postId) {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return { success: false, error: '로그인이 필요합니다.' };
        }

        const { error } = await supabase
            .from('posts')
            .delete()
            .eq('id', postId)
            .eq('user_id', user.id);

        if (error) throw error;

        return { success: true };
    } catch (error) {
        console.error('Error deleting post:', error);
        return { success: false, error: error.message };
    }
}

// 날짜 포맷팅
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;

    // 1분 미만
    if (diff < 60000) {
        return '방금 전';
    }

    // 1시간 미만
    if (diff < 3600000) {
        return Math.floor(diff / 60000) + '분 전';
    }

    // 24시간 미만
    if (diff < 86400000) {
        return Math.floor(diff / 3600000) + '시간 전';
    }

    // 그 외
    return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// 날짜 포맷팅 (짧은 형식: YYYY-MM-DD)
function formatDateShort(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// HTML 이스케이프 (XSS 방지)
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}
