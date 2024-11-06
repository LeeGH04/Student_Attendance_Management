const PrivateRoute = ({ children }) => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    if (!isLoggedIn) {
        return <Navigate to="/login" />;
    }

    return (
        <div className="app-layout">
            <SideBar />
            <div className="main-content">
                {children}
            </div>
        </div>
    );
};