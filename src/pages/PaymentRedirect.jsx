import { useState } from 'react';
import Pocketbase from 'pocketbase';
import { global } from '../globalVars';

export default function Setup() {
  const client = new Pocketbase(global.pocketbaseDomain);
  const [hasRun, setHasRun] = useState(true);


  if (hasRun) {
    setHasRun(false);
    const searchParams = new URLSearchParams(window.location.search);
    const resubscribe = searchParams.get('resubscribe');
    if (resubscribe) {
      getCustomerPortalURL(client).then((URL) => window.location.href = URL);
    } else {
      getPaymentURL(client).then((URL) => window.location.href = URL.paymentURL);
    }

    // check if client is logged in
    if (!client.authStore.isValid) {
      const paymentPlan = searchParams.get('paymentPlan');
      if (paymentPlan) {
        window.location.href = `/signup?paymentPlan=${paymentPlan}`;
      } else {
        window.location.href = "/signup";
      }
    } else {
      // send request to backend checking whether the user has created a subscription
      checkSubscription();
    }
  }

  return (
  <>
  </>
  );

}

const checkSubscription = async () => {
  try {
    const record = await client.collection('users').getOne(client.authStore.model.id, {});
    //console.log(record);
    if (record.createdSubscription == true) {
      window.location.href = "/";
    } else if (record.createdSubscription == false) {
      //console.log("Getting payment url!")
      getPaymentURL(client).then((URL) => window.location.href = URL.paymentURL);
    } else {
      //console.log("other");
      //console.log(record.createdSubscription)
    }
  } catch (err) {
    //console.log(err);
    
    // log user out as they dont exist
    //client.authStore.clear();
    //window.location.href = '/signin';
  }
}

const getPaymentURL = async (client) => {
  const searchParams = new URLSearchParams(window.location.search);
  const paymentPlan = searchParams.get('paymentPlan');

  await client.collection('users').update(client.authStore.model.id, {
    "updatePaymentURL": true,
    "subscriptionPlan": paymentPlan
  });
  await fetch(`${global.pocketbaseDomain}/api/updatePaymentURL`);
  const record = client.collection('users').getOne(client.authStore.model.id, {});
  return record;
}


async function getCustomerPortalURL(client) {
  await client.collection('users').update(client.authStore.model.id, {"updateCustomerPortalURL": true});
  await fetch(`${global.pocketbaseDomain}/api/updateCustomerPortalURL`);
  const record = await client.collection('users').getOne(client.authStore.model.id, {});
  return record.customerPortalURL;
}