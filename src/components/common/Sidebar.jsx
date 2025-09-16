import React from 'react';
import { Button } from '../ui/button';
import ThemeToggle from '../ThemeToggle'; // <--- Импортируем компонент-переключатель

function Sidebar({ onPageChange, currentPage, historyButtonRef }) {
  const navItems = [
    { name: 'Новая оценка', page: 'assessment' },
    { name: 'История', page: 'history', ref: historyButtonRef },
    { name: 'Настройки', page: 'settings' },
  ];

  return (
    <aside className="w-64 bg-white border-r flex flex-col items-center dark:bg-zinc-900 dark:border-zinc-800">
      <div className="py-6 mb-4">
        <h2 className="
          text-2xl 
          font-extrabold 
          text-gray-800 
          bg-gray-200 
          p-2 
          border-2 
          border-gray-500 
          shadow-[4px_4px_0_0_#4a5568] 
          font-mono 
          transition-all 
          duration-100 
          ease-in-out 
          active:translate-x-1 
          active:translate-y-1 
          active:shadow-none
          dark:text-gray-200
          dark:bg-zinc-800
          dark:border-zinc-500
          dark:shadow-[4px_4px_0_0_#444]
        ">
          Recruitlytics
        </h2>
      </div>
      <nav className="space-y-2 w-full px-4 flex-grow">
        {navItems.map((item) => (
          <Button
            key={item.page}
            ref={item.ref}
            variant={currentPage === item.page ? 'secondary' : 'ghost'}
            className="w-full justify-center transition-colors duration-200 ease-in-out hover:bg-slate-200 dark:hover:bg-zinc-800 dark:hover:text-white"
            onClick={() => onPageChange(item.page)}
          >
            {item.name}
          </Button>
        ))}
      </nav>
      <div className="p-4 mt-auto"> {/* <--- Контейнер для переключателя */}
        <ThemeToggle /> {/* <--- Переключатель темы здесь */}
      </div>
    </aside>
  );
}

export default Sidebar;
