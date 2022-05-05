import React, { useState, useCallback } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Modal, Alert, notification } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import QuestionForm from '@/components/iSee/question/toolkit/QuestionForm';
import {
  PlusCircleOutlined,
  HolderOutlined,
  CopyOutlined,
  ImportOutlined,
} from '@ant-design/icons';
import Draggable from 'react-draggable';
import './QuestionnaireNew.less';

import type { Question } from '@/models/questionnaire';

import useDrag from '@/components/iSee/question/toolkit/useDrag';
import TextArea from 'antd/lib/input/TextArea';

const CreateQuestionnaires: React.FC = () => {
  const [modal, setModal] = useState({ visibility: false, type: 'export' });
  const [importJson, setImportJson] = useState('');
  const [questions, handleStartDrag, handleDrag, handleStopDrag, setQuestions] = useDrag<Question>(
    [],
    'question-container',
  );

  const nextId = () => `q-${uuidv4()}`;

  const handleAddbutton = () => {
    setQuestions([...questions, { id: nextId() }]);
  };

  const handleImportButton = () => {
    setModal({ visibility: true, type: 'import' });
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

  const isQuestionValid = (question: Question) => {
    if (!question.id || !question.text || !question.metric || !question.category) return false;
    if (question.text.trim() === '') return false;

    if (['Likert', 'Radio', 'Checkbox'].includes(question.metric)) {
      if (!question.metric_values || question.metric_values.length === 0) return false;
    }

    return true;
  };

  const isQuestionnaireValid = () => questions.every((question) => isQuestionValid(question));

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

  const handleExportButton = () => {
    setModal({ visibility: true, type: 'export' });
  };

  const addToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify({ questions }, null, 4)).then(
      () => {
        notification.success({
          message: `Success`,
          duration: 3,
          description: 'The questionnaire json has been added to the clipboard',
          placement: 'bottomRight',
        });
      },
      () => {
        notification.error({
          message: `Error`,
          duration: 3,
          description: 'An error occured, the json was not added to the clipboard',
          placement: 'bottomRight',
        });
      },
    );
  };

  const handleOk = () => {
    if (modal.type === 'import') {
      try {
        const json = JSON.parse(importJson);

        if (json.questions && Array.isArray(json.questions)) {
          setQuestions(json.questions);
        }
        setImportJson('');

        notification.success({
          message: `Success`,
          duration: 3,
          description: 'The questionnaire json has been imported',
          placement: 'bottomRight',
        });
      } catch (e) {
        console.debug(e);
        notification.error({
          message: `Error`,
          duration: 3,
          description: 'An error occured during the import, please check the json',
          placement: 'bottomRight',
        });
      }
    }
    setModal({ ...modal, visibility: false });
  };

  const handleCloseModal = () => {
    setModal({ ...modal, visibility: false });
  };

  return (
    <PageContainer>
      <div className="page-question-container">
        <span className="sapce-4" />
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
        <span className="sapce-4" />
      </div>
      {questions.length === 0 && (
        <Button
          size="large"
          icon={<ImportOutlined />}
          onClick={handleImportButton}
          style={{ transition: '.3s', display: 'block', width: '50%', margin: '1rem auto' }}
        >
          Import a questionnaire
        </Button>
      )}
      <Button
        size="large"
        icon={<PlusCircleOutlined />}
        onClick={handleAddbutton}
        style={{ transition: '.3s', display: 'block', width: '50%', margin: '1rem auto' }}
      >
        Add a question
      </Button>
      <Button onClick={handleExportButton} type="primary" className="generate-json">
        {' '}
        Generate Json{' '}
      </Button>
      <Modal
        title={modal.type === 'export' ? 'Export' : 'Import'}
        visible={modal.visibility}
        onOk={handleOk}
        onCancel={handleCloseModal}
        footer={
          <>
            {modal.type === 'export' && (
              <Button onClick={addToClipboard} icon={<CopyOutlined />}>
                Copy to clipboard
              </Button>
            )}
            <Button type="primary" onClick={handleOk}>
              {modal.type === 'export' ? 'Close' : 'Import'}
            </Button>
          </>
        }
      >
        {modal.type === 'export' && !isQuestionnaireValid() && (
          <Alert
            message="Your form isn't valid, you may want to fill all fields before exporting!"
            type="warning"
            showIcon
            className="alert-export"
          />
        )}
        <pre>
          <code onClick={(e) => console.dir(e.target)}>
            {modal.type === 'export' ? (
              JSON.stringify({ questions }, null, 2)
            ) : (
              <TextArea
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                  setImportJson(e.target.value);
                }}
              />
            )}
          </code>
        </pre>
      </Modal>
    </PageContainer>
  );
};

export default CreateQuestionnaires;
