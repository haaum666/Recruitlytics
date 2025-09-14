import React from 'react';
import { Card, CardHeader, CardContent } from '../ui/card';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

function QuestionTemplateManager() {
  return (
    <Card className="p-4">
      <CardHeader className="p-0 pb-4">
        <h2 className="text-xl font-semibold">Шаблоны вопросов</h2>
      </CardHeader>
      <CardContent className="p-0 space-y-4">
        <div>
          <Label htmlFor="templateName">Имя шаблона</Label>
          <Input id="templateName" placeholder="Например, 'Python Django'" className="mt-1" />
        </div>
        <div className="flex space-x-2">
          <Button>Сохранить текущие вопросы как шаблон</Button>
        </div>
        <div>
          <h3 className="text-lg font-medium mb-2">Сохраненные шаблоны</h3>
          <p className="text-gray-500">Пока нет сохраненных шаблонов.</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default QuestionTemplateManager;
