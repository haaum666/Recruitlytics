import React, { useState, useEffect } from 'react';
import { getFromLocalStorage } from '../services/localStorageService.js';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../components/ui/accordion';
import { questions } from '../config/questions.js';

function HistoryPage() {
  const [assessments, setAssessments] = useState([]);

  useEffect(() => {
    const savedAssessments = getFromLocalStorage('assessments', []);
    setAssessments(savedAssessments);
  }, []);

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
                <div className="space-y-4">
                  {questions.map(question => {
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
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <p className="text-gray-500">Пока нет сохраненных оценок.</p>
      )}
    </div>
  );
}

export default HistoryPage;
