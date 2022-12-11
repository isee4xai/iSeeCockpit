import { PlusCircleOutlined, HolderOutlined, ImportOutlined, } from '@ant-design/icons';
import Draggable from 'react-draggable';
import QuestionForm from '@/components/iSee/question/toolkit/QuestionForm';
import { Button, Modal, notification } from 'antd';
import React, { useCallback, useState, useEffect } from 'react';

import TextArea from 'antd/lib/input/TextArea';

import './QuestionnaireEditor.less';

import { v4 as uuidv4 } from 'uuid';

import type { Question, Response } from '@/models/questionnaire';

import useDrag from '@/components/iSee/question/toolkit/useDrag';

const QuestionnaireEditor: React.FC<{
  defaultQuestions?: Question[];
  onChange: (question: Question[]) => void;
  noCategory?: boolean;
  noImport?: boolean;
  noAdd?: boolean;
}> = ({ defaultQuestions, onChange, noCategory = false, noImport = false, noAdd = false }) => {
  const [modal, setModal] = useState({ visibility: false });
  const [importJson, setImportJson] = useState('');
  const [questions, handleStartDrag, handleDrag, handleStopDrag, setQuestions] = useDrag<Question>(
    defaultQuestions || [],
    'question-container',
    'page-question-container',
    '1.5rem',
  );

  // useEffect(() => {
  //   console.log("RUNNNING HERE ", defaultQuestions)
  //   setQuestions(defaultQuestions || []);
  // }, [defaultQuestions, setQuestions]);

  const removeAttr = (list: Question[], attr: string) => {
    return list.map((elmnt: Question) => {
      delete elmnt[attr];
      Object.keys(elmnt).map((subElment) =>
        elmnt[subElment] instanceof Array ? removeAttr(elmnt[subElment], attr) : subElment,
      );
      return elmnt;
    });
  };

  useEffect(() => {
    console.log("useEffect Q Editor", questions)
    if (
      !(
        defaultQuestions &&
        JSON.stringify(removeAttr([...defaultQuestions], '_id')) ===
        JSON.stringify(removeAttr([...questions], '_id'))
      )
    )
      onChange(questions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questions]);

  const handleOk = () => {
    try {
      const json = JSON.parse(importJson);
      setImportJson('');

      if (json.questions && Array.isArray(json.questions)) {
        setQuestions(json.questions);
      }

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
    setModal({ ...modal, visibility: false });
  };

  const nextId = () => `q-${uuidv4()}`;

  const nextResId = () => "res-" + Math.floor(Math.random() * 100000) + 1;

  const handleAddbutton = () => {
    const r1: Response = {
      id: nextResId(),
      content: "Option 1"
    }
    const r2: Response = {
      id: nextResId(),
      content: "Option 2"
    }
    setQuestions([
      ...questions,
      {
        id: nextId(),
        responseOptions: [r1, r2],
        dimension: '',
        content: '',
      },
    ]);
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

  const handleImportButton = () => {
    setModal({ visibility: true });
  };

  const handleCloseModal = () => {
    setModal({ ...modal, visibility: false });
  };

  return (
    <>
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
            <div className={'question-container'} drag-index={idx}>
              <div className="question-holder">
                <HolderOutlined />
              </div>
              <QuestionForm
                noCategory={noCategory}
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
      {!noAdd && (
        <Button
          size="large"
          icon={<PlusCircleOutlined />}
          onClick={handleAddbutton}
          className="add-question-button"
        >
          Add a question
        </Button>
      )}
      {!noImport && questions.length === 0 && (
        <Button
          size="large"
          icon={<ImportOutlined />}
          onClick={handleImportButton}
          className={'import-question-button'}
        >
          Import a questionnaire
        </Button>
      )}
      <Modal
        title={'Import'}
        visible={modal.visibility}
        onOk={handleOk}
        onCancel={handleCloseModal}
        footer={
          <Button type="primary" onClick={handleOk}>
            import
          </Button>
        }
      >
        <pre>
          <code onClick={(e) => console.dir(e.target)}>
            <TextArea
              defaultValue={importJson}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                setImportJson(e.target.value);
              }}
            />
          </code>
        </pre>
      </Modal>
    </>
  );
};

export default QuestionnaireEditor;
