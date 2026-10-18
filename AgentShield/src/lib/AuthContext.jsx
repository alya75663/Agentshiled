import React,{createContext,useContext,useEffect,useState} from 'react';
import {base44} from '@/api/base44Client';
import {appParams} from '@/lib/app-params';
const AuthContext=createContext(null);
export function AuthProvider({children}) {
 const [user,setUser]=useState(null),[isAuthenticated,setIsAuthenticated]=useState(false),[isLoadingAuth,setIsLoadingAuth]=useState(true),[isLoadingPublicSettings,setIsLoadingPublicSettings]=useState(true),[authError,setAuthError]=useState(null),[authChecked,setAuthChecked]=useState(false),[appPublicSettings,setAppPublicSettings]=useState(null);
 const checkUserAuth=async()=>{setIsLoadingAuth(true);try{const u=await base44.auth.me();setUser(u);setIsAuthenticated(true);setAuthError(null);}catch(e){setUser(null);setIsAuthenticated(false);if([401,403].includes(e?.status))setAuthError({type:'auth_required',message:'Authentication required'});}finally{setIsLoadingAuth(false);setAuthChecked(true);}};
 const checkAppState=async()=>{setIsLoadingPublicSettings(true);try{const s=await base44.app.getPublicSettings();setAppPublicSettings(s);if(appParams.token)await checkUserAuth();else {setIsAuthenticated(false);setIsLoadingAuth(false);setAuthChecked(true);}}catch(e){setAuthError({type:e?.data?.extra_data?.reason||'unknown',message:'Could not initialize Base44 app'});setIsLoadingAuth(false);}finally{setIsLoadingPublicSettings(false);}};
 useEffect(()=>{checkAppState();},[]);
 const logout=(redirect=true)=>{setUser(null);setIsAuthenticated(false);base44.auth.logout(redirect?window.location.href:undefined);};
 const navigateToLogin=()=>base44.auth.redirectToLogin(window.location.href);
 return <AuthContext.Provider value={{user,isAuthenticated,isLoadingAuth,isLoadingPublicSettings,authError,appPublicSettings,authChecked,logout,navigateToLogin,checkUserAuth,checkAppState}}>{children}</AuthContext.Provider>;
}
export function useAuth(){const v=useContext(AuthContext);if(!v)throw new Error('useAuth must be used within AuthProvider');return v;}
