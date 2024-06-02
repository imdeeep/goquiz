import React from 'react';
import { useAuth } from '../context/authContext';
import { useRouter } from 'next/router';
import Loader from './Loader';

const PrivateRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    const router = useRouter();

    React.useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, loading, router]);

    if (loading) {
        return <Loader/>; 
    }

    if (!isAuthenticated) {
        return null;
    }

    return <>{children}</>
};

export default PrivateRoute;