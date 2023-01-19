import React, { Suspense, useEffect, lazy } from 'react';
import {
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';
import './css/style.css';
import { Loading } from './components/Loading';

const Search = lazy(() => import('./pages/app/Search'));
const SignIn = lazy(() => import('./pages/SignIn'));
const SignUp = lazy(() => import('./pages/SignUp'));
const Settings = lazy(() => import('./pages/app/settings'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const PageNotFound = lazy(() => import('./pages/PageNotFound'));
const CreateBook = lazy(() => import('./pages/app/create/book'));
const PaymentRedirect = lazy(() => import('./pages/PaymentRedirect'));

function App() {
  const location = useLocation();

  useEffect(() => {
    document.querySelector('html').style.scrollBehavior = 'auto'
    window.scroll({ top: 0 })
    document.querySelector('html').style.scrollBehavior = ''
  }, [location.pathname]); // triggered on route change
  
  return (
    <>
      <Routes>
        <Route exact path="/settings" element={<Settings  />} />
        <Route exact path="/search" element={<Search />} />
        <Route path="/" element={<Search />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/create" element={<CreateBook />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/payment-redirect" element={<PaymentRedirect />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
}

export default App;
