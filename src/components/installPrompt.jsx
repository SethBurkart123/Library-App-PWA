import React, { useState, useEffect, useRef } from 'react';

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [platform, setPlatform] = useState('');
  const [isPWA, setIsPWA] = useState(false);
  const [IOSPrompt, setIOSPrompt] = useState(false);
  const [dimmed, setDimmed] = useState(false);
  const removeHidden = useRef(null);
  const removeHidden2 = useRef(null);
  
  useEffect(() => {
    // check if running inside app
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsPWA(true);
    }
    
    if (!isPWA) {
      const currentPlatform = navigator.platform;
      if (currentPlatform.includes('iPad') || currentPlatform.includes('iPod') || currentPlatform.includes('iPhone')) {
        setPlatform('IOS');
        console.log(platform)
      } else if (currentPlatform.includes('Android')) {
        setPlatform('Android');
        console.log(platform)
      } else if (currentPlatform.includes('Win')) {
        setPlatform('Windows');
        console.log(platform)
      } else if (currentPlatform.includes('Mac')) {
        setPlatform('Mac OS');
        console.log(platform)
      }
      
      const handleBeforeInstallPrompt = (e) => {
        e.preventDefault();
        setDeferredPrompt(e);
        setShowPrompt(true);
        removeHidden.current.style.display = null;
      }
      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      return () => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      }
    }
  }, [])
  
  const promptIOSInstall = () => {
    console.log("IOS")
    removeHidden2.current.style.display = null;
    setDimmed(true);
    setIOSPrompt(true);
    setShowPrompt(false);
  }
  
  const promptInstall = () => {
    setDimmed(true);
    setShowPrompt(false);
    console.log(deferredPrompt);
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the A2HS prompt');
        setDimmed(false);
      } else {
        console.log('User dismissed the A2HS prompt');
        setDimmed(false);
      }
      setDeferredPrompt(null);
    });
  }

  return (
  <>
  {isPWA ? null :
  <div className={dimmed ? 
    "absolute pointer-events-none transition duration-500 overflow-hidden top-0 left-0 right-0 bottom-0 z-10 bg-black/40" :
    "absolute pointer-events-none transition duration-500 overflow-hidden top-0 left-0 right-0 bottom-0 z-10"}>
  <div
  ref={removeHidden2}
  className={IOSPrompt ?
    "absolute pointer-events-auto z-60 bottom-0 left-0 right-0 showPrompt" :
    "absolute pointer-events-auto z-60 bottom-0 left-0 right-0 hidePrompt"}
    style={{
      display: "none"
    }}
    >
    <div className="bg-white/90 md:w-55vh backdrop-blur-md rounded-3xl w-11/12 gap-4 px-2 py-2 pb-6 mx-auto mb-2 transition-transform duration-1000 delay-500">
      <div className="flex gap-4 px-4 py-2">
        <img src="/192x192.png" className="w-12 h-12" />
        <p className="whitespace-nowrap fancy my-auto overflow-hidden text-2xl font-medium">Install Library App</p>
      <div className="z-10 my-auto ml-auto" onClick={() => {setIOSPrompt(false), setDimmed(false), setShowPrompt(true)}}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
      </div>
      <div className="h-0.5 bg-gray-600/20 mb-4 mt-2"></div>
      <div className="px-6">
        <div className='flex gap-2 my-auto mt-4'>
          <p className="h-full my-auto">1. Tap on</p>
          <div className="p-2 bg-white rounded-md">
            <img src="/shareIcon.png" className="h-5" />
          </div>
        </div>
        <div className='flex gap-2 my-auto mt-4'>
          <p className="h-full my-auto">2. Select</p>
          <div className="p-2 bg-white rounded-md">
            <img src="/homeScreen.jpeg" className="h-5" />
          </div>
        </div>
      </div>
    </div>
  </div>


  <div
  ref={removeHidden}
  className={showPrompt ?
    "absolute z-60 pointer-events-auto bottom-0 left-0 right-0 showPrompt" :
    "absolute z-60 pointer-events-auto bottom-0 left-0 right-0 hidePrompt"}
    style={{
      display: "none"
    }}
    >
    <div
    className="bg-white/50 md:w-65vh backdrop-blur-md rounded-t-3xl flex w-full gap-4 px-4 py-2 mx-auto transition-transform duration-1000 delay-500">
      <img src="/192x192.png" className="w-12 h-12" />
      <p className="whitespace-nowrap fancy my-auto overflow-hidden text-2xl font-medium">Library App</p>
      <button onClick={platform == "IOS" ? promptIOSInstall : promptInstall} className="px-8 ml-auto text-white bg-blue-600 rounded-full">Install</button>
      <div className="z-10 my-auto" onClick={() => {setShowPrompt(false), setDimmed(false)}}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
    </div>
  </div>
  </div>
  }
  </>
  );
}

export default InstallPrompt;