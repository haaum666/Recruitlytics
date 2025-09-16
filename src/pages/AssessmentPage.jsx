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
