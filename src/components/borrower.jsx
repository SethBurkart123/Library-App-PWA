import React, { useEffect } from "react";
export function Borrower({
  setBorrower,
  borrower,
  placeholder,
  className,
  getBooks
}) {
  useEffect(() => {
    getBooks(1);
  }, [borrower])
  return <div className={className}>
    <div className="px-2 py-2 shadow-inner bg-black/40 backdrop-blur-sm rounded-2xl">
      <input maxLength={128} placeholder={placeholder} className="input-text" type="text" value={borrower} onChange={e => {
    setBorrower(e.target.value);
  }} />
    </div>
  </div>;
}
  