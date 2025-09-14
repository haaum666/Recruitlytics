import React from 'react';
import { Card, CardHeader, CardContent } from '../ui/card';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';

function EmailTemplateEditor() {
  return (
    <Card className="p-4">
      <CardHeader className="p-0 pb-4">
        <h2 className="text-xl font-semibold">Шаблоны писем</h2>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-4">
          <div>
            <Label htmlFor="positiveTemplate">Шаблон для положительной оценки</Label>
            <Textarea
              id="positiveTemplate"
              placeholder="Введите текст шаблона..."
              className="mt-1"
              rows="6"
            />
          </div>
          <div>
            <Label htmlFor="negativeTemplate">Шаблон для отрицательной оценки</Label>
            <Textarea
              id="negativeTemplate"
              placeholder="Введите текст шаблона..."
              className="mt-1"
              rows="6"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default EmailTemplateEditor;
