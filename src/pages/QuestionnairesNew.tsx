import React, { useState, useCallback } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Button } from 'antd';
import QuestionForm from '@/components/iSee/question/toolkit/QuestionForm';
import type { Question } from '@/models/questionnaire';
import { PlusCircleOutlined } from '@ant-design/icons';

const CreateQuestionnaires: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);

  const nextId = () => Date.now().toString();

  const handleAddbutton = () => {
    setQuestions([...questions, { id: nextId() }]);
  };

  const handleQuestionChange = useCallback(
    (newQuestion) => {
      setQuestions((old) => {
        const index = old.findIndex((q) => q.id === newQuestion.id);
        if (index === -1) return old;

        const newList = old.slice();
        newList.splice(index, 1, newQuestion);
        return newList;
      });
    },
    [setQuestions],
  );

  const handleDuplication = (id: string | undefined) => {
    const index = questions.findIndex((q) => q.id === id);

    if (index === -1) return;
    const newList = questions.slice();
    newList.splice(index + 1, 0, { ...questions[index], id: nextId() });

    setQuestions(newList);
  };

  const handleDelete = (id: string | undefined) => {
    setQuestions((old) => old.filter((q) => q.id !== id));
  };

  return (
    <PageContainer>
      {questions.map((question) => (
        <QuestionForm
          key={question.id}
          question={question}
          onChange={handleQuestionChange}
          onDuplication={handleDuplication}
          onDelete={handleDelete}
        />
      ))}
      <Button
        size="large"
        icon={<PlusCircleOutlined />}
        onClick={handleAddbutton}
        style={{ transition: '.3s', margin: 'auto', display: 'block', width: '50%' }}
      >
        Add a question
      </Button>
    </PageContainer>
  );
};

export default CreateQuestionnaires;
