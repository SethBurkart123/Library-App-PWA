import React, { useRef, useEffect, useState } from 'react';
import Footer from './footer';
import background from '../images/background2.webp';

const Layout = (props) => {
  const elementRef = useRef(null);
  const [scrolling, setScrolling] = useState(false);

  useEffect(() => {
    // Scroll down by 5px on page load with smooth behavior
    elementRef.current.scrollTo({ top: 1 });

    // Add event listener to prevent scrolling above 5px
    elementRef.current.addEventListener('scroll', () => {
      if (elementRef.current.scrollTop < 1) {
        // Scroll back to 5px with smooth behavior
        elementRef.current.scrollTo({ top: 1 });
      }
      setScrolling(true);
    });

    // Call the scrollEnd function on the next frame
    requestAnimationFrame(scrollEnd);

    // Remove event listener on cleanup
    return () => {
      try {
        elementRef.current.removeEventListener('scroll', () => {});
      } catch {
        // meh who cares if it doesnt unmount
      }
    };
  }, []);

  function scrollEnd() {
    if (scrolling) {
      setScrolling(false);
      // Do something when scrolling ends
      console.log("Scrolling ended");
    } else {
      // Call the scrollEnd function again on the next frame
      requestAnimationFrame(scrollEnd);
    }
  }


  return (
    <>
      <img src={background} alt="background" className="absolute object-cover min-h-screen translate-y-1/2 -z-10 bottom-1/2" />
      <div className="flex flex-col justify-between w-screen h-screen mx-auto md:w-65vh bg-wood-side-dark" style={{boxShadow: "0px 7px 100px 80px rgba(0,0,0,1)"}}>
        <div className="sticky top-0 z-50">
          <div className="h-4 -mt-4 backdrop-blur-sm"></div>
          {props.topbar}
        </div>
        {props.overlay}
        <div ref={elementRef} className="h-screen pb-48 overflow-y-scroll text-white bg-transparent pt-18 touch fill">
          <div className="w-screen mx-auto md:w-65vh">
            {props.children}
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default Layout;