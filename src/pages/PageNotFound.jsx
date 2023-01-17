import background from '../images/404.webp';

function PageNotFound() {
  return (
    <>
    <img src={background} alt="Signin background" className="object-cover fade-in absolute bottom-1/2 translate-y-1/2 min-h-screen" />
    <div className="flex justify-center items-center h-screen z-10 bg-[#0F252B] inner-shadow-main" style={{boxShadow: "inset 0px 0px 200px 17px rgba(0,0,0,0.7)"}}>
      <div className="backdrop-blur-3xl bg-gray-800/60 flex justify-center flex-col p-6 rounded-2xl" style={{boxShadow: "inset 0px 0px 50px -2px rgba(0,0,0,.1),0px 12px 100px 22px rgba(0,0,0,1)"}}>
        <h1 className="text-9xl fancy flex text-[#EAB599] flex-col justify-between text-center" style={{textShadow: "4px 4px 0px #c6811b"}}>
          404
        </h1>
        <p className="text-[rgb(227,157,54)] text-xl my-6 text-center fancy">The page you are looking for is not here!</p>
        <a href="/" className="text-xl fancy text-center bg-white rounded-full px-12 py-2 mb-4">Leave this place</a>
      </div>
    </div>
    </>
  );
}

export default PageNotFound;