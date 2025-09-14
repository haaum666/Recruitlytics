import React, { useState, useEffect } from 'react';
import { getFromLocalStorage, saveToLocalStorage } from '../services/localStorageService.js';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../components/ui/accordion';
import { questions as defaultQuestions } from '../config/questions.js';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../components/ui/dialog';
import { Textarea } from '../components/ui/textarea';
import html2pdf from 'html2pdf.js';

function HistoryPage() {
  const [assessments, setAssessments] = useState([]);
  const [emailTemplates, setEmailTemplates] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [generatedEmail, setGeneratedEmail] = useState('');
  const [copyButtonText, setCopyButtonText] = useState('Копировать');
  const [currentQuestions, setCurrentQuestions] = useState([]);

  useEffect(() => {
    const savedAssessments = getFromLocalStorage('assessments', []);
    setAssessments(savedAssessments);
    const savedTemplates = getFromLocalStorage('emailTemplates', { positive: '', negative: '' });
    setEmailTemplates(savedTemplates);
    const savedQuestions = getFromLocalStorage('customQuestions', []);
    const combinedQuestions = [...defaultQuestions, ...savedQuestions];
    setCurrentQuestions(combinedQuestions);
  }, []);

  const generateEmail = (score) => {
    let template = '';
    const scoreText = `Итоговый балл: ${score}`;
    
    if (score >= 50) {
      template = emailTemplates.positive || 'Шаблон положительной оценки не найден.';
    } else {
      template = emailTemplates.negative || 'Шаблон отрицательной оценки не найден.';
    }

    const finalEmail = template.replace('[ИТОГОВЫЙ_БАЛЛ]', scoreText);
    setGeneratedEmail(finalEmail);
    setOpenDialog(true);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(generatedEmail)
      .then(() => {
        setCopyButtonText('Скопировано!');
        setTimeout(() => setCopyButtonText('Копировать'), 2000);
      })
      .catch(err => {
        console.error('Не удалось скопировать текст: ', err);
      });
  };

  const handleDeleteAssessment = (index) => {
    const isConfirmed = window.confirm('Вы уверены, что хотите удалить эту оценку?');
    if (isConfirmed) {
      const updatedAssessments = assessments.filter((_, i) => i !== index);
      saveToLocalStorage('assessments', updatedAssessments);
      setAssessments(updatedAssessments);
    }
  };

  const generatePDF = (assessment) => {
    const element = document.createElement('div');
    element.className = 'p-6 bg-white';
    element.innerHTML = `
      <h1 class="text-3xl font-bold mb-4">Отчет по оценке кандидата</h1>
      <p class="mb-2"><strong>Дата:</strong> ${new Date(assessment.date).toLocaleDateString()}</p>
      <p class="mb-4"><strong>Итоговый балл:</strong> ${assessment.score}</p>
      <h2 class="text-2xl font-semibold mb-4">Детали оценки</h2>
      ${currentQuestions.map(q => {
        const assessmentItem = assessment.data[q.id] || {};
        return `
          <div class="mb-4 p-3 border rounded-md">
            <p class="font-medium">${q.text}</p>
            <p class="text-sm text-gray-700 mt-1">Балл: ${assessmentItem.score || 'Не указан'}</p>
            <p class="text-sm text-gray-700">Комментарий: ${assessmentItem.comment || 'Нет'}</p>
          </div>
        `;
      }).join('')}
    `;

    const opt = {
      margin:       1,
      filename:     `отчет-оценка-${new Date(assessment.date).toLocaleDateString()}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    
    html2pdf().from(element).set(opt).save();
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">История оценок</h1>
      {assessments.length > 0 ? (
        <Accordion type="single" collapsible className="w-full space-y-4">
          {assessments.map((assessment, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border rounded-md shadow-sm">
              <AccordionTrigger className="p-4">
                <div className="flex justify-between items-center w-full">
                  <div className="flex flex-col text-left">
                    <span className="font-semibold">Оценка #{index + 1}</span>
                    <span className="text-sm text-gray-600">Дата: {new Date(assessment.date).toLocaleDateString()}</span>
                  </div>
                  <Badge variant="secondary" className="text-base py-1 px-4">
                    Балл: {assessment.score}
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-4 bg-gray-50 border-t">
                <div className="space-y-4 mb-4">
                  {currentQuestions.map(question => {
                    const assessmentItem = assessment.data[question.id] || {};
                    return (
                      <Card key={question.id} className="p-3">
                        <CardContent className="p-0">
                          <p className="font-medium">{question.text}</p>
                          <p className="text-sm text-gray-700 mt-1">
                            Балл: {assessmentItem.score || 'Не указан'} / Комментарий: {assessmentItem.comment || 'Нет'}
                          </p>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
                <div className="flex space-x-2 mt-4">
                  <Button onClick={() => generateEmail(assessment.score)}>
                    Сгенерировать письмо
                  </Button>
                  <Button onClick={() => handleDeleteAssessment(index)} variant="destructive">
                    Удалить оценку
                  </Button>
                  <Button onClick={() => generatePDF(assessment)} variant="secondary">
                    Скачать PDF
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <p className="text-gray-500">Пока нет сохраненных оценок.</p>
      )}

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Сгенерированное письмо</DialogTitle>
            <DialogDescription>
              Текст письма, готовый для отправки.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={generatedEmail}
            readOnly
            rows="10"
          />
          <DialogFooter>
            <Button onClick={handleCopyEmail}>
              {copyButtonText}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default HistoryPage;
