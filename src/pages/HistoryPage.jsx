import React, { useState, useEffect } from 'react';
import { getFromLocalStorage } from '../services/localStorageService.js';

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
            <li key={index} className="p-4 border rounded-md shadow-sm bg-white">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Оценка #{index + 1}</span>
                <span className="text-gray-600">Дата: {new Date(assessment.date).toLocaleDateString()}</span>
              </div>
              <p className="mt-2 text-xl font-bold">Итоговый балл: {assessment.score}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">Пока нет сохраненных оценок.</p>
      )}
    </div>
  );
}

export default HistoryPage;
