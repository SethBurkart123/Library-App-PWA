import PocketBase from 'pocketbase';
import { ChevronRightIcon } from '@heroicons/react/20/solid'
import { useEffect, useState } from 'react';
import { UserIcon } from '@heroicons/react/24/outline';

import { global } from '../../globalVars';
import Layout from '../../components/layout';
import LoaderButton from '../../components/LoaderButton';
import InstallPrompt from '../../components/installPrompt';

export default function Settings() {
  const client = new PocketBase(global.pocketbaseDomain);
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
  const [submitted, setSubmitted] = useState(false);

  

  const getUserData = async () => {
    try {
      if (!client.authStore.isValid) {
        window.location.href = '/signin';
      }
      const record = await client.collection('users').getOne(client.authStore.model.id, {});
      if (!record.createdSubscription) {
        if (!record.hasSub) {
          window.location.href = global.homepageDomain+'/pricing';
        } else {
          window.location.href = '/payment-redirect?paymentPlan='+record.subscriptionPlan;
        }
      }
      setName(record.username);
      setEmail(record.email);
      setDatePaid(30 - ((Date.now() / 1000) - record.datePaid) / (60 * 60 * 24));
      setTotalCost(record.monthlySubCost/100000);
    } catch(error) {
      // logout user
      if (error.toString().toLowerCase().includes('404')) {
        client.authStore.clear();
        window.location.href = '/signin';
      }
    }
  }

  async function getCustomerPortalURL() {
    await client.collection('users').update(client.authStore.model.id, {"updateCustomerPortalURL": true});
    await fetch(`${global.pocketbaseDomain}/api/updateCustomerPortalURL`);
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
    setSubmitted(true);
    if (passwordMatch) {
      //console.log("Passwords do not match!")
      setSubmitted(false);
      return "Passwords do not match";
    }
    //console.log("SUbmitting");
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
        try {
          loginWithEmail(email, newPassword);
        } catch {
          setSubmitted(false);
        }
      }
      setSubmitted(false);
    } catch (err) {
      //console.log(err)
      setWrongPassword(true);
      setSubmitted(false);
    }
  }

  async function loginWithEmail(email, password) {
    try {
      await client.collection('users').authWithPassword(email, password);
      resetPasswordVars();
    } catch {
      setLoginError(true);
    }
  }

  const submitUsername = async () => {
    try {
      setSubmitted(true);
      //update username data
      const data = {
        "username": name
      };

      await client.collection('users').update(client.authStore.model.id, data);
      setSubmitted(false);
    } catch {setSubmitted(false);}
  }

  const CancelSubscription = async () => {
    await client.collection('users').update( client.authStore.model.id, {subCancelIntent: true} );
    await fetch(`${global.pocketbaseDomain}/api/cancelSubscription`);
  }


  useEffect(() => {
    getUserData();
  }, [])
  return(
    <Layout overlay={
      <InstallPrompt hideInstallPrompt={true} />
    } topbar={
      <h1 className='border-b-white/20 inner-shadow-main bg-black/40 backdrop-blur-md flex flex-1 gap-2 px-4 pt-2 pb-2 text-2xl font-bold text-white border-b-2'>
        <UserIcon className='h-6 my-auto' />
        Settings
      </h1>
    }>
    <div className="px-4">
      <div className="flex mb-8">
        <p className="text-gray-200/70 flex-1 text-lg font-medium">{editUsername ? <>Edit Name</> : <>Name<a onClick={() => setEditUsername(true)} className='text-white/70 pl-2 font-light cursor-pointer'>(edit)</a></>}</p>
        {editUsername ?
        <div className="flex-1">
          <input placeholder='Username' autoComplete='username' type="text" className="input-text" value={name} onChange={(e) => setName(e.target.value)} />
          <div className="flex gap-4 pt-4">
            <a onClick={() => {setEditUsername(false)}} className="secondary-button ml-auto cursor-pointer">Cancel</a>
            <LoaderButton type="submit" onClick={() => {setEditUsername(false), submitUsername()}} submitted={submitted}>Submit</LoaderButton>
          </div>
        </div> :
        <p className="sm:col-span-2 sm:mt-0 flex-1 mt-1 text-lg text-white">{name}</p>
        }
      </div>
      <div className="flex mb-8">
        <p className="text-gray-200/70 flex-1 text-lg font-medium">Email</p>
        {editEmail ?
        <div className="flex-1">
          <input placeholder='Email' autoComplete='Email' type="text" className="input-text" value={email} onChange={(e) => setEmail(e.target.value)} />
          <div className="flex gap-4 pt-4">
            <a onClick={() => {setEditEmail(false)}} className="secondary-button ml-auto cursor-pointer">Cancel</a>
            <LoaderButton type="submit" onClick={() => {setEditEmail(false), submitEmail()}} submitted={submitted}>Submit</LoaderButton>
          </div>
        </div> :
        <p className="sm:col-span-2 sm:mt-0 flex-1 mt-1 text-lg text-white">{email}</p>
        }
      </div>
      <div className="flex mb-8">
        <p className="text-gray-200/70 flex-1 text-lg font-medium">{editPassword ? <>Change Password</> : <>Password<a onClick={() => setEditPassword(true)} className='text-white/70 pl-2 font-light cursor-pointer'>(change)</a></>}</p>
        {editPassword ?
        <div className="flex flex-col flex-1 gap-2">
          {wrongPassword ?
          <div className="relative px-4 py-3 mt-5 mb-2 text-red-700 bg-red-100 border border-red-600 rounded" role="alert">
          <span className="sm:inline block">The password is not correct.</span>
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
              <a onClick={() => {setEditPassword(false), resetPasswordVars()}} className="secondary-button ml-auto cursor-pointer">Cancel</a>
              <LoaderButton type='submit' submitted={submitted}>Submit</LoaderButton>
            </div>
          </form>
        </div>
        :
        <p className="sm:col-span-2 sm:mt-0 flex-1 mt-1 text-lg text-white">*********</p>
      }
      </div>
      <div className="flex mb-8">
        <p className="text-gray-200/70 flex-1 text-lg font-medium">Subscription <a onClick={() => setEditSubscription(!editSubscription)} className='text-white/70 pl-2 font-light cursor-pointer'>(manage)</a></p>
        {editSubscription ? 
        <div className="flex-1">
          {datePaid > 0 ?
          <a className='rounded-xl bg-black/40 flex flex-col w-full gap-2 px-4 py-2 pb-6 my-2 cursor-pointer'>
            <h3 className='text-xl font-bold'>Free trial!</h3>
            <p>{datePaid.toFixed(0)} days remaining</p>
            <button className="fancy block w-full px-6 py-3 font-medium text-center text-black bg-white border border-transparent rounded-full" onClick={() => CancelSubscription().then(() => window.location.href = global.homepageDomain+'/pricing')}>Cancel Now</button>
          </a>
          :
          <a onClick={() => {getCustomerPortalURL().then((URL) => window.location.href = URL)}} className="bg-black/40 w-fit flex gap-4 px-4 py-2 my-2 rounded-lg cursor-pointer">
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
        <p className="sm:col-span-2 sm:mt-0 flex flex-col flex-1 mt-1 text-lg text-white">Free Trial! <span className="text-md italic text-gray-300">{datePaid.toFixed(0)} days remaining</span></p>
        :
        <p className="sm:col-span-2 sm:mt-0 flex-1 mt-1 text-lg">${totalCost.toFixed(2)}</p>
      }
      </>
}
      </div>
    </div>
    <div className="flex flex-col items-center my-auto">
      <a onClick={() => {client.authStore.clear(), window.location.href = '/signin' }} className='warning-button w-3/4 mt-12'>Sign Out</a>
    </div>
    </Layout>
  )
}