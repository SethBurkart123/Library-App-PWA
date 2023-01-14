import PocketBase from 'pocketbase';
import { ChevronRightIcon } from '@heroicons/react/20/solid'
import { useEffect, useState } from 'react';
import { UserIcon } from '@heroicons/react/24/outline';

import global from '../../globalVars';
import Layout from '../../components/layout';

export default function Settings() {
  const client = new PocketBase(global.pocketbaseUrl);
  const [editUsername, setEditUsername] = useState(false);
  const [editEmail, setEditEmail] = useState(false);
  const [editPassword, setEditPassword] = useState(false);
  const [editSubscription, setEditSubscription] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [datePaid, setDatePaid] = useState(0)
  const [passwordMatch, setPasswordMatch] = useState(false);
  const [wrongPassword, setWrongPassword] = useState(false);
  const [totalCost, setTotalCost] = useState(0);

  

  const getUserData = async () => {
    try {
      if (!client.authStore.isValid) {
        window.location.href = '/signin';
      }
      const record = await client.collection('users').getOne(client.authStore.model.id, {});
      if (!record.createdSubscription) {
        window.location.href = '/setup';
      }
      setName(record.username);
      setEmail(record.email);
      setDatePaid(30 - ((Date.now() / 1000) - record.datePaid) / (60 * 60 * 24));
      setTotalCost(record.monthlySubCost/100000);
    } catch {}
  }

  async function getCustomerPortalURL() {
    await client.collection('users').update(client.authStore.model.id, {"updateCustomerPortalURL": true});
    const response = await fetch(`${global.pocketbaseUrl}/api/updateCustomerPortalURL`);
    const record = await client.collection('users').getOne(client.authStore.model.id, {});
    return record.customerPortalURL;
  }

  function resetPasswordVars() {
    setEditPassword(false);
    setPassword("");
    setNewPassword("");
    setNewPasswordConfirm("");
    setPasswordMatch(false);
    setWrongPassword(false);
  }

  const submitPassword = async () => {
    if (passwordMatch) {
      console.log("Passwords do not match!")
      return "Passwords do not match";
    }
    console.log("SUbmitting");
    try {
      // example update data
      const data = {
        "password": newPassword,
        "passwordConfirm": newPasswordConfirm,
        "oldPassword": password
      };


      const record = await client.collection('users').update(client.authStore.model.id, data);

      // Relogin
      if (email && newPassword) {
        loginWithEmail(email, newPassword);
      }
    } catch (err) {
      console.log(err)
      setWrongPassword(true);
    }
  }

  async function loginWithEmail(email, password) {
    try {
      const authData = await client.collection('users').authWithPassword(email, password);
      resetPasswordVars();
    } catch {
      setLoginError(true);
    }
  }

  const submitUsername = async () => {
    try {
      //update username data
      const data = {
        "username": name
      };

      //
      const record = await client.collection('users').update(client.authStore.model.id, data);
    } catch {}
  }

  const CancelSubscription = async () => {
    const record = await client.collection('users').update( client.authStore.model.id, {subCancelIntent: true} );
    const response = await fetch(`${global.pocketbaseUrl}/api/cancelSubscription`);
  }


  useEffect(() => {
    getUserData();
  }, [])
  return(
    <Layout topbar={
      <h1 className='flex flex-1 gap-2 px-4 pt-2 pb-2 text-2xl font-bold text-white border-b-2 border-b-white/20 inner-shadow-main bg-black/40 backdrop-blur-md'>
        <UserIcon className='h-6 my-auto' />
        Settings
      </h1>
    }>
    <div className="px-4">
      <div className="flex mb-8">
        <p className="flex-1 text-lg font-medium text-gray-200/70">{editUsername ? <>Edit Name</> : <>Name<a onClick={() => setEditUsername(true)} className='pl-2 font-light cursor-pointer text-white/70'>(edit)</a></>}</p>
        {editUsername ?
        <div className="flex-1">
          <input placeholder='Username' autoComplete='username' type="text" className="input-text" value={name} onChange={(e) => setName(e.target.value)} />
          <div className="flex gap-4 pt-4">
            <a onClick={() => {setEditUsername(false)}} className="ml-auto cursor-pointer secondary-button">Cancel</a>
            <button type="submit" onClick={() => {setEditUsername(false), submitUsername()}} className="mr-0 primary-button bg-green-500/20">Submit</button>
          </div>
        </div> :
        <p className="flex-1 mt-1 text-lg text-white sm:col-span-2 sm:mt-0">{name}</p>
        }
      </div>
      <div className="flex mb-8">
        <p className="flex-1 text-lg font-medium text-gray-200/70">Email</p>
        {editEmail ?
        <div className="flex-1">
          <input placeholder='Email' autoComplete='Email' type="text" className="input-text" value={email} onChange={(e) => setEmail(e.target.value)} />
          <div className="flex gap-4 pt-4">
            <a onClick={() => {setEditEmail(false)}} className="ml-auto cursor-pointer secondary-button">Cancel</a>
            <button type="submit" onClick={() => {setEditEmail(false), submitEmail()}} className="mr-0 primary-button bg-green-500/20">Submit</button>
          </div>
        </div> :
        <p className="flex-1 mt-1 text-lg text-white sm:col-span-2 sm:mt-0">{email}</p>
        }
      </div>
      <div className="flex mb-8">
        <p className="flex-1 text-lg font-medium text-gray-200/70">{editPassword ? <>Change Password</> : <>Password<a onClick={() => setEditPassword(true)} className='pl-2 font-light cursor-pointer text-white/70'>(change)</a></>}</p>
        {editPassword ?
        <div className="flex flex-col flex-1 gap-2">
          {wrongPassword ?
          <div className="relative px-4 py-3 mt-5 mb-2 text-red-700 bg-red-100 border border-red-600 rounded" role="alert">
          <span className="block sm:inline">The password is not correct.</span>
          </div>
          : <></>}
          <form className="flex flex-col gap-2" onSubmit={() => {event.preventDefault(), submitPassword()}}>
            <input autoComplete='email' type="email" className="hidden" placeholder='Email' />
            <input autoComplete='current-password' type="password" className="input-text" placeholder='Old password' value={password} onChange={(e) => {setPassword(e.target.value), setWrongPassword(false)}} />
            <input autoComplete='new-password' type="password" className="input-text" placeholder='New password' value={newPassword} onChange={(e) => {setNewPassword(e.target.value); if (newPasswordConfirm !== e.target.value) {setPasswordMatch(true)} else {setPasswordMatch(false)}}} />
            {passwordMatch ?
              <div className="relative px-4 py-3 mt-5 mb-2 text-red-700 bg-red-100 border border-red-400 rounded" role="alert">The passwords do not match</div>
            : <></>}
            <input autoComplete='new-password' type="password" className="input-text" placeholder='Confirm new password' value={newPasswordConfirm} onChange={(e) => {setNewPasswordConfirm(e.target.value), setPasswordMatch(false); if (e.target.value !== newPassword) {setPasswordMatch(true)} else {setPasswordMatch(false)}}} />
            <div className="flex gap-4 pt-4">
              <a onClick={() => {setEditPassword(false), resetPasswordVars()}} className="ml-auto cursor-pointer secondary-button">Cancel</a>
              <button type='submit' className="mr-0 primary-button bg-green-500/20">Submit</button>
            </div>
          </form>
        </div>
        :
        <p className="flex-1 mt-1 text-lg text-white sm:col-span-2 sm:mt-0">*********</p>
      }
      </div>
      <div className="flex mb-8">
        <p className="flex-1 text-lg font-medium text-gray-200/70">Subscription <a onClick={() => setEditSubscription(!editSubscription)} className='pl-2 font-light cursor-pointer text-white/70'>(manage)</a></p>
        {editSubscription ? 
        <div className="flex-1">
          {datePaid > 0 ?
          <a className='flex flex-col w-full gap-2 px-4 py-2 pb-6 my-2 cursor-pointer rounded-xl bg-black/40'>
            <h3 className='text-xl font-bold'>Free trial!</h3>
            <p>{datePaid.toFixed(0)} days remaining</p>
            <button className="block w-full px-6 py-3 font-medium text-center text-black bg-white border border-transparent rounded-full fancy" onClick={() => CancelSubscription().then(() => window.location.href = 'http://192.168.0.55:3000/pricing')}>Cancel Now</button>
          </a>
          :
          <a onClick={() => {console.log(getCustomerPortalURL().then((URL) => window.location.href = URL))}} className="flex gap-4 px-4 py-2 my-2 rounded-lg cursor-pointer bg-black/40 w-fit">
            <div>
              <p className="text-lg text-white">Subscription Cost</p>
              <p className="text-sm text-gray-400">Open in Stripe</p>
            </div>
            <div className="text-right">
              <p className="text-lg text-green-500">${totalCost.toFixed(2)}</p>
            </div>
            
            <ChevronRightIcon className="w-12 my-auto text-white" />
          </a>
          }
        </div>
        : 
        <>
        {datePaid > 0 ?
        <p className="flex flex-col flex-1 mt-1 text-lg text-white sm:col-span-2 sm:mt-0">Free Trial! <span className="italic text-gray-300 text-md">{datePaid.toFixed(0)} days remaining</span></p>
        :
        <p className="flex-1 mt-1 text-lg sm:col-span-2 sm:mt-0">${totalCost.toFixed(2)}</p>
      }
      </>
}
      </div>
    </div>
    <div className="flex items-center my-auto">
      <a onClick={() => {client.authStore.clear(), window.location.href = '/signin' }} className='warning-button'>Sign Out</a>
    </div>
    </Layout>
  )
}