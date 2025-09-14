import React from 'react';
import { Button } from '../ui/button';

function Sidebar({ onPageChange }) {
  return (
    <aside className="w-64 bg-white border-r">
      <div className="py-4 px-4 mb-4">
        <h2 className="text-xl font-bold">Recruitlytics</h2>
      </div>
      <nav className="space-y-2 px-4">
        <Button variant="ghost" className="w-full justify-start" onClick={() => onPageChange('assessment')}>Новая оценка</Button>
        <Button variant="ghost" className="w-full justify-start" onClick={() => onPageChange('history')}>История</Button>
        <Button variant="ghost" className="w-full justify-start" onClick={() => onPageChange('settings')}>Настройки</Button>
      </nav>
    </aside>
  );
}

export default Sidebar;
