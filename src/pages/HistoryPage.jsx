import React, { useState, useEffect } from 'react';
import { getFromLocalStorage, saveToLocalStorage } from '../services/localStorageService.js';
import { Card, CardContent } from '../components/ui/card';
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
import { positiveFeedbackTemplate, negativeFeedbackTemplate } from '../config/templates.js';
import { Checkbox } from '../components/ui/checkbox';
import { Label } from '../components/ui/label';

function HistoryPage({ onEdit }) {
  const [assessments, setAssessments] = useState([]);
  const [openFeedbackDialog, setOpenFeedbackDialog] = useState(false);
  const [openEmailDialog, setOpenEmailDialog] = useState(false);
  const [openSelectionDialog, setOpenSelectionDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openCoverLetterDialog, setOpenCoverLetterDialog] = useState(false);
  const [generatedEmail, setGeneratedEmail] = useState('');
  const [generatedCoverLetter, setGeneratedCoverLetter] = useState('');
  const [currentAssessment, setCurrentAssessment] = useState(null);
  const [feedbackType, setFeedbackType] = useState(null);
  const [selectedItems, setSelectedItems] = useState({ strengths: false, weaknesses: false, motivation: false });
  const [copyButtonText, setCopyButtonText] = useState('Копировать');
  
  useEffect(() => {
    const savedAssessments = getFromLocalStorage('assessments', []);
    setAssessments(savedAssessments);
  }, []);

  const getAssessmentQuestions = (assessment) => {
    if (assessment.questions) {
      return assessment.questions;
    }

    const savedCustomQuestions = getFromLocalStorage('customQuestions', []);
    const savedModifiedDefaultQuestions = getFromLocalStorage('modifiedDefaultQuestions', []);

    const mergedQuestions = defaultQuestions.map(defaultQ => {
      const modified = savedModifiedDefaultQuestions.find(modQ => modQ.id === defaultQ.id);
      return modified || defaultQ;
    });

    return [...mergedQuestions, ...savedCustomQuestions];
  };

  const openFeedbackOptions = (assessment) => {
    setCurrentAssessment(assessment);
    setOpenFeedbackDialog(true);
  };

  const handleTypeSelection = (type) => {
    setFeedbackType(type);
    setOpenFeedbackDialog(false);
    setOpenSelectionDialog(true);
  };

  const handleSelectionChange = (item) => {
    setSelectedItems(prev => ({ ...prev, [item]: !prev[item] }));
  };

  const handleGenerateEmail = () => {
    const { candidate, strengths, weaknesses, motivation } = currentAssessment;
    const feedbackParts = [];

    if (selectedItems.strengths && strengths) {
      feedbackParts.push(`Особенно хотели бы отметить: ${strengths}`);
    }
    if (selectedItems.weaknesses && weaknesses) {
      feedbackParts.push(`Мы также обратили внимание на: ${weaknesses}`);
    }
    if (selectedItems.motivation && motivation) {
      feedbackParts.push(`Что касается мотивации кандидата: ${motivation}`);
    }

    const body = feedbackParts.join('\n\n');
    
    let templateFunction = feedbackType === 'positive' ? positiveFeedbackTemplate : negativeFeedbackTemplate;

    const finalEmail = templateFunction(body)
      .replace('[ИМЯ_КАНДИДАТА]', `${candidate.firstName || ''} ${candidate.lastName || ''}`.trim())
      .replace('[ВАКАНСИЯ]', `${candidate.role || 'не указана'}`.trim());

    setGeneratedEmail(finalEmail);
    setOpenSelectionDialog(false);
    setOpenEmailDialog(true);
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopyButtonText('Скопировано!');
        setTimeout(() => setCopyButtonText('Копировать'), 2000);
      })
      .catch(err => {
        console.error('Не удалось скопировать текст: ', err);
      });
  };

  const handleEditAssessment = (assessment) => {
    onEdit(assessment);
  };

  const handleDeleteAssessment = (id) => {
    setCurrentAssessment({ id });
    setOpenDeleteDialog(true);
  };
  
  const confirmDelete = () => {
    const updatedAssessments = assessments.filter(assessment => assessment.id !== currentAssessment.id);
    saveToLocalStorage('assessments', updatedAssessments);
    setAssessments(updatedAssessments);
    setOpenDeleteDialog(false);
  };

  const generatePDF = (assessment) => {
    const questionsToUse = getAssessmentQuestions(assessment);
    const element = document.createElement('div');
    element.className = 'p-6 bg-white';
    element.innerHTML = `
      <h1 class="text-3xl font-bold mb-4">Отчет по оценке кандидата</h1>
      <p class="mb-2"><strong>ФИО:</strong> ${assessment.candidate.firstName} ${assessment.candidate.lastName}</p>
      <p class="mb-2"><strong>Позиция:</strong> ${assessment.candidate.role}</p>
      <p class="mb-2"><strong>Возраст:</strong> ${assessment.candidate.age || 'не указан'}</p>
      <p class="mb-2"><strong>Локация:</strong> ${assessment.candidate.location || 'не указана'}</p>
      <p class="mb-2"><strong>ЗП:</strong> ${assessment.candidate.salary || 'не указана'}</p>
      <p class="mb-2"><strong>Телефон:</strong> ${assessment.candidate.phone || 'не указан'}</p>
      <p class="mb-2"><strong>Мессенджер:</strong> ${assessment.candidate.messenger || 'не указан'}</p>
      <p class="mb-2"><strong>Дата оценки:</strong> ${new Date(assessment.date).toLocaleDateString()}</p>
      <p class="mb-4"><strong>Итоговый балл:</strong> ${assessment.score}</p>
      
      <h2 class="text-2xl font-semibold mb-4">Детали оценки</h2>
      ${questionsToUse.map(q => {
        const assessmentItem = assessment.data[q.id] || {};
        return `
          <div class="mb-4 p-3 border rounded-md">
            <p class="font-medium">${q.text}</p>
            <p class="text-sm text-gray-700 mt-1">Балл: ${assessmentItem.score || 'Не указан'}</p>
            <p class="text-sm text-gray-700">Комментарий: ${assessmentItem.comment || 'Нет'}</p>
          </div>
        `;
      }).join('')}
      
      <h2 class="text-2xl font-semibold mb-4">Профиль кандидата</h2>
      <div class="mb-4 p-3 border rounded-md">
        <p class="font-medium">Сильные стороны кандидата:</p>
        <p class="text-sm text-gray-700 mt-1">${assessment.strengths || 'Не заполнено'}</p>
      </div>
      <div class="mb-4 p-3 border rounded-md">
        <p class="font-medium">Потенциальные зоны внимания:</p>
        <p class="text-sm text-gray-700 mt-1">${assessment.weaknesses || 'Не заполнено'}</p>
      </div>
      <div class="mb-4 p-3 border rounded-md">
        <p class="font-medium">Комментарий по мотивации:</p>
        <p class="text-sm text-gray-700 mt-1">${assessment.motivation || 'Не заполнено'}</p>
      </div>
    `;

    const opt = {
      margin: 1,
      filename: `отчет-оценка-${assessment.candidate.lastName || ''}-${new Date(assessment.date).toLocaleDateString()}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    
    html2pdf().from(element).set(opt).save();
  };

  const generateCoverLetter = (assessment) => {
    setCurrentAssessment(assessment);
    const { candidate, score, strengths, weaknesses, motivation, data } = assessment;
    const questionsToUse = getAssessmentQuestions(assessment);

    const detailedAssessment = questionsToUse.map(question => {
        const assessmentItem = data[question.id] || {};
        const scoreValue = assessmentItem.score || 'Не указан';
        const commentValue = assessmentItem.comment || 'Нет комментария';
        return `${question.text} – ${scoreValue}/10 (${commentValue})`;
    }).join(', ');
    
    const letterContent = `
**Кандидат**: ${candidate.firstName || ''} ${candidate.lastName || ''} на позицию ${candidate.role || 'не указана'}
**Возраст**: ${candidate.age || 'не указан'}
**Локация**: ${candidate.location || 'не указана'}
**Ожидания по ЗП**: ${candidate.salary || 'не указаны'}
**Телефон**: ${candidate.phone || 'не указан'}
**Мессенджер**: ${candidate.messenger || 'не указан'}
---
**Общий балл**: ${score} / 10 (максимальная оценка)
*Баллы рассчитываются как взвешенная оценка по ключевым компетенциям кандидата.*
**Детали оценки**: ${detailedAssessment}
---
**Профиль кандидата**:
**Сильные стороны**: ${strengths || 'Не заполнено'}
**Потенциальные зоны внимания**: ${weaknesses || 'Не заполнено'}
**Мотивация**: ${motivation || 'Не заполнено'}
    `.trim();

    setGeneratedCoverLetter(letterContent);
    setOpenCoverLetterDialog(true);
  };
  
  const downloadCoverLetterPDF = (assessment) => {
    const { candidate, score, strengths, weaknesses, motivation, data } = assessment;
    const questionsToUse = getAssessmentQuestions(assessment);

    const detailedAssessment = questionsToUse.map(question => {
        const assessmentItem = data[question.id] || {};
        const scoreValue = assessmentItem.score || 'Не указан';
        const commentValue = assessmentItem.comment || 'Нет комментария';
        return `
          <p style="margin: 0; padding: 0;"><b>${question.text}</b> - ${scoreValue}/10 (${commentValue})</p>
        `;
    }).join('');

    const element = document.createElement('div');
    element.innerHTML = `
      <style>
        body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }
        h2 { font-size: 18px; font-weight: bold; margin-bottom: 5px; }
        .info-block p { margin: 0 0 5px 0; }
        .profile-block p { margin: 0 0 5px 0; }
        hr { margin: 10px 0; border: 0; border-top: 1px solid #ccc; }
      </style>
      <div style="padding: 20px;">
        <div class="info-block">
          <h2>Кандидат:</h2>
          <p><b>ФИО:</b> ${candidate.firstName || ''} ${candidate.lastName || ''}</p>
          <p><b>Позиция:</b> ${candidate.role || 'не указана'}</p>
          <p><b>Возраст:</b> ${candidate.age || 'не указан'}</p>
          <p><b>Локация:</b> ${candidate.location || 'не указана'}</p>
          <p><b>ЗП:</b> ${candidate.salary || 'не указана'}</p>
          <p><b>Телефон:</b> ${candidate.phone || 'не указан'}</p>
          <p><b>Мессенджер:</b> ${candidate.messenger || 'не указан'}</p>
        </div>
        
        <hr>

        <div class="info-block">
          <h2>Общий балл:</h2>
          <p><b>${score} / 10</b> (максимальная оценка)</p>
          <p style="font-style: italic; margin-top: 5px;">Баллы рассчитываются как взвешенная оценка по ключевым компетенциям кандидата.</p>
        </div>
        
        <div class="profile-block">
          <h2>Детали оценки:</h2>
          ${detailedAssessment}
        </div>
        
        <hr>

        <div class="profile-block">
          <h2>Профиль кандидата:</h2>
          <p><b>Сильные стороны:</b> ${strengths || 'Не заполнено'}</p>
          <p><b>Потенциальные зоны внимания:</b> ${weaknesses || 'Не заполнено'}</p>
          <p><b>Мотивация:</b> ${motivation || 'Не заполнено'}</p>
        </div>
      </div>
    `;
    
    const opt = {
      margin: 1,
      filename: `сопроводительное-письмо-${candidate.lastName || ''}-${new Date(assessment.date).toLocaleDateString()}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    
    html2pdf().from(element).set(opt).save();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 dark:text-gray-200">
      <h1 className="text-3xl font-bold mb-6 dark:text-white">История оценок</h1>
      {assessments.length > 0 ? (
        <Accordion type="single" collapsible className="w-full space-y-4">
          {assessments.map((assessment) => {
            const questionsToUse = getAssessmentQuestions(assessment);
            return (
              <AccordionItem key={assessment.id} value={assessment.id} className="border rounded-lg shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
                <AccordionTrigger className="p-4 rounded-t-lg transition-colors duration-200 hover:bg-gray-100 data-[state=open]:bg-gray-100 dark:bg-zinc-800 dark:text-gray-200 dark:hover:bg-zinc-700 dark:data-[state=open]:bg-zinc-700">
                  <div className="flex justify-between items-center w-full">
                    <div className="flex flex-col text-left">
                      <span className="font-semibold dark:text-white">{assessment.candidate.firstName} {assessment.candidate.lastName}</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Дата: {new Date(assessment.date).toLocaleDateString()}</span>
                    </div>
                    <Badge variant="secondary" className="text-base py-1 px-4 dark:bg-zinc-700 dark:text-gray-200">
                      Балл: {parseFloat(assessment.score).toFixed(2)}
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-4 bg-gray-50 border-t dark:bg-zinc-800 dark:border-zinc-700 dark:text-gray-200">
                  <div className="mb-4 space-y-2">
                    <p className="dark:text-gray-200"><strong>Позиция:</strong> {assessment.candidate.role}</p>
                    <p className="dark:text-gray-200"><strong>Возраст:</strong> {assessment.candidate.age || 'не указан'}</p>
                    <p className="dark:text-gray-200"><strong>Локация:</strong> {assessment.candidate.location || 'не указана'}</p>
                    <p className="dark:text-gray-200"><strong>ЗП:</strong> {assessment.candidate.salary || 'не указана'}</p>
                    <p className="dark:text-gray-200"><strong>Телефон:</strong> {assessment.candidate.phone || 'не указан'}</p>
                    <p className="dark:text-gray-200"><strong>Мессенджер:</strong> {assessment.candidate.messenger || 'не указан'}</p>
                  </div>
                  <div className="space-y-4 mb-4">
                    <h3 className="font-bold text-lg dark:text-white">Детали оценки</h3>
                    {questionsToUse.map(question => {
                      const assessmentItem = assessment.data[question.id] || {};
                      return (
                        <Card key={question.id} className="p-3 dark:bg-zinc-800 dark:border-zinc-700">
                          <CardContent className="p-0">
                            <p className="font-medium dark:text-white">{question.text}</p>
                            <p className="text-sm text-gray-700 mt-1 dark:text-gray-400">
                              Балл: {assessmentItem.score || 'Не указан'} / Комментарий: {assessmentItem.comment || 'Нет'}
                            </p>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                  <div className="space-y-4 mb-4">
                    <h3 className="font-bold text-lg dark:text-white">Профиль кандидата</h3>
                    {assessment.strengths && (
                      <Card className="p-3 dark:bg-zinc-800 dark:border-zinc-700">
                        <CardContent className="p-0">
                          <p className="font-medium dark:text-white">Сильные стороны:</p>
                          <p className="text-sm text-gray-700 mt-1 dark:text-gray-400">{assessment.strengths}</p>
                        </CardContent>
                      </Card>
                    )}
                    {assessment.weaknesses && (
                      <Card className="p-3 dark:bg-zinc-800 dark:border-zinc-700">
                        <CardContent className="p-0">
                          <p className="font-medium dark:text-white">Потенциальные зоны внимания:</p>
                          <p className="text-sm text-gray-700 mt-1 dark:text-gray-400">{assessment.weaknesses}</p>
                        </CardContent>
                      </Card>
                    )}
                    {assessment.motivation && (
                      <Card className="p-3 dark:bg-zinc-800 dark:border-zinc-700">
                        <CardContent className="p-0">
                          <p className="font-medium dark:text-white">Комментарий по мотивации:</p>
                          <p className="text-sm text-gray-700 mt-1 dark:text-gray-400">{assessment.motivation}</p>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    <Button onClick={() => handleEditAssessment(assessment)} className="dark:bg-zinc-700 dark:text-gray-200 dark:hover:bg-zinc-600">
                      Редактировать
                    </Button>
                    <Button onClick={() => openFeedbackOptions(assessment)} className="dark:bg-zinc-700 dark:text-gray-200 dark:hover:bg-zinc-600">
                      Обратная связь для кандидата
                    </Button>
                    <Button onClick={() => generateCoverLetter(assessment)} variant="outline" className="dark:bg-zinc-700 dark:text-gray-200 dark:hover:bg-zinc-600 dark:border-zinc-600">
                      Сопроводительное письмо
                    </Button>
                    <Button onClick={() => handleDeleteAssessment(assessment.id)} variant="destructive">
                      Удалить оценку
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      ) : (
        <p className="text-gray-500 dark:text-gray-400">Пока нет сохраненных оценок.</p>
      )}

      {/* Диалог выбора обратной связи */}
      <Dialog open={openFeedbackDialog} onOpenChange={setOpenFeedbackDialog}>
        <DialogContent className="dark:bg-zinc-800 dark:text-gray-200">
          <DialogHeader>
            <DialogTitle className="dark:text-white">Выберите тип обратной связи</DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              На основе вашего выбора будет предложен список пунктов.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center space-x-4 p-4">
            <Button onClick={() => handleTypeSelection('positive')} className="dark:bg-zinc-700 dark:text-gray-200 dark:hover:bg-zinc-600">
              Положительная
            </Button>
            <Button onClick={() => handleTypeSelection('negative')} className="dark:bg-zinc-700 dark:text-gray-200 dark:hover:bg-zinc-600">
              Отрицательная
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Диалог выбора пунктов для письма */}
      <Dialog open={openSelectionDialog} onOpenChange={setOpenSelectionDialog}>
        <DialogContent className="dark:bg-zinc-800 dark:text-gray-200">
          <DialogHeader>
            <DialogTitle className="dark:text-white">Выберите пункты для письма</DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              Отметьте, какие комментарии вы хотите включить в письмо.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 p-4">
            {currentAssessment?.strengths && (
              <div className="flex items-center space-x-2">
                <Checkbox id="strengths" name="strengths" checked={selectedItems.strengths} onCheckedChange={() => handleSelectionChange('strengths')} className="dark:border-zinc-700 data-[state=checked]:dark:bg-zinc-600 data-[state=checked]:dark:text-gray-200" />
                <Label htmlFor="strengths" className="dark:text-gray-300">Сильные стороны</Label>
              </div>
            )}
            {currentAssessment?.weaknesses && (
              <div className="flex items-center space-x-2">
                <Checkbox id="weaknesses" name="weaknesses" checked={selectedItems.weaknesses} onCheckedChange={() => handleSelectionChange('weaknesses')} className="dark:border-zinc-700 data-[state=checked]:dark:bg-zinc-600 data-[state=checked]:dark:text-gray-200" />
                <Label htmlFor="weaknesses" className="dark:text-gray-300">Потенциальные зоны внимания</Label>
              </div>
            )}
            {currentAssessment?.motivation && (
              <div className="flex items-center space-x-2">
                <Checkbox id="motivation" name="motivation" checked={selectedItems.motivation} onCheckedChange={() => handleSelectionChange('motivation')} className="dark:border-zinc-700 data-[state=checked]:dark:bg-zinc-600 data-[state=checked]:dark:text-gray-200" />
                <Label htmlFor="motivation" className="dark:text-gray-300">Комментарий по мотивации</Label>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button onClick={handleGenerateEmail} disabled={Object.values(selectedItems).every(item => !item)} className="dark:bg-zinc-700 dark:text-gray-200 dark:hover:bg-zinc-600">
              Сформировать письмо
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Диалог сгенерированного письма */}
      <Dialog open={openEmailDialog} onOpenChange={setOpenEmailDialog}>
        <DialogContent className="dark:bg-zinc-800 dark:text-gray-200">
          <DialogHeader>
            <DialogTitle className="dark:text-white">Сгенерированное письмо</DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              Текст письма, готовый для отправки.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={generatedEmail}
            readOnly
            rows="10"
            className="dark:bg-zinc-900 dark:text-gray-200 dark:border-zinc-700"
          />
          <DialogFooter>
            <Button onClick={() => handleCopy(generatedEmail)} className="dark:bg-zinc-700 dark:text-gray-200 dark:hover:bg-zinc-600">
              {copyButtonText}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Диалог подтверждения удаления */}
      <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <DialogContent className="dark:bg-zinc-800 dark:text-gray-200">
          <DialogHeader>
            <DialogTitle className="dark:text-white">Подтверждение удаления</DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              Вы уверены, что хотите удалить эту оценку?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setOpenDeleteDialog(false)} variant="outline">Отмена</Button>
            <Button onClick={confirmDelete} variant="destructive">Удалить</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Диалог для сопроводительного письма */}
      <Dialog open={openCoverLetterDialog} onOpenChange={setOpenCoverLetterDialog}>
        <DialogContent className="dark:bg-zinc-800 dark:text-gray-200">
          <DialogHeader>
            <DialogTitle className="dark:text-white">Сопроводительное письмо</DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              Текст сопроводительного письма.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={generatedCoverLetter}
            readOnly
            rows="10"
            className="dark:bg-zinc-900 dark:text-gray-200 dark:border-zinc-700"
          />
          <DialogFooter>
            <Button onClick={() => downloadCoverLetterPDF(currentAssessment)} variant="secondary">
              Скачать PDF
            </Button>
            <Button onClick={() => handleCopy(generatedCoverLetter)}>
              {copyButtonText}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default HistoryPage;
