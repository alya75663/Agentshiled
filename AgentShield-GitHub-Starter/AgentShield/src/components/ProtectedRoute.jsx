import React from 'react'; import {Navigate,Outlet} from 'react-router-dom'; import {useAuth} from '@/lib/AuthContext';
export default function ProtectedRoute(){const {isAuthenticated,isLoadingAuth,isLoadingPublicSettings}=useAuth();if(isLoadingAuth||isLoadingPublicSettings)return <div className="p-10 text-center">Loading…</div>;return isAuthenticated?<Outlet/>:<Navigate to="/login" replace/>;}
