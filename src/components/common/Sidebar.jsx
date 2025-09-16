import React from 'react';
import { Button } from '../ui/button';

function Sidebar({ onPageChange, currentPage }) {
  const navItems = [
    { name: 'Новая оценка', page: 'assessment' },
    { name: 'История', page: 'history' },
    { name: 'Настройки', page: 'settings' },
  ];

  return (
    <aside className="w-64 bg-white border-r flex flex-col items-center">
      <div className="py-6 mb-4">
        <h2 className="text-xl font-bold text-center">Recruitlytics</h2>
      </div>
      <nav className="space-y-2 w-full px-4">
        {navItems.map((item) => (
          <Button
            key={item.page}
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
