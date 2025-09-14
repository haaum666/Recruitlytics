import React, { useState, useEffect } from 'react';
import { questions } from '../config/questions.js';
import QuestionItem from '../components/assessment/QuestionItem';

function AssessmentPage() {
  const [assessmentData, setAssessmentData] = useState({});
  const [totalScore, setTotalScore] = useState(0);

  const handleInputChange = (id, field, value) => {
    setAssessmentData(prevData => ({
      ...prevData,
      [id]: {
        ...prevData[id],
        [field]: value,
      },
    }));
  };

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
      <div className="mt-8 p-4 border rounded-md shadow-lg bg-white text-right">
        <h2 className="text-2xl font-semibold">Итоговый балл: {totalScore}</h2>
      </div>
    </div>
  );
}

export default AssessmentPage;
