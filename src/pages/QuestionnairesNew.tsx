import React, { useCallback } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Button } from 'antd';
import QuestionForm from '@/components/iSee/question/toolkit/QuestionForm';
import type { Question } from '@/models/questionnaire';
import { PlusCircleOutlined, HolderOutlined } from '@ant-design/icons';
import Draggable from 'react-draggable';
import './QuestionnaireNew.less';

import useDrag from '@/components/iSee/question/toolkit/useDrag';

const CreateQuestionnaires: React.FC = () => {
  const [questions, handleStartDrag, handleDrag, handleStopDrag, setQuestions] = useDrag<Question>(
    [],
    'question-container',
  );

  const nextId = () => Date.now().toString();

  const handleAddbutton = () => {
    setQuestions([...questions, { id: nextId() }]);
  };

  const handleQuestionChange = useCallback(
    (newQuestion: Question) => {
      setQuestions((old: Question[]) => {
        const index = old.findIndex((q: Question) => q.id === newQuestion.id);
        if (index === -1) return old;

        const newList: Question[] = old.slice();
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
    <PageContainer className="PageContainer">
      <div className="page-question-container">
        <span className="space-4" />
        {questions.map((question, idx) => (
          <Draggable
            key={question.id}
            position={{ x: 0, y: 0 }}
            axis="y"
            bounds="parent"
            onStart={handleStartDrag}
            onDrag={handleDrag}
            onStop={handleStopDrag}
            handle={'.question-holder'}
          >
            <div className="question-container" drag-index={idx}>
              <div className="question-holder">
                <HolderOutlined />
              </div>
              <QuestionForm
                key={question.id}
                question={question}
                onChange={handleQuestionChange}
                onDuplication={handleDuplication}
                onDelete={handleDelete}
              />
            </div>
          </Draggable>
        ))}
        <span className="space-4" />
      </div>
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
