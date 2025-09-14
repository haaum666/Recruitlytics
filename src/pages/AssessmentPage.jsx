import React, { useState, useEffect } from 'react';
import { questions as defaultQuestions } from '../config/questions.js';
import QuestionItem from '../components/assessment/QuestionItem';
import { saveToLocalStorage, getFromLocalStorage } from '../services/localStorageService.js';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';

function AssessmentPage() {
  const [assessmentData, setAssessmentData] = useState({});
  const [totalScore, setTotalScore] = useState(0);
  const [currentQuestions, setCurrentQuestions] = useState([]);

  useEffect(() => {
    const savedQuestions = getFromLocalStorage('customQuestions', []);
    if (savedQuestions.length > 0) {
      setCurrentQuestions([...defaultQuestions, ...savedQuestions]);
    } else {
      setCurrentQuestions(defaultQuestions);
    }
  }, []);

  useEffect(() => {
    const calculateTotalScore = () => {
      let score = 0;
      for (const question of currentQuestions) {
        const data = assessmentData[question.id];
        if (data && data.score) {
          score += data.score;
        }
      }
      setTotalScore(score);
    };

    calculateTotalScore();
  }, [assessmentData, currentQuestions]);

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
        {currentQuestions.map(question => (
          <QuestionItem
            key={question.id}
            question={question}
            onInputChange={(field, value) => handleInputChange(question.id, field, value)}
          />
        ))}
      </div>
      <Card className="mt-8">
        <CardContent className="flex justify-between items-center">
          <Button onClick={handleSaveAssessment}>Сохранить оценку</Button>
          <h2 className="text-2xl font-semibold">Итоговый балл: {totalScore}</h2>
        </CardContent>
      </Card>
    </div>
  );
}

export default AssessmentPage;
