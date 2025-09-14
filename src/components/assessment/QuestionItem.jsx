import React from 'react';
import { Card, CardHeader, CardContent } from '../ui/card';

function QuestionItem({ question, onInputChange }) {
  return (
    <Card className="p-4">
      <CardHeader className="p-0 pb-2">
        <p className="font-medium">{question.text}</p>
        <span className="text-sm text-gray-500">Вес: {question.weight}</span>
      </CardHeader>
      <CardContent className="p-0">
        <textarea
          className="w-full p-2 border rounded-md"
          placeholder="Добавьте комментарий..."
          onChange={(e) => onInputChange('comment', e.target.value)}
        />
      </CardContent>
    </Card>
  );
}

export default QuestionItem;
