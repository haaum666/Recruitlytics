import React, { useState } from 'react';
import { questions } from '../config/questions';
import QuestionItem from '../components/assessment/QuestionItem';

function AssessmentPage() {
  const [assessmentData, setAssessmentData] = useState({});

  const handleInputChange = (id, field, value) => {
    setAssessmentData(prevData => ({
      ...prevData,
      [id]: {
        ...prevData[id],
        [field]: value,
      },
    }));
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Новая оценка кандидата</h1>
      <div className="space-y-4">
        {questions.map(question => (
          <QuestionItem
            key={question.id}
            question={question}
            onInputChange={(field, value) => handleInputChange(question.id, field, value)}
          />
        ))}
      </div>
    </div>
  );
}

export default AssessmentPage;
