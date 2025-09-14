import React, { useState, useEffect } from 'react';
import { questions } from '../config/questions.js';
import QuestionItem from '../components/assessment/QuestionItem';
import { saveToLocalStorage, getFromLocalStorage } from '../services/localStorageService.js';

function AssessmentPage() {
  const [assessmentData, setAssessmentData] = useState({});
  const [totalScore, setTotalScore] = useState(0);

  useEffect(() => {
    const calculateTotalScore = () => {
      let score = 0;
      for (const question of questions) {
        const data = assessmentData[question.id];
        if (data && data.score) {
          score += data.score;
        }
      }
      setTotalScore(score);
    };

    calculateTotalScore();
  }, [assessmentData]);

  const handleInputChange = (id, field, value) => {
    setAssessmentData(prevData => ({
      ...prevData,
      [id]: {
        ...prevData[id],
        [field]: value,
      },
    }));
  };
  
  const handleSaveAssessment = () => {
    const newAssessment = {
      date: new Date().toISOString(),
      score: totalScore,
      data: assessmentData,
    };
    
    const savedAssessments = getFromLocalStorage('assessments', []);
    savedAssessments.push(newAssessment);
    saveToLocalStorage('assessments', savedAssessments);

    alert('Оценка сохранена!');
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Новая оценка кандидата</h1>
      <div className="space-y-4">
        {questions.map(question => (
          <QuestionItem
            key={question.id}
            question={question}
            onInputChange={(field, value) => handleInputChange(question.id, field, value)}
          />
        ))}
      </div>
      <div className="mt-8 flex justify-between items-center p-4 border rounded-md shadow-lg bg-white">
        <button
          onClick={handleSaveAssessment}
          className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors"
        >
          Сохранить оценку
        </button>
        <h2 className="text-2xl font-semibold">Итоговый балл: {totalScore}</h2>
      </div>
    </div>
  );
}

export default AssessmentPage;
