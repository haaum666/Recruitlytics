import React from 'react';
import Sidebar from './Sidebar';

function Layout({ children, onPageChange }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar onPageChange={onPageChange} />
      <main className="p-6">
        {children}
      </main>
    </div>
  );
}

export default Layout;
