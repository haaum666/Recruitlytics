import React from 'react';
import { Button } from '../ui/button';
import { cn } from '../../utils/cn.js';

function Sidebar({ onPageChange, currentPage, historyButtonRef }) {
  const navItems = [
    { name: 'Новая оценка', page: 'assessment' },
    { name: 'История', page: 'history', ref: historyButtonRef },
    { name: 'Настройки', page: 'settings' },
  ];

  return (
    <aside className="w-64 bg-white border-r flex flex-col items-center">
      <div className="py-6 mb-4">
        <h2 className={cn(
          "text-2xl text-white bg-black p-2 border-2 border-gray-500 shadow-[6px_6px_0_0_#4a5568]",
          "drop-shadow-[2px_2px_0_#4a5568] uppercase tracking-wider"
        )}>
          Recruitlytics
        </h2>
      </div>
      <nav className="space-y-2 w-full px-4">
        {navItems.map((item) => (
          <Button
            key={item.page}
            ref={item.ref}
            variant={currentPage === item.page ? 'secondary' : 'ghost'}
            className="w-full justify-center transition-colors duration-200 ease-in-out hover:bg-slate-200"
            onClick={() => onPageChange(item.page)}
          >
            {item.name}
          </Button>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
