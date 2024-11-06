import React from 'react';
import SideBar from './SideBar';  // SideBar 컴포넌트를 임포트

const MainPage = () => {
    return (
        <div className="main-page">
            <SideBar />  {/* 사이드바 렌더링 */}
            <div className="content">
                <h1>메인 페이지 콘텐츠</h1>
                {/* 여기에 메인 페이지의 실제 콘텐츠를 추가 */}
            </div>
        </div>
    );
};

export default MainPage;