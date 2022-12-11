/* eslint-disable react/no-array-index-key */
import QuestionnaireEditor from '@/components/iSee/question/toolkit/QuestionnaireEditor';
import type { Persona } from '@/models/persona';
import type { Question, Questionnaire, Response } from '@/models/questionnaire';
import { api_get_all } from '@/services/isee/questionnaires';
import { api_persona_update_intent } from '@/services/isee/usecases';
import {
  CheckCircleOutlined,
  CheckSquareOutlined,
  DashboardOutlined,
  DownloadOutlined,
  FieldNumberOutlined,
  FieldStringOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Checkbox,
  Col,
  Empty,
  Form,
  message,
  notification,
  Row,
  Select,
  Tooltip,
} from 'antd';
import Modal from 'antd/lib/modal/Modal';
import React, { useCallback, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import './QuestionnaireTab.less';

export type PersonaType = {
  evaluation: Questionnaire;
  updateIntentEvaluation?: any;
  persona: Persona;
  usecaseId: string;
  intent_cat: string;
};

const questionTypeToIcon = {
  Likert: <DashboardOutlined />,
  'Free-Text': <FieldStringOutlined />,
  Radio: <CheckCircleOutlined />,
  Checkbox: <CheckSquareOutlined />,
  Number: <FieldNumberOutlined />,
};

const QuestionnaireTab: React.FC<PersonaType> = ({
  evaluation,
  updateIntentEvaluation,
  persona,
  usecaseId,
  intent_cat,
}) => {
  const [questions, setQuestions] = useState(evaluation.questions || []);
  // New Load Quesionts Popu Functions
  const [isQuestionModal2Visible, setIsQuestionModal2Visible] = useState(false);
  const [importQuestionnaire, setImportQuestionnaire] = useState(undefined);
  const [isChangedQuestion, setIsChangedQuestion] = useState(false);
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);

  useEffect(() => {
    (async () => {
      const data = await api_get_all();
      setQuestionnaires(data);
    })();
  }, []);

  const showModalQ2 = () => {
    setIsQuestionModal2Visible(true);
  };

  const handleOkQ2 = () => {
    setIsQuestionModal2Visible(false);
  };

  const handleCancelQ2 = () => {
    setIsQuestionModal2Visible(false);
  };

  // Callback fix for issue with multiple options
  const handleQuestionChange = useCallback(
    (newQuestions: Question[]) => {
      // console.log("handleQuestionChange", newQuestions)
      // setQuestions(newQuestions);
      setIsChangedQuestion(true);
      setQuestions(() => newQuestions);
    },
    [setQuestions],
  );

  const onFinish2 = (values: any) => {
    if (values.questions.length > 0) setIsChangedQuestion(true);
    else setIsChangedQuestion(false);

    const questionList: Question[] =
      // collect questions based on the id from pre-existing questionnaires
      questionnaires
        .filter((q) => q._id == values.questionnaire)[0]
        ?.questions?.filter((q) => values.questions.includes(q.id))
        ?.map((q) => ({
          ...q,
          id: 'q-' + uuidv4(),
          dimension: questionnaires.filter((qs) => qs._id == values.questionnaire)[0].dimension,
        })) || [];

    handleOkQ2();

    setQuestions([...questions, ...questionList]);
    message.success({ content: 'Succesfully Added Question', duration: 2 });
  };

  const nextResId = () => "res-" + Math.floor(Math.random() * 100000) + 1;

  const addQuestion = () => {
    const r1: Response = {
      id: nextResId(),
      content: "Option 1"
    }
    const r2: Response = {
      id: nextResId(),
      content: "Option 1"
    }
    const blank_obj: Question = {
      id: 'q-' + uuidv4(),
      responseOptions: [r1, r2],
    };

    const append = [blank_obj, ...questions];

    setIsChangedQuestion(true);
    setQuestions(append);

    message.success({ content: 'Succesfully Added Question', duration: 2 });
  };

  const isQuestionValid = (question: Question) => {
    const error: string[] = [];

    if (!question.content || question.content.trim() === '') {
      error.push('Question Text is required');
    }

    if (
      !['Free-Text', 'Radio', 'Checkbox', 'Number', 'Likert'].includes(question.responseType ?? '')
    ) {
      error.push('Metric is required');
    } else if (['Likert', 'Radio', 'Checkbox'].includes(question.responseType ?? '')) {
      if (!question.responseOptions || question.responseOptions.length === 0) {
        error.push('Metric Values are required for type ' + question.responseType + ' questions');
      } else if (!question.responseOptions || question.responseOptions.length === 1) {
        error.push('There should be multiple options');
      }
    } else if (question.responseType === 'Number') {
      if (question?.validators?.max !== undefined && question?.validators?.min !== undefined) {
        if (question.validators?.max < question.validators?.min) {
          error.push('Max should be greater than Min');
        }
      }
    }
    if (!question.dimension || question.dimension.trim() == '') {
      error.push('A category is required');
    }

    return error;
  };

  async function saveQuestionnaire() {
    console.log('%c Saving.... ', 'font-size: 20px; color: orange;');
    const errors = questions.map((q) => isQuestionValid(q) as string[]);
    setIsChangedQuestion(false);

    if (errors.reduce((prev, curr) => [...prev, ...curr], []).length === 0) {
      console.log('%c Valid ! ', 'font-size: 20px; color: green;');
      const intent = persona.intents?.find((i) => i.name === intent_cat);
      if (intent) {
        await api_persona_update_intent(usecaseId, persona._id, intent.id, {
          ...intent,
          evaluation: { questions },
        });
      }

      updateIntentEvaluation(intent, questions);

      notification.success({
        message: 'Saved Evaluation Questionnaire',
        placement: 'top',
        duration: 3,
      });
    } else {
      notification.error({
        message: `Invalid Questionnaire`,
        description: (
          <div>
            <p>Please fix the following errors before saving:</p>
            {errors.map(
              (e, i) =>
                e.length > 0 && (
                  <React.Fragment key={i}>
                    <b> Questions {i + 1}</b>
                    <br />
                    {e.map((err, j) => (
                      <React.Fragment key={j}>
                        <span style={{ marginLeft: '1rem' }}>{err}</span>
                        <br />
                      </React.Fragment>
                    ))}
                    <br />
                  </React.Fragment>
                ),
            )}
          </div>
        ),
        placement: 'top',
        duration: Math.min(3, errors.length * 2),
      });

      console.table(errors);
    }
  }

  return (
    <Row gutter={24}>
      <Col span={24}>
        <Card
          size="small"
          title={'Evaluation Questions'}
          extra={
            <div>
              <Button
                onClick={() => showModalQ2()}
                icon={<DownloadOutlined />}
                name="addQuestionButton"
              >
                Load Questions
              </Button>
              &nbsp;
              <Button onClick={addQuestion} icon={<DownloadOutlined />} name="addQuestionButton">
                New Question
              </Button>
              &nbsp;
              <Button
                type="primary"
                disabled={!isChangedQuestion}
                onClick={saveQuestionnaire}
                icon={<SaveOutlined />}
                name="addQuestionButton"
              >
                Save Questionnaire
              </Button>
            </div>
          }
        >
          {questions.length > 0 ? (
            <QuestionnaireEditor
              noImport
              // noAdd
              defaultQuestions={questions}
              onChange={handleQuestionChange}
            // onChange={(newQuestions) => {
            //   console.log("newQuestions", newQuestions)
            //   setQuestions(newQuestions);
            //   setIsChangedQuestion(true);
            // }}
            />
          ) : (
            <Empty description={'Please add a question'} />
          )}
        </Card>
      </Col>

      {/* Load Question Popup  */}
      <Modal
        title="Load Questionnaire"
        visible={isQuestionModal2Visible}
        onCancel={handleCancelQ2}
        footer={[
          <Button key="back" onClick={handleCancelQ2}>
            Cancel
          </Button>,
          <Button form="createQuestion22" key="submitQ" htmlType="submit" type="primary">
            Load Questions
          </Button>,
        ]}
      >
        <Form
          id="createQuestion22"
          name="createQuestion22"
          layout="vertical"
          labelCol={{ span: 0 }}
          onFinish={onFinish2}
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
              {questionnaires.map((questionnaire) => (
                <Select.Option key={questionnaire._id} value={questionnaire._id}>
                  {questionnaire.name}
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
                  questionnaires
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
    </Row>
  );
};

export default QuestionnaireTab;
