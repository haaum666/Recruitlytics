import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '../ui/card';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { getFromLocalStorage, saveToLocalStorage } from '../../services/localStorageService.js';
import { Button } from '../ui/button';

function EmailTemplateEditor() {
  const [templates, setTemplates] = useState({
    positive: '',
    negative: '',
  });

  useEffect(() => {
    // Загружаем шаблоны из localStorage при загрузке компонента
    const savedTemplates = getFromLocalStorage('emailTemplates', { positive: '', negative: '' });
    setTemplates(savedTemplates);
  }, []);

  const handleTemplateChange = (e) => {
    const { id, value } = e.target;
    setTemplates(prevTemplates => ({
      ...prevTemplates,
      [id]: value,
    }));
  };

  const handleSaveTemplates = () => {
    saveToLocalStorage('emailTemplates', templates);
    alert('Шаблоны писем сохранены!');
  };

  return (
    <Card className="p-4">
      <CardHeader className="p-0 pb-4">
        <h2 className="text-xl font-semibold">Шаблоны писем</h2>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-4">
          <div>
            <Label htmlFor="positive">Шаблон для положительной оценки</Label>
            <Textarea
              id="positive"
              placeholder="Введите текст шаблона..."
              className="mt-1"
              rows="6"
              value={templates.positive}
              onChange={handleTemplateChange}
            />
          </div>
          <div>
            <Label htmlFor="negative">Шаблон для отрицательной оценки</Label>
            <Textarea
              id="negative"
              placeholder="Введите текст шаблона..."
              className="mt-1"
              rows="6"
              value={templates.negative}
              onChange={handleTemplateChange}
            />
          </div>
        </div>
        <div className="mt-4">
          <Button onClick={handleSaveTemplates}>Сохранить шаблоны</Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default EmailTemplateEditor;
