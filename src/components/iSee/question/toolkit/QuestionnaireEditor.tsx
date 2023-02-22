import { PlusCircleOutlined, HolderOutlined, ImportOutlined, DownloadOutlined, PlusOutlined, DashboardOutlined, FieldStringOutlined, CheckCircleOutlined, CheckSquareOutlined, FieldNumberOutlined, } from '@ant-design/icons';
import Draggable from 'react-draggable';
import QuestionForm from '@/components/iSee/question/toolkit/QuestionForm';
import { Button, Checkbox, Col, Form, message, Modal, notification, Row, Select, Space, Tooltip } from 'antd';
import React, { useCallback, useState, useEffect } from 'react';

import TextArea from 'antd/lib/input/TextArea';

import './QuestionnaireEditor.less';

import { v4 as uuidv4 } from 'uuid';

import type { Question, Questionnaire, Response } from '@/models/questionnaire';

import useDrag from '@/components/iSee/question/toolkit/useDrag';
import { api_get_all } from '@/services/isee/questionnaires';

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

  const [modalQuestionnaires, setModalQuestionnaires] = useState({ visibility: false });
  const [importQuestionnaire, setImportQuestionnaire] = useState(undefined);
  const [importedQuestionnaires, setImportQuestionnaires] = useState<Questionnaire[]>([]);

  // useEffect(() => {
  //   console.log("RUNNNING HERE ", defaultQuestions)
  //   setQuestions(defaultQuestions || []);
  // }, [defaultQuestions, setQuestions]);

  useEffect(() => {
    (async () => {
      const data = await api_get_all();
      setImportQuestionnaires(data);
    })();
  }, []);

  const questionTypeToIcon = {
    Likert: <DashboardOutlined />,
    'Free-Text': <FieldStringOutlined />,
    Radio: <CheckCircleOutlined />,
    Checkbox: <CheckSquareOutlined />,
    Number: <FieldNumberOutlined />,
  };

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

  const onFinishImportQuestionnaire = (values: any) => {
    const questionList: Question[] =
      // collect questions based on the id from pre-existing questionnaires
      importedQuestionnaires
        .filter((q) => q._id == values.questionnaire)[0]
        ?.questions?.filter((q) => values.questions.includes(q.id))
        ?.map((q) => ({
          ...q,
          id: 'q-' + uuidv4(),
          dimension: importedQuestionnaires.filter((qs) => qs._id == values.questionnaire)[0].dimension,
        })) || [];

    handleCloseModalQuestionnaires();
    setQuestions([...questions, ...questionList]);
    message.success({ content: 'Succesfully Imported Questions', duration: 2 });
  };


  const handleQuestionChange = useCallback(
    (newQuestion: Question) => {
      console.log("useCallback INNER")
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

  const handleImportQuestionaireButton = () => {
    setModalQuestionnaires({ visibility: true });
  };

  const handleCloseModal = () => {
    setModal({ ...modal, visibility: false });
  };

  const handleCloseModalQuestionnaires = () => {
    setModalQuestionnaires({ ...modalQuestionnaires, visibility: false });
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
          Create New Question
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

      <Row style={{ marginBottom: 20 }}>
        <Col span={8} offset={9}>
          <Space >
            <Button
              icon={<DownloadOutlined />}
              // type="primary"
              onClick={handleImportQuestionaireButton}
              size='large'>
              Import Questionnaire
            </Button>
            <Button
              size='large'
              onClick={handleAddbutton}
              icon={<PlusOutlined />}
            >
              Create New
            </Button>
          </Space>
        </Col>
      </Row>

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

      {/* Load Question Popup  */}
      <Modal
        title="Load Questionnaire"
        visible={modalQuestionnaires.visibility}
        onCancel={handleCloseModalQuestionnaires}
        destroyOnClose={true}
        footer={[
          <Button key="back"
            onClick={handleCloseModalQuestionnaires}
          >
            Cancel
          </Button>,
          <Button form="importQuestionForm" key="submitQ" htmlType="submit" type="primary">
            Load Questions
          </Button>,
        ]}
      >
        <Form
          id="importQuestionForm"
          name="importQuestionForm"
          layout="vertical"
          preserve={false}
          labelCol={{ span: 0 }}
          onFinish={onFinishImportQuestionnaire}
          autoComplete="off"
          onValuesChange={(changedValues) =>
            changedValues?.questionnaire
              ? setImportQuestionnaire(changedValues.questionnaire)
              : null
          }
        >
          <Form.Item
            shouldUpdate
            label="Select a Questionnaire"
            name="questionnaire"
            tooltip="This is a required field"
            initialValue={importQuestionnaire}
            rules={[{ required: true, message: 'Input is required!' }]}
          >
            <Select defaultValue={importQuestionnaire}>
              {importedQuestionnaires.map((importedQuestionnaire) => (
                <Select.Option key={importedQuestionnaire._id} value={importedQuestionnaire._id}>
                  {importedQuestionnaire.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          {importQuestionnaire && (
            <Form.Item
              className="question-select-checkbox"
              label="Select Questions"
              name="questions"
              tooltip="This is a required field"
              rules={[{ required: true, message: 'Input is required!' }]}
            >
              <Checkbox.Group
                className="checkbox-group"
                options={
                  importedQuestionnaires
                    .filter((q) => q._id == importQuestionnaire)[0]
                    ?.questions?.map((q) => ({
                      label: (
                        <>
                          <Tooltip title={`This is a ${q.responseType} question`}>
                            {questionTypeToIcon[q.responseType ?? '']}
                          </Tooltip>
                          {q.content ?? ''}
                        </>
                      ),
                      value: q.id ?? '',
                    })) || []
                }
              />
            </Form.Item>
          )}
        </Form>
      </Modal>

    </>
  );
};

export default QuestionnaireEditor;
