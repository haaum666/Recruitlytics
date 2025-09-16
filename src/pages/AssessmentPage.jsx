import React, { useState, useEffect, useRef } from 'react';
import { getFromLocalStorage, saveToLocalStorage } from '../services/localStorageService.js';
import { Card, CardContent, CardHeader } from '../components/ui/card';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../components/ui/accordion';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Button } from '../components/ui/button';
import { questions as defaultQuestions } from '../config/questions.js';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../components/ui/dialog';

function AssessmentPage({ assessmentToEdit, setAssessmentToEdit, onPageChange, saveButtonRef }) {
  const [questions, setQuestions] = useState([]);
  const [assessmentData, setAssessmentData] = useState({});
  const [candidateData, setCandidateData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    salary: '',
    location: '',
    phone: '',
    messenger: '',
    role: '',
  });

  const [strengths, setStrengths] = useState('');
  const [weaknesses, setWeaknesses] = useState('');
  const [motivation, setMotivation] = useState('');

  const [openAccordion, setOpenAccordion] = useState('');
  const scoreInputRefs = useRef({});
  const commentInputRefs = useRef({});
  const [isSaveSuccess, setIsSaveSuccess] = useState(false);

  const resetForm = () => {
    const savedCustomQuestions = getFromLocalStorage('customQuestions', []);
    const savedModifiedDefaultQuestions = getFromLocalStorage('modifiedDefaultQuestions', []);

    const mergedQuestions = defaultQuestions.map(defaultQ => {
      const modified = savedModifiedDefaultQuestions.find(modQ => modQ.id === defaultQ.id);
      return modified || defaultQ;
    });

    const combinedQuestions = [
      ...mergedQuestions,
      ...savedCustomQuestions
    ];

    setQuestions(combinedQuestions);
    setAssessmentData(
      combinedQuestions.reduce((acc, q) => {
        acc[q.id] = { score: 0, comment: '' };
        return acc;
      }, {})
    );
    setCandidateData({
      firstName: '',
      lastName: '',
      age: '',
      salary: '',
      location: '',
      phone: '',
      messenger: '',
      role: '',
    });
    setStrengths('');
    setWeaknesses('');
    setMotivation('');
    setOpenAccordion('');
  };

  useEffect(() => {
    resetForm();
  }, []);

  useEffect(() => {
    if (assessmentToEdit) {
      setCandidateData(assessmentToEdit.candidate);
      setAssessmentData(assessmentToEdit.data);
      setStrengths(assessmentToEdit.strengths);
      setWeaknesses(assessmentToEdit.weaknesses);
      setMotivation(assessmentToEdit.motivation);
    } else {
      resetForm();
    }
  }, [assessmentToEdit]);

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
      id: assessmentToEdit ? assessmentToEdit.id : Date.now(),
      date: new Date().toISOString(),
      score: totalScore,
      data: assessmentData,
      candidate: candidateData,
      strengths: strengths,
      weaknesses: weaknesses,
      motivation: motivation,
      questions: questions // Добавлено: сохраняем актуальный список вопросов
    };
    
    const savedAssessments = getFromLocalStorage('assessments', []);
    if (assessmentToEdit) {
      const updatedAssessments = savedAssessments.map(item =>
        item.id === assessmentToEdit.id ? newAssessment : item
      );
      saveToLocalStorage('assessments', updatedAssessments);
    } else {
      saveToLocalStorage('assessments', [...savedAssessments, newAssessment]);
    }
    
    setIsSaveSuccess(true);
  };
  
  const handleOkClick = () => {
    setIsSaveSuccess(false);
    onPageChange('history');
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
      <h1 className="text-3xl font-bold">{assessmentToEdit ? 'Редактирование оценки' : 'Оценка компетенций специалиста'}</h1>

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
              <Label htmlFor="phone">Телефон</Label>
              <Input id="phone" type="tel" value={candidateData.phone} onChange={handleCandidateChange} />
            </div>
            <div>
              <Label htmlFor="messenger">Мессенджер</Label>
              <Input id="messenger" value={candidateData.messenger} onChange={handleCandidateChange} />
            </div>
            <div>
              <Label htmlFor="age">Возраст</Label>
              <Input id="age" type="number" value={candidateData.age} onChange={handleCandidateChange} />
            </div>
            <div>
              <Label htmlFor="location">Локация</Label>
              <Input id="location" value={candidateData.location} onChange={handleCandidateChange} />
            </div>
            <div>
              <Label htmlFor="role">Позиция</Label>
              <Input id="role" value={candidateData.role} onChange={handleCandidateChange} />
            </div>
            <div>
              <Label htmlFor="salary">Ожидания ЗП (min-комфорт)</Label>
              <Input id="salary" value={candidateData.salary} onChange={handleCandidateChange} placeholder="1000₽ - 1500₽" />
            </div>
          </div>
        </CardContent>
      </Card>
      
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
                            className="rounded-r-none border-r-0 hover:bg-gray-100 w-10 h-10"
                          >
                            -
                          </Button>
                          <Button
                            onClick={() => handleScoreChange(question.id, (assessmentData[question.id]?.score || 0) + 1)}
                            variant="outline"
                            className="rounded-none border-r-0 hover:bg-gray-100 w-10 h-10"
                          >
                            +
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
                            className="rounded-l-none text-center"
                          />
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
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Профиль кандидата</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="strengths">Сильные стороны кандидата</Label>
            <Textarea
              id="strengths"
              value={strengths}
              onChange={(e) => setStrengths(e.target.value)}
              placeholder="Кратко опишите навыки и достижения, которые произвели наибольшее впечатление."
              rows="4"
            />
          </div>
          <div>
            <Label htmlFor="weaknesses">Потенциальные зоны внимания</Label>
            <Textarea
              id="weaknesses"
              value={weaknesses}
              onChange={(e) => setWeaknesses(e.target.value)}
              placeholder="Зафиксируйте моменты, которые требуют дополнительного обсуждения или могут быть рисками."
              rows="4"
            />
          </div>
          <div>
            <Label htmlFor="motivation">Комментарий по мотивации</Label>
            <Textarea
              id="motivation"
              value={motivation}
              onChange={(e) => setMotivation(e.target.value)}
              placeholder="Запишите, почему кандидат рассматривает нашу вакансию и что его мотивирует."
              rows="4"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center items-center mt-6">
        <Button onClick={saveAssessment} ref={saveButtonRef} className="w-1/2 md:w-auto bg-gray-200 text-gray-800 hover:bg-gray-300">
          {assessmentToEdit ? 'Обновить и завершить' : 'Сохранить и завершить'}
        </Button>
      </div>

      <Dialog open={isSaveSuccess} onOpenChange={setIsSaveSuccess}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Сохранение завершено</DialogTitle>
            <DialogDescription>
              {assessmentToEdit ? 'Оценка успешно обновлена!' : 'Оценка успешно сохранена!'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={handleOkClick}>ОК</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AssessmentPage;
