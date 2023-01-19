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
        <Route exact path="/settings" element={
          <Suspense fallback={<Loading />}>
            <Settings  />
          </Suspense>
        } />
        <Route exact path="/search" element={
        <Suspense fallback={<Loading />}>
          <Search />
        </Suspense>
        } />
        <Route path="/" element={
        <Suspense fallback={<Loading />}>
          <Search />
        </Suspense>
        } />
        <Route path="/signin" element={
        <Suspense fallback={<Loading />}>
          <SignIn />
        </Suspense>
        } />
        <Route path="/signup" element={
        <Suspense fallback={<Loading />}>
          <SignUp />
        </Suspense>
        } />
        <Route path="/create" element={
        <Suspense fallback={<Loading />}>
          <CreateBook />
        </Suspense>
        } />
        <Route path="/reset-password" element={
        <Suspense fallback={<Loading />}>
          <ResetPassword />
        </Suspense>
        } />
        <Route path="/payment-redirect" element={
        <Suspense fallback={<Loading />}>
          <PaymentRedirect />
        </Suspense>
        } />
        <Route path="*" element={
        <Suspense fallback={<Loading />}>
          <PageNotFound />
        </Suspense>
        } />
      </Routes>
    </>
  );
}

export default App;
