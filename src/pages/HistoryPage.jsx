import React, { useState, useEffect } from 'react';
import { getFromLocalStorage } from '../services/localStorageService.js';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

function HistoryPage() {
  const [assessments, setAssessments] = useState([]);

  useEffect(() => {
    const savedAssessments = getFromLocalStorage('assessments', []);
    setAssessments(savedAssessments);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">История оценок</h1>
      {assessments.length > 0 ? (
        <ul className="space-y-4">
          {assessments.map((assessment, index) => (
            <Card key={index} className="p-4">
              <CardContent className="flex justify-between items-center p-0">
                <div className="flex flex-col">
                  <span className="font-semibold">Оценка #{index + 1}</span>
                  <span className="text-sm text-gray-600">Дата: {new Date(assessment.date).toLocaleDateString()}</span>
                </div>
                <Badge variant="secondary" className="text-base py-1 px-4">
                  Балл: {assessment.score}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">Пока нет сохраненных оценок.</p>
      )}
    </div>
  );
}

export default HistoryPage;
