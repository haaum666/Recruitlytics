import React, { useState, useEffect } from 'react';
import { getFromLocalStorage, saveToLocalStorage } from '../services/localStorageService.js';
import { Card, CardContent, CardHeader } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../components/ui/accordion';
import { questions as defaultQuestions } from '../config/questions.js';
import { Button } from '../components/ui/button';
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
  const [openCoverLetterDialog, setOpenCoverLetterDialog] = useState(false);
  const [generatedCoverLetter, setGeneratedCoverLetter] = useState('');
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

  const generateCoverLetter = (assessment) => {
    const { candidate, data } = assessment;
    
    const briefProfileNotes = currentQuestions.map(q => {
        const item = data[q.id];
        return item && item.comment ? `- ${item.comment}` : '';
    }).filter(note => note).join('\n');

    const template = `Вакансия: ${candidate.role || '[Название вакансии]'}
Кандидат: ${candidate.firstName || ''} ${candidate.lastName || ''}
Итоговый балл: ${assessment.score} (по 10-балльной взвешенной шкале)

---

**Краткое описание методологии оценки:**
Оценка кандидата производилась по взвешенной системе, где каждый критерий имеет свой "вес" в зависимости от его важности для вакансии. Итоговый балл является взвешенным средним от всех оценок и отражает процент соответствия кандидата всем ключевым требованиям, с учетом их приоритетности.

---

Локация проживания: ${candidate.location || '[Город]'}
Ожидания по зарплате: от ${candidate.salaryMin || '0'} до ${candidate.salaryMax || '0'} руб.
Телефон: ${candidate.phone || ''}
Мессенджер: ${candidate.messenger || ''}

Краткий профиль кандидата:
${briefProfileNotes || '[Нет комментариев]'}.

Сильные стороны кандидата:
[Навык 1 — кратко]
[Навык 2 — кратко]
[Подход / опыт в команде / продуктовый фокус]

Потенциальные зоны внимания:
[Если есть что-то, что нужно учитывать — нестабильная работа, переезд, низкий опыт в чём-то, но компенсируемый другим.]

Комментарий по мотивации:
[Почему рассматривает вакансию, что ищет, какие задачи интересны.]
    `;
    setGeneratedCoverLetter(template);
    setOpenCoverLetterDialog(true);
  };

  const handleCopy = (text, setButtonText) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setButtonText('Скопировано!');
        setTimeout(() => setButtonText('Копировать'), 2000);
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
      <p class="mb-2"><strong>ФИО:</strong> ${assessment.candidate.firstName} ${assessment.candidate.lastName}</p>
      <p class="mb-2"><strong>Позиция:</strong> ${assessment.candidate.role}</p>
      <p class="mb-2"><strong>Возраст:</strong> ${assessment.candidate.age || 'не указан'}</p>
      <p class="mb-2"><strong>Локация:</strong> ${assessment.candidate.location || 'не указана'}</p>
      <p class="mb-2"><strong>ЗП:</strong> от ${assessment.candidate.salaryMin || '0'} до ${assessment.candidate.salaryMax || '0'} руб.</p>
      <p class="mb-2"><strong>Телефон:</strong> ${assessment.candidate.phone || 'не указан'}</p>
      <p class="mb-2"><strong>Мессенджер:</strong> ${assessment.candidate.messenger || 'не указан'}</p>
      <p class="mb-2"><strong>Дата оценки:</strong> ${new Date(assessment.date).toLocaleDateString()}</p>
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
      filename:     `отчет-оценка-${assessment.candidate.lastName || ''}-${new Date(assessment.date).toLocaleDateString()}.pdf`,
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
                    <span className="font-semibold">{assessment.candidate.firstName} {assessment.candidate.lastName}</span>
                    <span className="text-sm text-gray-600">Дата: {new Date(assessment.date).toLocaleDateString()}</span>
                  </div>
                  <Badge variant="secondary" className="text-base py-1 px-4">
                    Балл: {parseFloat(assessment.score).toFixed(2)}
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-4 bg-gray-50 border-t">
                <div className="mb-4 space-y-2">
                  <p><strong>Позиция:</strong> {assessment.candidate.role}</p>
                  <p><strong>Возраст:</strong> {assessment.candidate.age || 'не указан'}</p>
                  <p><strong>Локация:</strong> {assessment.candidate.location || 'не указана'}</p>
                  <p><strong>ЗП:</strong> от {assessment.candidate.salaryMin || '0'} до {assessment.candidate.salaryMax || '0'} руб.</p>
                  <p><strong>Телефон:</strong> {assessment.candidate.phone || 'не указан'}</p>
                  <p><strong>Мессенджер:</strong> {assessment.candidate.messenger || 'не указан'}</p>
                </div>
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
                  <Button onClick={() => generatePDF(assessment)} variant="secondary">
                    Скачать PDF
                  </Button>
                  <Button onClick={() => generateCoverLetter(assessment)} variant="outline">
                    Сопроводительное письмо
                  </Button>
                  <Button onClick={() => handleDeleteAssessment(index)} variant="destructive">
                    Удалить оценку
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
            <Button onClick={() => handleCopy(generatedEmail, setCopyButtonText)}>
              {copyButtonText}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={openCoverLetterDialog} onOpenChange={setOpenCoverLetterDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Сгенерированное сопроводительное письмо</DialogTitle>
            <DialogDescription>
              Текст, который можно использовать для отчета. Части в скобках нужно заполнить вручную.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={generatedCoverLetter}
            readOnly
            rows="15"
          />
          <DialogFooter>
            <Button onClick={() => handleCopy(generatedCoverLetter, setCopyButtonText)}>
              {copyButtonText}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}

export default HistoryPage;
