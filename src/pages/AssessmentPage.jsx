import React, { useState, useEffect } from 'react';
import { getFromLocalStorage, saveToLocalStorage } from '../services/localStorageService.js';
import { Card, CardContent, CardHeader } from '../components/ui/card';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../components/ui/accordion';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Button } from '../components/ui/button';
import { questions as defaultQuestions } from '../config/questions.js';

function AssessmentPage() {
  const [questions, setQuestions] = useState([]);
  const [assessmentData, setAssessmentData] = useState({});
  const [candidateData, setCandidateData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    salaryMin: '',
    salaryMax: '',
    location: '',
    phone: '',
    messenger: '',
    role: '',
  });

  useEffect(() => {
    const savedQuestions = getFromLocalStorage('customQuestions', []);
    const combinedQuestions = [...defaultQuestions, ...savedQuestions];
    setQuestions(combinedQuestions);
    setAssessmentData(
      combinedQuestions.reduce((acc, q) => {
        acc[q.id] = { score: 0, comment: '' };
        return acc;
      }, {})
    );
  }, []);

  const handleScoreChange = (id, score) => {
    setAssessmentData(prevData => ({
      ...prevData,
      [id]: { ...prevData[id], score: Number(score) },
    }));
  };

  const handleCommentChange = (id, comment) => {
    setAssessmentData(prevData => ({
      ...prevData,
      [id]: { ...prevData[id], comment },
    }));
  };

  const handleCandidateChange = (e) => {
    const { id, value } = e.target;
    setCandidateData(prevData => ({
      ...prevData,
      [id]: value,
    }));
  };

  const calculateTotalScore = () => {
    const totalWeightedScore = questions.reduce((total, question) => {
      const item = assessmentData[question.id] || {};
      const score = item.score || 0;
      return total + score * question.weight;
    }, 0);
    
    const totalWeight = questions.reduce((total, question) => total + question.weight, 0);

    if (totalWeight === 0) {
      return 0;
    }

    return (totalWeightedScore / totalWeight).toFixed(2);
  };

  const saveAssessment = () => {
    const totalScore = calculateTotalScore();
    const newAssessment = {
      date: new Date().toISOString(),
      score: totalScore,
      data: assessmentData,
      candidate: candidateData,
    };
    
    const savedAssessments = getFromLocalStorage('assessments', []);
    saveToLocalStorage('assessments', [...savedAssessments, newAssessment]);
    alert('Оценка сохранена!');
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Новая оценка</h1>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Данные кандидата</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">Имя</Label>
                <Input id="firstName" value={candidateData.firstName} onChange={handleCandidateChange} />
              </div>
              <div>
                <Label htmlFor="lastName">Фамилия</Label>
                <Input id="lastName" value={candidateData.lastName} onChange={handleCandidateChange} />
              </div>
              <div>
                <Label htmlFor="role">Позиция</Label>
                <Input id="role" value={candidateData.role} onChange={handleCandidateChange} />
              </div>
              <div>
                <Label htmlFor="age">Возраст</Label>
                <Input id="age" type="number" value={candidateData.age} onChange={handleCandidateChange} />
              </div>
              <div>
                <Label htmlFor="salaryMin">ЗП, мин</Label>
                <Input id="salaryMin" type="number" value={candidateData.salaryMin} onChange={handleCandidateChange} />
              </div>
              <div>
                <Label htmlFor="salaryMax">ЗП, макс</Label>
                <Input id="salaryMax" type="number" value={candidateData.salaryMax} onChange={handleCandidateChange} />
              </div>
              <div>
                <Label htmlFor="location">Локация</Label>
                <Input id="location" value={candidateData.location} onChange={handleCandidateChange} />
              </div>
              <div>
                <Label htmlFor="phone">Телефон</Label>
                <Input id="phone" type="tel" value={candidateData.phone} onChange={handleCandidateChange} />
              </div>
              <div>
                <Label htmlFor="messenger">Мессенджер</Label>
                <Input id="messenger" value={candidateData.messenger} onChange={handleCandidateChange} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Accordion type="single" collapsible className="w-full">
          {questions.map((question) => (
            <AccordionItem key={question.id} value={question.id}>
              <AccordionTrigger>{question.text} ({question.weight} баллов)</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor={`score-${question.id}`}>Балл (0-10)</Label>
                    <Input
                      id={`score-${question.id}`}
                      type="number"
                      min="0"
                      max="10"
                      value={assessmentData[question.id]?.score || ''}
                      onChange={(e) => handleScoreChange(question.id, e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`comment-${question.id}`}>Комментарий</Label>
                    <Textarea
                      id={`comment-${question.id}`}
                      placeholder="Добавьте свои мысли"
                      value={assessmentData[question.id]?.comment || ''}
                      onChange={(e) => handleCommentChange(question.id, e.target.value)}
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <div className="mt-6 flex justify-between items-center">
        <div className="text-xl font-bold">Итоговый балл: {calculateTotalScore()}</div>
        <Button onClick={saveAssessment}>Сохранить оценку</Button>
      </div>
    </div>
  );
}

export default AssessmentPage;
