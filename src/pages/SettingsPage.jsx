import React, { useState, useEffect } from 'react';
import { getFromLocalStorage, saveToLocalStorage } from '../services/localStorageService.js';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { toast } from 'react-hot-toast';

function SettingsPage() {
  const [customQuestions, setCustomQuestions] = useState([]);
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newQuestionWeight, setNewQuestionWeight] = useState(1);
  const [defaultQuestions, setDefaultQuestions] = useState([]);
  const [modifiedDefaultQuestions, setModifiedDefaultQuestions] = useState([]);

  useEffect(() => {
    const savedCustomQuestions = getFromLocalStorage('customQuestions', []);
    setCustomQuestions(savedCustomQuestions);
    const savedModifiedDefaultQuestions = getFromLocalStorage('modifiedDefaultQuestions', []);
    setModifiedDefaultQuestions(savedModifiedDefaultQuestions);
  }, []);

  const addCustomQuestion = () => {
    if (!newQuestionText.trim()) {
      toast.error('Текст вопроса не может быть пустым.');
      return;
    }
    const newQuestion = {
      id: `custom-${Date.now()}`,
      text: newQuestionText,
      weight: parseInt(newQuestionWeight, 10),
    };
    const updatedQuestions = [...customQuestions, newQuestion];
    setCustomQuestions(updatedQuestions);
    saveToLocalStorage('customQuestions', updatedQuestions);
    setNewQuestionText('');
    setNewQuestionWeight(1);
    toast.success('Вопрос успешно добавлен!');
  };

  const deleteCustomQuestion = (id) => {
    const updatedQuestions = customQuestions.filter(q => q.id !== id);
    setCustomQuestions(updatedQuestions);
    saveToLocalStorage('customQuestions', updatedQuestions);
    toast.success('Вопрос удален.');
  };

  const updateDefaultQuestionWeight = (id, newWeight) => {
    const newWeightInt = parseInt(newWeight, 10);
    const updatedQuestions = modifiedDefaultQuestions.map(q =>
      q.id === id ? { ...q, weight: newWeightInt } : q
    );
    setModifiedDefaultQuestions(updatedQuestions);
    saveToLocalStorage('modifiedDefaultQuestions', updatedQuestions);
    toast.success('Вес вопроса обновлен.');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold dark:text-white">Настройки</h1>

      <Card>
        <CardContent className="space-y-4">
          <h2 className="text-xl font-semibold dark:text-white">Управление вопросами</h2>
          <div className="space-y-4">
            {modifiedDefaultQuestions.length > 0 && modifiedDefaultQuestions.map(q => (
              <div key={q.id} className="flex items-center justify-between p-2 border rounded-md dark:border-zinc-700 dark:text-gray-200">
                <span>{q.text} ({q.weight} баллов)</span>
                <div className="flex items-center space-x-2">
                  <Input 
                    type="number" 
                    value={q.weight} 
                    onChange={(e) => updateDefaultQuestionWeight(q.id, e.target.value)} 
                    min="1" max="10" 
                    className="w-20 dark:bg-zinc-900 dark:border-zinc-700 dark:text-gray-200"
                  />
                </div>
              </div>
            ))}
            {customQuestions.map(q => (
              <div key={q.id} className="flex items-center justify-between p-2 border rounded-md dark:border-zinc-700 dark:text-gray-200">
                <span>{q.text} ({q.weight} баллов)</span>
                <Button variant="destructive" onClick={() => deleteCustomQuestion(q.id)}>
                  Удалить
                </Button>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold dark:text-gray-300">Новый вопрос</h3>
            <div className="flex space-x-2 items-end">
              <div className="flex-1">
                <Label htmlFor="newQuestionText" className="sr-only">Текст вопроса</Label>
                <Input
                  id="newQuestionText"
                  placeholder="Например: 'Опыт работы с микросервисами'"
                  value={newQuestionText}
                  onChange={(e) => setNewQuestionText(e.target.value)}
                  className="dark:bg-zinc-900 dark:border-zinc-700 dark:text-gray-200"
                />
              </div>
              <div>
                <Label htmlFor="newQuestionWeight" className="sr-only">Вес (1-10)</Label>
                <Input
                  id="newQuestionWeight"
                  type="number"
                  placeholder="Вес (1-10)"
                  value={newQuestionWeight}
                  onChange={(e) => setNewQuestionWeight(e.target.value)}
                  min="1"
                  max="10"
                  className="w-20 dark:bg-zinc-900 dark:border-zinc-700 dark:text-gray-200"
                />
              </div>
              <Button onClick={addCustomQuestion}>Добавить</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default SettingsPage;
