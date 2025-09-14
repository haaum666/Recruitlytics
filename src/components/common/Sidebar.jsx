import React from 'react';
import { Button } from '../ui/button';

function Sidebar() {
  return (
    <aside className="w-64 p-4 bg-white border-r">
      <div className="mb-8">
        <h2 className="text-xl font-bold">Recruitlytics</h2>
      </div>
      <nav className="space-y-2">
        <Button variant="ghost" className="w-full justify-start">Новая оценка</Button>
        <Button variant="ghost" className="w-full justify-start">История</Button>
        <Button variant="ghost" className="w-full justify-start">Настройки</Button>
      </nav>
    </aside>
  );
}

export default Sidebar;
