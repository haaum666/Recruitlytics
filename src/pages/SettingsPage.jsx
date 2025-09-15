import React, { useState, useEffect } from 'react';
import { getFromLocalStorage, saveToLocalStorage } from '../services/localStorageService.js';
import { Card, CardContent } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea'; // Добавил Textarea
import { questions as defaultQuestions } from '../config/questions.js';

function SettingsPage() {
  const [allQuestions, setAllQuestions] = useState([]);
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newQuestionWeight, setNewQuestionWeight] = useState(1);
  const [editingQuestionId, setEditingQuestionId] = useState(null);
  const [emailTemplates, setEmailTemplates] = useState({ positive: '', negative: '' });

  useEffect(() => {
    const savedCustomQuestions = getFromLocalStorage('customQuestions', []);
    const savedModifiedDefaultQuestions = getFromLocalStorage('modifiedDefaultQuestions', []);

    const mergedDefaultQuestions = defaultQuestions.map(defaultQ => {
      const modified = savedModifiedDefaultQuestions.find(modQ => modQ.id === defaultQ.id);
      return modified || defaultQ;
    });

    const combinedQuestions = [
      ...mergedDefaultQuestions,
      ...savedCustomQuestions
    ];
    setAllQuestions(combinedQuestions);
    const savedTemplates = getFromLocalStorage('emailTemplates', { positive: '', negative: '' });
    setEmailTemplates(savedTemplates);
  }, []);

  const handleEditClick = (question) => {
    setNewQuestionText(question.text);
    setNewQuestionWeight(question.weight);
    setEditingQuestionId(question.id);
  };

  const handleAddOrUpdateQuestion = () => {
    if (newQuestionText.trim() !== '') {
      let updatedQuestions;
      if (editingQuestionId) {
        updatedQuestions = allQuestions.map(q =>
          q.id === editingQuestionId
            ? { ...q, text: newQuestionText, weight: Number(newQuestionWeight) }
            : q
        );
      } else {
        const newQuestion = {
          id: Date.now(),
          text: newQuestionText,
          weight: Number(newQuestionWeight),
        };
        updatedQuestions = [...allQuestions, newQuestion];
      }
      setAllQuestions(updatedQuestions);

      const modifiedDefaultQuestions = updatedQuestions.filter(q =>
        defaultQuestions.some(defaultQ => defaultQ.id === q.id)
      );
      saveToLocalStorage('modifiedDefaultQuestions', modifiedDefaultQuestions);

      const customQuestionsToSave = updatedQuestions.filter(q => !defaultQuestions.some(defaultQ => defaultQ.id === q.id));
      saveToLocalStorage('customQuestions', customQuestionsToSave);
      
      setEditingQuestionId(null);
      setNewQuestionText('');
      setNewQuestionWeight(1);
    }
  };

  const handleDeleteQuestion = (id) => {
    const updatedQuestions = allQuestions.filter(q => q.id !== id);
    setAllQuestions(updatedQuestions);
    const customQuestionsToSave = updatedQuestions.filter(q => !defaultQuestions.some(defaultQ => defaultQ.id === q.id));
    saveToLocalStorage('customQuestions', customQuestionsToSave);
  };

  const handleTemplateChange = (type, value) => {
    const updatedTemplates = { ...emailTemplates, [type]: value };
    setEmailTemplates(updatedTemplates);
    saveToLocalStorage('emailTemplates', updatedTemplates);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold mb-6">Настройки</h1>

      {/* Управление вопросами */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <h2 className="text-xl font-semibold mb-4">Управление вопросами</h2>
          <div className="space-y-4">
            {allQuestions.map(q => (
              <div key={q.id} className="flex items-center justify-between p-3 border rounded-md">
                <span>{q.text} ({q.weight} баллов)</span>
                <div className="space-x-2">
                  <Button onClick={() => handleEditClick(q)} variant="outline" size="sm">
                    Редактировать
                  </Button>
                  {defaultQuestions.every(defaultQ => defaultQ.id !== q.id) && (
                    <Button onClick={() => handleDeleteQuestion(q.id)} variant="destructive" size="sm">
                      Удалить
                    </Button>
                  )}
                </div>
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
            <Button onClick={handleAddOrUpdateQuestion} className="mt-auto">
              {editingQuestionId ? 'Сохранить' : 'Добавить'}
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
              <Textarea // Заменено на Textarea
                id="positive-template"
                value={emailTemplates.positive}
                onChange={(e) => handleTemplateChange('positive', e.target.value)}
                placeholder="[ИМЯ_КАНДИДАТА], мы готовы сделать вам предложение! [ИТОГОВЫЙ_БАЛЛ]"
                rows="5"
              />
            </div>
            <div>
              <Label htmlFor="negative-template">Отрицательный шаблон</Label>
              <Textarea // Заменено на Textarea
                id="negative-template"
                value={emailTemplates.negative}
                onChange={(e) => handleTemplateChange('negative', e.target.value)}
                placeholder="[ИМЯ_КАНДИДАТА], к сожалению, мы не готовы сделать предложение. [ИТОГОВЫЙ_БАЛЛ]"
                rows="5"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default SettingsPage;
