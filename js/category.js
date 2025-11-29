// 카테고리 탭 전환 기능
function showCategory(category) {
    // 모든 카테고리 그리드 숨기기
    const allGrids = document.querySelectorAll('.category-grid');
    allGrids.forEach(grid => {
        grid.style.display = 'none';
    });

    // 선택된 카테고리 그리드 표시
    const selectedGrid = document.getElementById(`category-${category}`);
    if (selectedGrid) {
        selectedGrid.style.display = 'grid';
    }

    // 모든 탭 버튼에서 active 클래스 제거
    const allTabs = document.querySelectorAll('.tab-btn');
    allTabs.forEach(tab => {
        tab.classList.remove('active');
    });

    // 클릭된 버튼에 active 클래스 추가
    event.target.classList.add('active');
}

// 페이지 로드 시 첫 번째 탭(사료) 표시
document.addEventListener('DOMContentLoaded', () => {
    // 첫 번째 카테고리 그리드만 표시
    const feedGrid = document.getElementById('category-feed');
    if (feedGrid) {
        feedGrid.style.display = 'grid';
    }
});
