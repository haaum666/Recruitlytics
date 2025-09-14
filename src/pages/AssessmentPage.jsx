import React, { useState, useEffect, useRef } from 'react';
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
  const [openAccordion, setOpenAccordion] = useState('');

  const scoreInputRefs = useRef({});
  const commentInputRefs = useRef({});

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

  const handleScoreChange = (id, value) => {
    const score = Number(value);
    let validatedScore = score;
    if (score > 10) {
      validatedScore = 10;
    } else if (score < 0) {
      validatedScore = 0;
    }
    
    setAssessmentData(prevData => ({
      ...prevData,
      [id]: { ...prevData[id], score: validatedScore },
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
    const totalPossibleScore = questions.reduce((total, q) => total + q.weight * 10, 0);
    const totalWeightedScore = questions.reduce((total, question) => {
      const item = assessmentData[question.id] || {};
      const score = item.score || 0;
      return total + score * question.weight;
    }, 0);
    
    if (totalPossibleScore === 0) {
      return 0;
    }
    
    const finalScore = (totalWeightedScore / totalPossibleScore) * 10;
    
    return finalScore.toFixed(2);
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

  const handleAccordionOpen = (value) => {
    setOpenAccordion(value);
    if (value && scoreInputRefs.current[value]) {
      setTimeout(() => scoreInputRefs.current[value].focus(), 0);
    }
  };

  const handleScoreKeyDown = (e, questionId) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const commentInput = commentInputRefs.current[questionId];
      if (commentInput) {
        commentInput.focus();
      }
    }
  };

  const handleCommentKeyDown = (e, questionId, index) => {
    if (e.key === 'Enter' && !e.ctrlKey) {
      e.preventDefault();
      const nextQuestionId = questions[index + 1]?.id;
      if (nextQuestionId) {
        setOpenAccordion(nextQuestionId);
      } else {
        setOpenAccordion('');
      }
    } else if (e.key === 'Enter' && e.ctrlKey) {
      e.target.value += '\n';
    }
  };

  const formatComment = (comment) => {
    if (!comment) return '';
    const trimmedComment = comment.trim();
    if (trimmedComment.length > 30) {
      return `${trimmedComment.substring(0, 30)}...`;
    }
    return trimmedComment;
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Новая оценка</h1>

      {/* Блок: Данные кандидата */}
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
            <div className="sm:col-span-2">
              <Label htmlFor="messenger">Мессенджер</Label>
              <Input id="messenger" value={candidateData.messenger} onChange={handleCandidateChange} />
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Блок: Оценка навыков */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Оценка навыков</h2>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full" onValueChange={handleAccordionOpen} value={openAccordion}>
            {questions.map((question, index) => {
              const currentScore = assessmentData[question.id]?.score;
              const currentComment = assessmentData[question.id]?.comment;
              const isItemOpen = openAccordion === question.id;
              
              return (
                <AccordionItem key={question.id} value={question.id}>
                  <AccordionTrigger className="flex justify-between items-center w-full p-4 rounded-lg transition-colors duration-200 cursor-pointer hover:bg-gray-100 no-underline hover:no-underline data-[state=open]:bg-gray-100">
                    <div className="flex-1 text-left no-underline">{question.text} ({question.weight} баллов)</div>
                    {!isItemOpen && (currentScore > 0 || currentComment) && (
                      <div className="ml-4 flex items-center p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-sm flex-shrink-0">
                        {currentScore > 0 && <span>Балл: {currentScore}</span>}
                        {currentComment && (
                          <span className={`ml-2 ${currentScore > 0 ? 'border-l border-gray-300 pl-2' : ''}`}>
                            Коммент: {formatComment(currentComment)}
                          </span>
                        )}
                      </div>
                    )}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor={`score-${question.id}`}>Балл (0-10)</Label>
                        <div className="flex items-center">
                          <Button
                            onClick={() => handleScoreChange(question.id, (assessmentData[question.id]?.score || 0) - 1)}
                            variant="outline"
                            className="rounded-r-none border-r-0 hover:bg-gray-100"
                          >
                            -
                          </Button>
                          <Input
                            ref={el => scoreInputRefs.current[question.id] = el}
                            id={`score-${question.id}`}
                            type="number"
                            min="0"
                            max="10"
                            value={assessmentData[question.id]?.score || ''}
                            onChange={(e) => handleScoreChange(question.id, e.target.value)}
                            onKeyDown={(e) => handleScoreKeyDown(e, question.id)}
                            className="rounded-none text-center"
                          />
                          <Button
                            onClick={() => handleScoreChange(question.id, (assessmentData[question.id]?.score || 0) + 1)}
                            variant="outline"
                            className="rounded-l-none border-l-0 hover:bg-gray-100"
                          >
                            +
                          </Button>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor={`comment-${question.id}`}>Комментарий</Label>
                        <Textarea
                          ref={el => commentInputRefs.current[question.id] = el}
                          id={`comment-${question.id}`}
                          placeholder="Добавьте свои мысли"
                          value={assessmentData[question.id]?.comment || ''}
                          onChange={(e) => handleCommentChange(question.id, e.target.value)}
                          onKeyDown={(e) => handleCommentKeyDown(e, question.id, index)}
                          rows="3"
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center mt-6">
        <div className="text-xl font-bold">Итоговый балл: {calculateTotalScore()}</div>
        <Button onClick={saveAssessment}>Сохранить оценку</Button>
      </div>
    </div>
  );
}

export default AssessmentPage;
