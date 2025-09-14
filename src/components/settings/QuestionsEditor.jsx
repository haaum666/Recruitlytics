import React, { useState, useEffect } from 'react';
import { questions as defaultQuestions } from '../../config/questions.js';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '../ui/dialog';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { getFromLocalStorage, saveToLocalStorage } from '../../services/localStorageService.js';

function QuestionsEditor() {
  const [open, setOpen] = useState(false);
  const [newQuestion, setNewQuestion] = useState({ text: '', weight: 1, type: 'boolean' });
  const [currentQuestions, setCurrentQuestions] = useState([]);
  const [editingQuestion, setEditingQuestion] = useState(null);

  const loadQuestions = () => {
    const savedQuestions = getFromLocalStorage('customQuestions', []);
    const combinedQuestions = [...defaultQuestions, ...savedQuestions];
    setCurrentQuestions(combinedQuestions);
  };

  useEffect(() => {
    loadQuestions();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewQuestion(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleOpenDialog = (question = null) => {
    if (question) {
      setEditingQuestion(question);
      setNewQuestion(question);
    } else {
      setEditingQuestion(null);
      setNewQuestion({ text: '', weight: 1, type: 'boolean' });
    }
    setOpen(true);
  };

  const handleSaveQuestion = () => {
    const customQuestions = getFromLocalStorage('customQuestions', []);
    let updatedCustomQuestions;

    if (editingQuestion) {
      // Редактирование существующего вопроса
      updatedCustomQuestions = customQuestions.map(q =>
        q.id === editingQuestion.id ? { ...newQuestion, id: q.id } : q
      );
    } else {
      // Добавление нового вопроса
      const newId = `custom_${Date.now()}`;
      const questionToAdd = { ...newQuestion, id: newId };
      updatedCustomQuestions = [...customQuestions, questionToAdd];
    }

    saveToLocalStorage('customQuestions', updatedCustomQuestions);
    loadQuestions();
    
    setOpen(false);
    setNewQuestion({ text: '', weight: 1, type: 'boolean' });
    setEditingQuestion(null);
  };
  
  const handleDeleteQuestion = (id) => {
    const customQuestions = getFromLocalStorage('customQuestions', []);
    const updatedCustomQuestions = customQuestions.filter(q => q.id !== id);
    saveToLocalStorage('customQuestions', updatedCustomQuestions);
    loadQuestions();
  };

  const isDefaultQuestion = (id) => {
    return defaultQuestions.some(q => q.id === id);
  };

  return (
    <div className="p-4 border rounded-md bg-white shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Управление вопросами</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>Добавить вопрос</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingQuestion ? 'Редактировать вопрос' : 'Добавить новый вопрос'}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="text" className="text-right">
                  Текст
                </Label>
                <Input
                  id="text"
                  name="text"
                  value={newQuestion.text}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="weight" className="text-right">
                  Вес
                </Label>
                <Input
                  id="weight"
                  name="weight"
                  type="number"
                  min="1"
                  value={newQuestion.weight}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" onClick={handleSaveQuestion}>Сохранить</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <ul className="space-y-4">
        {currentQuestions.map(q => (
          <li key={q.id} className="p-3 border rounded-md bg-gray-50 flex justify-between items-center">
            <span>{q.text} (Вес: {q.weight})</span>
            <div className="space-x-2">
              <Button onClick={() => handleOpenDialog(q)} variant="ghost" className="text-blue-600 hover:text-blue-800">Редактировать</Button>
              <Button onClick={() => handleDeleteQuestion(q.id)} variant="ghost" className="text-red-600 hover:text-red-800" disabled={isDefaultQuestion(q.id)}>Удалить</Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default QuestionsEditor;
