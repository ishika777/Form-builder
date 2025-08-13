import { Outlet, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { checkAuthentication } from './actions/user-actions';
import Loading from './components/Loading';

const Layout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isChecking, setIsChecking] = useState(true);
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const { user, isAuthenticated } = await checkAuthentication(dispatch);
            setUser(user);
            setIsAuthenticated(isAuthenticated);

            if (!isAuthenticated || !user) {
                navigate("/auth/login");
                return;
            }

            if (!user.isVerified) {
                navigate("/auth/verify-email");
                return;
            }

            setIsChecking(false);
        };

        fetchData();
    }, [dispatch, navigate]);

    if (isChecking) {
        return <Loading />;
    }

    return (
        <div className='min-w-[100vw] min-h-[100vh] h-[100vh] w-100vw flex justify-between overflow-y-auto overflow-x-hidden'>
            <div className='flex flex-1'>
                <Outlet />
            </div>
        </div>
    );
};

export default Layout;
