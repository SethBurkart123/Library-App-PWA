export default function Footer() {
  return(
    <div className="sticky bottom-0 z-50 flex justify-center gap-8 py-2 text-white bg-wood-side">
      <a aria-label="Create" href="/create" className="p-1 rounded-lg shadow-inner bg-wood-side-dark">
        <svg viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" alt="Create" className="h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      </a>
      <a aria-label="Search" href="/search" className="p-1 rounded-lg shadow-inner bg-wood-side-dark">
        <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" alt="Search" className="h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
      </a>
      <a aria-label="User Preferences" href="/settings" className="p-1 rounded-lg shadow-inner bg-wood-side-dark">
        <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" alt="User Preferences" className="h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
      </a>
    </div>
  )
}