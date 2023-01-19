import Rive from "@rive-app/react-canvas";

export default function LoaderButton({submitted, onClick, children, type}) {
  type = type || '';
  return (
    <>
    {submitted ?
      <button className="primary-button relative mr-0">
        <p className="text-white/0">{children}</p>
        <Rive className='top-1/2 left-1/2 absolute w-8 h-8 -translate-x-1/2 -translate-y-1/2' src="/animations/loader.riv" />
      </button> :
      <button type={type} onClick={() => onClick()} className="primary-button mr-0">{children}</button>
    }
    </>
  );
}

export function DeleteLoaderButton({submitted, onClick, children, type}) {
  type = type || '';
  return (
    <>
    {submitted ?
      <button className="warning-button relative mr-0">
        <p className="text-white/0">{children}</p>
        <Rive className='top-1/2 left-1/2 absolute w-8 h-8 -translate-x-1/2 -translate-y-1/2' src="/animations/loader.riv" />
      </button> :
      <button type={type} onClick={() => onClick()} className="warning-button mr-0">{children}</button>
    }
    </>
  );
}