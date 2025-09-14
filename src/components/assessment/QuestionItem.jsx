import React from 'react';
import { Button } from '../ui/button';

function QuestionItem({ question, onInputChange }) {
  return (
    <div className="p-4 border rounded-md shadow-sm bg-white">
      <div className="flex items-center justify-between">
        <p className="font-medium">{question.text}</p>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Вес: {question.weight}</span>
          <input
            type="number"
            min="0"
            max={question.weight}
            className="w-16 p-1 border rounded-md text-center"
            onChange={(e) => onInputChange('score', Number(e.target.value))}
          />
        </div>
      </div>
      <div className="mt-2">
        <textarea
          className="w-full p-2 border rounded-md"
          placeholder="Добавьте комментарий..."
          onChange={(e) => onInputChange('comment', e.target.value)}
        />
      </div>
    </div>
  );
}

export default QuestionItem;
