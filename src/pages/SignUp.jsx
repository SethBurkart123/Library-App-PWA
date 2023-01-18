import React, { useState, useEffect } from 'react';
import PocketBase from 'pocketbase';
import { global } from '../globalVars';
import background from '../images/background.webp';
import Rive from '@rive-app/react-canvas';
import InstallPrompt from '../components/installPrompt'

function SignUp() {
  const client = new PocketBase(global.pocketbaseDomain);

  //setup variables
  const [submitted, setSubmitted] = React.useState(false);

  const [values, setValues] = React.useState({
    username: '',
    email: '',
    emailVisibility: true,
    password: '',
    passwordConfirm: ''
  });

  useEffect(() => {
    if (client.authStore.isValid) {
      window.location.href = '/';
    }
  })
  
  let passwordMatchWarn = false;
  const [errMessage, setErrMessage] = useState({
    username: '',
    email: '',
    password: '',
    passwordConfirm: ''
  });

  async function requestSignup (values) {
    //set a blank error message, 
    //fill with error messages on error
    setErrMessage({
      username: '',
      email: '',
      password: '',
      passwordConfirm: ''
    });

    
    try {
      //setup user
      const record = await client.collection('users').create({
        username: values.username,
        email: values.email.toLowerCase(),
        password: values.password,
        passwordConfirm: values.passwordConfirm
      });
      loginWithEmail(values.email.toLowerCase(), values.password);
    } catch(err) { 
      //on error, show error
      if (err.data.data.username) { //username error
        setErrMessage(prevState => ({
          ...prevState,
          ["username"]: err.data.data.username.message
        }));
      }
      if (err.data.data.email) { //email error
        setErrMessage(prevState => ({
          ...prevState,
          ["email"]: err.data.data.email.message
        }));
      }
      if (err.data.data.password) { //password error
        setErrMessage(prevState => ({
          ...prevState,
          ["password"]: err.data.data.password.message
        }));
      }
      setSubmitted(false)
    }

    //user account has been created
    try {
      //request verification email
      const authE = await client.collection('users').requestVerification(values.email);
    } catch(err) {
      //console.log(err);
    }
  }

  const handleChange = (event) => {
    if (!(values.password === event.target.value) && event.target.id == "passwordConfirm") {
      errMessage.passwordConfirm = 'The passwords do not match.';
    } else {
      errMessage.passwordConfirm = '';
    }
  };
  
  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
  
    let passwordConfirmed = false;
    if (values.password == values.passwordConfirm) {
      passwordConfirmed = true;
    } else {
      errMessage.passwordConfirm = 'The passwords do not match.';
      setSubmitted(false);
    }
    if (values.username && values.email && values.password && passwordConfirmed) {
      requestSignup(values);
    }
  };

  async function loginWithEmail(email, password) {
    try {
      const authData = await client.collection('users').authWithPassword(email, password);

      const searchParams = new URLSearchParams(window.location.search);
      const paymentPlan = searchParams.get('paymentPlan');

      if (paymentPlan) {
        window.location.href = `payment-redirect?paymentPlan=${paymentPlan}`
      } else {
        window.location.href = global.homepageDomain+'/pricing'; //redirect to pricing page
      }
    } catch(err) {
      setLoginError(true);
      setSubmitted(false);
      //console.log(err);
    }
  }
  

  return (
  <div className="w-screen h-screen overflow-hidden">
    <InstallPrompt />
    <img src={background} alt="background" className="bottom-1/2 absolute object-cover w-screen h-screen translate-y-1/2" />
    <div className="flex flex-col justify-center items-center h-screen z-10 bg-[#0F252B] overflow-y-scroll touch pb-32 inner-shadow-main" style={{boxShadow: "inset 0px 0px 200px 17px rgba(0,0,0,0.7)"}}>
      <p className="pb-16 text-transparent">aGHHH!!! </p>
      <div className="backdrop-blur-3xl bg-white/60 rounded-2xl p-6" style={{boxShadow: "inset 0px 0px 50px -2px rgba(255,255,255,.7),0px 12px 100px 22px rgba(0,0,0,1)"}}>

        {/* Page header */}
        <div className="max-w-3xl px-20 pb-4 mx-auto text-center">
          <h1 className="fancy text-3xl font-semibold text-black">Welcome.</h1>
        </div>

        {/* Form */}
        <div className="max-w-sm mx-auto">
          <form onSubmit={handleSubmit}>


            {/* Username Error Message */}
            {errMessage.username ?
            <div className="relative px-4 py-3 mb-2 text-red-700 bg-red-100 border border-red-400 rounded-lg" role="alert">
              <span className="sm:inline block">{errMessage.username}</span>
            </div> : null
            }

            {/* Username Input */}
            <div className="flex flex-wrap mb-4 -mx-3">
              <div className="w-full px-3">
                <label className="block mb-1 text-sm font-medium text-gray-800" htmlFor="name">Name</label>
                <input value={values.username} onChange={() => {handleChange, setValues({ ...values, username: event.target.value })}} autoComplete="off" name="name" id="name" type="name" className="focus:border-none focus:outline-none border-hidden w-full p-3 text-gray-800 rounded-lg" placeholder="Enter your name" required />
              </div>
            </div>

            {/* Email Error Message */}
            {errMessage.email ?
            <div className="relative px-4 py-3 mb-2 text-red-700 bg-red-100 border border-red-400 rounded-lg" role="alert">
              <span className="sm:inline block">{errMessage.email}</span>
            </div> : null
            }


            {/* Email Input */}
            <div className="flex flex-wrap mb-4 -mx-3">
              <div className="w-full px-3">
                <label className="block mb-1 text-sm font-medium text-gray-800" htmlFor="email">Email</label>
                <input value={values.email} onChange={() => {handleChange, setValues({ ...values, email: event.target.value })}} name="username" type="username" className="focus:border-none focus:outline-none border-hidden w-full p-3 text-gray-800 rounded-lg" placeholder="Enter your email" required />
              </div>
            </div>


            {/* Password */}
            <div className="flex flex-wrap mb-4 -mx-3">
              {/* Password Error Message */}
              <div className="w-full px-3">
                {errMessage.password ?
                  <div className="relative px-4 py-3 mb-2 text-red-700 bg-red-100 border border-red-400 rounded-lg" role="alert">
                  <span className="sm:inline block">{errMessage.password}</span>
                  </div> : null
                }
                {/* Password */}
                <label className="block mb-1 text-sm font-medium text-gray-800" htmlFor="password">Password</label>
                <input value={values.password} onChange={() => {handleChange, setValues({ ...values, password: event.target.value })}} type="password" className="focus:border-none focus:outline-none border-hidden w-full p-3 text-gray-800 rounded-lg" placeholder="Enter your password" required />
              </div>
            </div>
            
            {/* Password Confirm */}
            <div className="flex flex-wrap mb-4 -mx-3">
              {/* Password Error Message */}
              <div className="w-full px-3">
                {errMessage.passwordConfirm ?
                  <div className="relative px-4 py-3 mb-2 text-red-700 bg-red-100 border border-red-400 rounded-lg" role="alert">
                  <span className="sm:inline block">{errMessage.passwordConfirm}</span>
                  </div> : null
                }
                {/* Password Input */}
                <label className="block mb-1 text-sm font-medium text-gray-800" htmlFor="password">Confirm Password</label>
                <input value={values.passwordConfirm} onChange={() => {handleChange, setValues({ ...values, passwordConfirm: event.target.value })}} type="password" className="focus:border-none focus:outline-none border-hidden w-full p-3 text-gray-800 rounded-lg" placeholder="Enter your password" required />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex flex-wrap mt-6 -mx-3">
              <div className="w-full px-3">
                {submitted ?
                <button disabled className="btn fancy rounded-full w-full text-black bg-[#465943] shadow-black/20 shadow-xl">
                  <Rive className='rive-loader relative top-0' src="/animations/loader.riv" />
                </button>
                :
                <button type="submit" className="btn fancy rounded-full hover:bg-[#374635] w-full text-white bg-[#465943] shadow-black/20 shadow-xl">Sign up</button>
                }
              </div>
            </div>
          </form>

          <div className="flex items-center justify-center gap-4 mt-6">
            <div className="w-4/12 border-t-2 border-white" aria-hidden="true"></div>
            <div className="italic text-gray-900">Or</div>
            <div className="w-4/12 border-t-2 border-white" aria-hidden="true"></div>
          </div>

          <div className="mt-4 text-center text-gray-900">
            Already a customer? <a href="/signin" className="hover:underline text-[#465943] transition duration-150 ease-in-out">Login</a>
          </div>
        </div>

      </div>
    </div>
  </div>
  );
}

export default SignUp;