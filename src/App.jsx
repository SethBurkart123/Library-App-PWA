import React, { useEffect } from 'react';
import {
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';
import './css/style.css';


import Search from './pages/app/Search';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Settings from './pages/app/settings';
import ResetPassword from './pages/ResetPassword';
import PageNotFound from './pages/PageNotFound';
import CreateBook from './pages/app/create/book';
import PaymentRedirect from './pages/PaymentRedirect';
import pwaInstallHandler from 'pwa-install-handler';

function App() {
  const location = useLocation();

  useEffect(() => {
    pwaInstallHandler.install()
    document.querySelector('html').style.scrollBehavior = 'auto'
    window.scroll({ top: 0 })
    document.querySelector('html').style.scrollBehavior = ''
  }, []); // triggered on route change
  
  return (
    <>
      <Routes>
        <Route exact path="/settings" element={<Settings />} />
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
