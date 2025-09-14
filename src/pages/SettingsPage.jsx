import React, { useState, useEffect } from 'react';
import { getFromLocalStorage, saveToLocalStorage } from '../services/localStorageService.js';
import { Card, CardContent } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { questions as defaultQuestions } from '../config/questions.js';

function SettingsPage() {
  const [customQuestions, setCustomQuestions] = useState([]);
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newQuestionWeight, setNewQuestionWeight] = useState(1);
  const [emailTemplates, setEmailTemplates] = useState({ positive: '', negative: '' });

  useEffect(() => {
    const savedQuestions = getFromLocalStorage('customQuestions', []);
    setCustomQuestions(savedQuestions);
    const savedTemplates = getFromLocalStorage('emailTemplates', { positive: '', negative: '' });
    setEmailTemplates(savedTemplates);
  }, []);

  const handleAddQuestion = () => {
    if (newQuestionText.trim() !== '') {
      const weight = Math.max(1, Math.min(10, Number(newQuestionWeight)));
      const newQuestion = {
        id: Date.now(),
        text: newQuestionText,
        weight: weight,
      };
      const updatedQuestions = [...customQuestions, newQuestion];
      setCustomQuestions(updatedQuestions);
      saveToLocalStorage('customQuestions', updatedQuestions);
      setNewQuestionText('');
      setNewQuestionWeight(1);
    }
  };

  const handleDeleteQuestion = (id) => {
    const updatedQuestions = customQuestions.filter(q => q.id !== id);
    setCustomQuestions(updatedQuestions);
    saveToLocalStorage('customQuestions', updatedQuestions);
  };

  const handleTemplateChange = (type, value) => {
    const updatedTemplates = { ...emailTemplates, [type]: value };
    setEmailTemplates(updatedTemplates);
    saveToLocalStorage('emailTemplates', updatedTemplates);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Настройки</h1>

      {/* Управление вопросами */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <h2 className="text-xl font-semibold mb-4">Управление вопросами</h2>
          <div className="space-y-4">
            {defaultQuestions.map(q => (
              <div key={q.id} className="flex items-center justify-between p-3 border rounded-md bg-gray-100">
                <span>{q.text} ({q.weight} баллов)</span>
                <span className="text-sm text-gray-500">По умолчанию</span>
              </div>
            ))}
            {customQuestions.map(q => (
              <div key={q.id} className="flex items-center justify-between p-3 border rounded-md">
                <span>{q.text} ({q.weight} баллов)</span>
                <Button onClick={() => handleDeleteQuestion(q.id)} variant="destructive" size="sm">
                  Удалить
                </Button>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <div className="flex-grow">
              <Label htmlFor="new-question">Новый вопрос</Label>
              <Input
                id="new-question"
                value={newQuestionText}
                onChange={(e) => setNewQuestionText(e.target.value)}
                placeholder="Например: 'Опыт работы с микросервисами'"
              />
            </div>
            <div className="w-24">
              <Label htmlFor="new-question-weight">Вес (1-10)</Label>
              <Input
                id="new-question-weight"
                type="number"
                min="1"
                max="10"
                value={newQuestionWeight}
                onChange={(e) => setNewQuestionWeight(e.target.value)}
              />
            </div>
            <Button onClick={handleAddQuestion} className="mt-auto">
              Добавить
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Настройка шаблонов писем */}
      <Card>
        <CardContent className="pt-6">
          <h2 className="text-xl font-semibold mb-4">Шаблоны писем</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="positive-template">Положительный шаблон</Label>
              <Input
                id="positive-template"
                value={emailTemplates.positive}
                onChange={(e) => handleTemplateChange('positive', e.target.value)}
                placeholder="[ИМЯ_КАНДИДАТА], мы готовы сделать вам предложение! [ИТОГОВЫЙ_БАЛЛ]"
              />
            </div>
            <div>
              <Label htmlFor="negative-template">Отрицательный шаблон</Label>
              <Input
                id="negative-template"
                value={emailTemplates.negative}
                onChange={(e) => handleTemplateChange('negative', e.target.value)}
                placeholder="[ИМЯ_КАНДИДАТА], к сожалению, мы не готовы сделать предложение. [ИТОГОВЫЙ_БАЛЛ]"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default SettingsPage;
