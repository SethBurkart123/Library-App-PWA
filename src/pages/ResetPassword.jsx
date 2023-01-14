import { React, useState, useEffect } from 'react';
import Pocketbase from 'pocketbase';
import global from '../globalVars';
import background from '../images/background.webp';

function ResetPassword() {
  //setup variables
  const client = new Pocketbase(global.pocketbaseUrl);
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (client.authStore.isValid) {
      window.location.href = '/';
    }
  }, [])


  const handleChange = (event) => {setEmail(event.target.value)} //on email change
  const handleSubmit = async () => {
    //request password reset
    await client.collection('users').requestPasswordReset(email.toLowerCase()).then(window.location.href = '/signin');
  }

  return (
    <>
    <img src={background} alt="background" className="absolute object-cover min-h-screen translate-y-1/2 fade-in bottom-1/2" />
    <div className="flex justify-center items-center h-screen z-10 bg-[#0F252B] inner-shadow-main" style={{boxShadow: "inset 0px 0px 200px 17px rgba(0,0,0,0.7)"}}>
      <div className="p-6 backdrop-blur-3xl bg-white/60 rounded-2xl" style={{boxShadow: "inset 0px 0px 50px -2px rgba(255,255,255,.7),0px 12px 100px 22px rgba(0,0,0,1)"}}>

        {/* Page header */}
        <div className="max-w-3xl px-8 pb-4 mx-auto text-center">
          <h1 className="text-2xl font-semibold text-black md:text-3xl fancy">Forgot Password?</h1>
          <p className="max-w-xs mt-2 italic text-gray-700">Enter your email address and we'll send you a link to reset your password.</p>
                       
        </div>


        {/* Form */}
        <div className="max-w-sm mx-auto">
          {/* Email Input */}
          <div className="flex flex-wrap mb-4 -mx-3">
            <div className="w-full px-3">
              <label className="block mb-1 text-sm font-medium text-gray-800" htmlFor="email">Email</label>
              <input value={email} onChange={handleChange} name="email" id="email" type="email" className="w-full p-3 text-gray-800 rounded-lg focus:border-none focus:outline-none border-hidden" placeholder="Enter your email address" required />
            </div>
          </div>

          {/* Password Reset Button */}
          <div className="flex flex-wrap mt-6 -mx-3">
            <div className="w-full px-3">
              <button type="submit" onClick={handleSubmit} className="btn fancy rounded-full hover:bg-[#374635] w-full text-white bg-[#465943] shadow-black/20 shadow-xl">Send Reset Link</button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 mt-6">
          <div className="w-4/12 border-t-2 border-white" aria-hidden="true"></div>
          <div className="italic text-gray-900">Or</div>
          <div className="w-4/12 border-t-2 border-white" aria-hidden="true"></div>
        </div>

        <div className="flex flex-col mt-4 text-center text-gray-900">
          <p>Remembered your password? <a href="/signin" className="hover:underline text-[#465943] transition duration-150 ease-in-out">Login</a></p>
        </div>
      </div>

    </div>
  </>
  );
}

export default ResetPassword;