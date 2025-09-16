import React from 'react';
import Sidebar from './Sidebar';

function Layout({ children, onPageChange, currentPage }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar onPageChange={onPageChange} currentPage={currentPage} />
      <main className="flex-1 p-2">
        {children}
      </main>
    </div>
  );
}

export default Layout;
