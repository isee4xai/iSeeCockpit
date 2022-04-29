import React, { useState, useCallback } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Modal } from 'antd';
import QuestionForm from '@/components/iSee/question/toolkit/QuestionForm';
import { PlusCircleOutlined, HolderOutlined, CopyOutlined } from '@ant-design/icons';
import Draggable from 'react-draggable';
import './QuestionnaireNew.less';

interface Question {
  id?: string;
  text?: string;
  metric?: string;
  category?: string;
  metric_values?: {
    val: string;
  }[];
  required?: boolean;
  completed?: boolean;
  validators?: {
    min?: number;
    max?: number;
  }[];
}

import useDrag from '@/components/iSee/question/toolkit/useDrag';

const CreateQuestionnaires: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
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

  const showModal = () => {
    setIsModalVisible(true);
  };

  const addToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(questions));
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
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
      <Button onClick={showModal} type="primary" className="generate-json">
        {' '}
        Generate Json{' '}
      </Button>
      <Modal
        title="Basic Modal"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={
          <>
            <Button onClick={addToClipboard} icon={<CopyOutlined />}>
              Copy to clipboard
            </Button>
            <Button type="primary" onClick={handleOk}>
              OK
            </Button>
          </>
        }
      >
        <pre>
          <code onClick={(e) => console.dir(e.target)}>
            {JSON.stringify({ questions }, null, 4).trim()}
          </code>
        </pre>
      </Modal>
    </PageContainer>
  );
};

export default CreateQuestionnaires;
