import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import global from '../globalVars';
import background from '../images/background.webp';
import InstallPrompt from '../components/installPrompt'

import PocketBase from 'pocketbase';

function SignIn() {
  const client = new PocketBase(global.pocketbaseDomain);

  useEffect(() => {
    if (client.authStore.isValid) {
      window.location.href = '/';
    }
  }, [])

  //setup variables
  const [loginError, setLoginError] = useState(false);

  const [values, setValues] = React.useState({
    email: '',
    password: '',
  });
  const [submitted, setSubmitted] = React.useState(false);

  const handleChange = (event) => {
    setValues({ ...values, [event.target.id]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
    if (values.email && values.password) {
      loginWithEmail(values.email.toLowerCase(), values.password);
    }
  };

  
  async function loginWithEmail(email, password) {
    try {
      const authData = await client.collection('users').authWithPassword(email, password);
        window.location.href = '/'; //redirect to search page
    } catch(err) {
      setLoginError(true);
      console.log(err);
    }
  }


  return (
  <div className="w-screen h-screen overflow-hidden">
    <InstallPrompt />
    <img src={background} alt="background" className="absolute object-cover w-screen h-screen translate-y-1/2 bottom-1/2" />
    <div className="flex justify-center items-center h-screen z-10 bg-[#0F252B] inner-shadow-main overflow-y-scroll touch" style={{boxShadow: "inset 0px 0px 200px 17px rgba(0,0,0,0.7)"}}>
      <div className="p-6 backdrop-blur-3xl bg-white/60 rounded-2xl" style={{boxShadow: "inset 0px 0px 50px -2px rgba(255,255,255,.7),0px 12px 100px 22px rgba(0,0,0,1)"}}>

        {/* Page header */}
        <div className="max-w-3xl px-8 pb-4 mx-auto text-center">
          <h1 className="text-3xl font-semibold text-black fancy">Welcome back.</h1>
        </div>

        {/* Form */}
        <div className="max-w-sm mx-auto">

          {/* Login Error Message */}
          <form onSubmit={handleSubmit}>
            {loginError ?
              <div className="relative px-4 py-3 mt-5 mb-2 text-red-700 bg-red-100 border border-red-600 rounded" role="alert">
              <span className="block sm:inline">The email or password was incorrect.</span>
              </div> : null
            }

            {/* Email Input */}
            <div className="flex flex-wrap mb-4 -mx-3">
              <div className="w-full px-3">
                <label className="block mb-1 text-sm font-medium text-gray-800" htmlFor="email">Email</label>
                <input value={values.email} onChange={handleChange} name="email" id="email" type="email" className="w-full p-3 text-gray-800 rounded-lg focus:border-none focus:outline-none border-hidden" placeholder="Enter your email address" required />
              </div>
            </div>

            {/* Login Error Message */}
            <div className="flex flex-wrap mb-4 -mx-3">
              <div className="w-full px-3">
                <div className="flex justify-between">
                  <label className="block mb-1 text-sm font-medium text-gray-800" htmlFor="password">Password</label>
                  <Link to="/reset-password" className="hover:underline text-sm font-medium text-[#465943]">Forgot your password?</Link>
                </div>
                {/* Password Input */}
                <input value={values.password} onChange={handleChange} id="password" type="password" name="password" className="w-full p-3 text-gray-800 rounded-lg focus:border-none focus:outline-none border-hidden" placeholder="Enter your password" required />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex flex-wrap mt-6 -mx-3">
              <div className="w-full px-3">
                <button type="submit" className="btn fancy rounded-full hover:bg-[#374635] w-full text-white bg-[#465943] shadow-black/20 shadow-xl">Sign in</button>
              </div>
            </div>
          </form>

          <div className="flex items-center justify-center gap-4 mt-6">
            <div className="w-4/12 border-t-2 border-white" aria-hidden="true"></div>
            <div className="italic text-gray-900">Or</div>
            <div className="w-4/12 border-t-2 border-white" aria-hidden="true"></div>
          </div>

          <div className="mt-4 text-center text-gray-900">
            Are you new? <Link to="/signup" className="hover:underline text-[#465943] transition duration-150 ease-in-out">Register</Link>
          </div>
        </div>

      </div>
    </div>
  </div>
  );
}

export default SignIn;