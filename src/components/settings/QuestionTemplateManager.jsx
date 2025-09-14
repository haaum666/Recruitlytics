import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '../ui/card';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { getFromLocalStorage, saveToLocalStorage } from '../../services/localStorageService.js';

function QuestionTemplateManager() {
  const [templateName, setTemplateName] = useState('');
  const [savedTemplates, setSavedTemplates] = useState({});

  useEffect(() => {
    // Загружаем сохраненные шаблоны при загрузке компонента
    const templates = getFromLocalStorage('questionTemplates', {});
    setSavedTemplates(templates);
  }, []);

  const handleSaveTemplate = () => {
    if (!templateName.trim()) {
      alert('Пожалуйста, введите имя шаблона.');
      return;
    }

    const currentQuestions = getFromLocalStorage('customQuestions', []);
    const questionsAndWeights = currentQuestions.map(q => ({
      id: q.id,
      weight: q.weight,
      text: q.text
    }));

    const updatedTemplates = {
      ...savedTemplates,
      [templateName]: questionsAndWeights,
    };

    saveToLocalStorage('questionTemplates', updatedTemplates);
    setSavedTemplates(updatedTemplates);
    setTemplateName('');
    alert(`Шаблон "${templateName}" успешно сохранен!`);
  };

  return (
    <Card className="p-4">
      <CardHeader className="p-0 pb-4">
        <h2 className="text-xl font-semibold">Шаблоны вопросов</h2>
      </CardHeader>
      <CardContent className="p-0 space-y-4">
        <div>
          <Label htmlFor="templateName">Имя шаблона</Label>
          <Input 
            id="templateName" 
            placeholder="Например, 'Python Django'" 
            className="mt-1" 
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
          />
        </div>
        <div className="flex space-x-2">
          <Button onClick={handleSaveTemplate}>Сохранить текущие вопросы как шаблон</Button>
        </div>
        <div>
          <h3 className="text-lg font-medium mb-2">Сохраненные шаблоны</h3>
          {Object.keys(savedTemplates).length > 0 ? (
            <ul className="space-y-2">
              {Object.keys(savedTemplates).map(name => (
                <li key={name} className="flex justify-between items-center p-2 border rounded-md">
                  <span>{name}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">Пока нет сохраненных шаблонов.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default QuestionTemplateManager;
