import React from 'react';
import { questions } from '../../config/questions.js';

function QuestionsEditor() {
  return (
    <div className="p-4 border rounded-md bg-white shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Управление вопросами</h2>
      <ul className="space-y-4">
        {questions.map(q => (
          <li key={q.id} className="p-3 border rounded-md bg-gray-50 flex justify-between items-center">
            <span>{q.text} (Вес: {q.weight})</span>
            <div className="space-x-2">
              <button className="text-blue-600 hover:text-blue-800">Редактировать</button>
              <button className="text-red-600 hover:text-red-800">Удалить</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default QuestionsEditor;
