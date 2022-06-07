/* eslint-disable react/no-array-index-key */
import {
  DownloadOutlined,
  SaveOutlined,
  DashboardOutlined,
  FieldStringOutlined,
  CheckCircleOutlined,
  FieldNumberOutlined,
  CheckSquareOutlined,
} from '@ant-design/icons';
import {
  Form,
  Button,
  Card,
  Tooltip,
  Col,
  Row,
  Empty,
  Select,
  message,
  Checkbox,
  notification,
} from 'antd';
import type { Question, Questionnaire } from '@/models/questionnaire';
import QuestionnaireEditor from '@/components/iSee/question/toolkit/QuestionnaireEditor';
import Modal from 'antd/lib/modal/Modal';
import React, { useState } from 'react';
import type { Persona } from '@/models/persona';
import { api_persona_save_intent_evaluation } from '@/services/isee/usecases';
import { v4 as uuidv4 } from 'uuid';

import './QuestionnaireTab.less';

const questionnaires: Questionnaire[] = [
  {
    name: 'Explanation Satisfaction Scale (Hoffman)',
    category: 'Satisfaction',
    id: 'q-1',
    questions: [
      {
        content: 'From the explanation, I understand how the AI model works.',
        responseType: 'Likert',
        responseOptions: [
          { val: 'I agree strongly' },
          { val: 'I agree somewhat' },
          { val: "I'm neutral about it" },
          { val: 'I disagree somewhat' },
          { val: 'I disagree strongly' },
        ],
        required: true,
        id: 'q-1-1',
      },
      {
        content: 'This explanation of how the AI model works is satisfying.',
        responseType: 'Likert',
        responseOptions: [
          { val: 'I agree strongly' },
          { val: 'I agree somewhat' },
          { val: "I'm neutral about it" },
          { val: 'I disagree somewhat' },
          { val: 'I disagree strongly' },
        ],
        required: false,
        id: 'q-1-2',
      },
      {
        content: 'This explanation of how the AI model works has sufficient detail.',
        responseType: 'Likert',
        responseOptions: [
          { val: 'I agree strongly' },
          { val: 'I agree somewhat' },
          { val: "I'm neutral about it" },
          { val: 'I disagree somewhat' },
          { val: 'I disagree strongly' },
        ],
        required: true,
        id: 'q-1-3',
      },
      {
        content: 'This explanation of how the AI model works seems complete.',
        responseType: 'Likert',
        responseOptions: [
          { val: 'I agree strongly' },
          { val: 'I agree somewhat' },
          { val: "I'm neutral about it" },
          { val: 'I disagree somewhat' },
          { val: 'I disagree strongly' },
        ],
        required: false,
        id: 'q-1-4',
      },
      {
        content: 'This explanation of how the AI model works tells me how to use it',
        responseType: 'Likert',
        responseOptions: [
          { val: 'I agree strongly' },
          { val: 'I agree somewhat' },
          { val: "I'm neutral about it" },
          { val: 'I disagree somewhat' },
          { val: 'I disagree strongly' },
        ],
        required: true,
        id: 'q-1-5',
      },
      {
        content: 'This explanation of how the AI model works is useful to my goals.',
        responseType: 'Likert',
        responseOptions: [
          { val: 'I agree strongly' },
          { val: 'I agree somewhat' },
          { val: "I'm neutral about it" },
          { val: 'I disagree somewhat' },
          { val: 'I disagree strongly' },
        ],
        required: false,
        id: 'q-1-6',
      },
      {
        content:
          'This explanation of the [software, algorithm, tool] shows me how accurate the AI model is.',
        responseType: 'Likert',
        responseOptions: [
          { val: 'I agree strongly' },
          { val: 'I agree somewhat' },
          { val: "I'm neutral about it" },
          { val: 'I disagree somewhat' },
          { val: 'I disagree strongly' },
        ],
        required: false,
        id: 'q-1-7',
      },
      {
        content: 'This explanation lets me judge when I should trust and not trust the AI model. ',
        responseType: 'Likert',
        responseOptions: [
          { val: 'I agree strongly' },
          { val: 'I agree somewhat' },
          { val: "I'm neutral about it" },
          { val: 'I disagree somewhat' },
          { val: 'I disagree strongly' },
        ],
        required: true,
        id: 'q-1-8',
      },
    ],
  },
  {
    name: 'Explanation Goodness Checklist (Hoffman)',
    category: 'Goodness',
    id: 'q-2',
    questions: [
      {
        content: 'The explanation helps me understand how the AI model works.',
        responseType: 'Radio',
        responseOptions: [{ val: 'Yes' }, { val: 'No' }],
        required: true,
        id: 'q-2-1',
      },
      {
        content: 'The explanation of how the AI model works is satisfying.',
        responseType: 'Radio',
        responseOptions: [{ val: 'Yes' }, { val: 'No' }],
        required: true,
        id: 'q-2-2',
      },
      {
        content: 'The explanation of the AI model sufficiently detailed. ',
        responseType: 'Radio',
        responseOptions: [{ val: 'Yes' }, { val: 'No' }],
        required: true,
        id: 'q-2-3',
      },
      {
        content: 'The explanation of how the AI model works is sufficiently complete.',
        responseType: 'Radio',
        responseOptions: [{ val: 'Yes' }, { val: 'No' }],
        required: true,
        id: 'q-2-4',
      },
      {
        content:
          'The explanation is actionable, that is, it helps me know how to use the AI M=model',
        responseType: 'Radio',
        responseOptions: [{ val: 'Yes' }, { val: 'No' }],
        required: true,
        id: 'q-2-5',
      },
      {
        content: 'The explanation lets me know how accurate or reliable the AI model is.',
        responseType: 'Radio',
        responseOptions: [{ val: 'Yes' }, { val: 'No' }],
        required: true,
        id: 'q-2-6',
      },
      {
        content: 'The explanation lets me know how trustworthy the AI model is.',
        responseType: 'Radio',
        responseOptions: [{ val: 'Yes' }, { val: 'No' }],
        required: true,
        id: 'q-2-7',
      },
    ],
  },
  {
    name: 'Cahour-Forzy Trust Scale;',
    category: 'Trust',
    id: 'q-3',
    questions: [
      {
        content: 'What is your confidence in the [tool]? Do you have a feeling of trust in it?',
        responseType: 'Likert',
        responseOptions: [
          { val: '1 (I do not trust it at all.)' },
          { val: '2' },
          { val: '3' },
          { val: '4' },
          { val: '5' },
          { val: '6' },
          { val: '7 (I trust it completely)' },
        ],
        required: true,
        id: 'q-3-1',
      },
      {
        content: 'Are the actions of the [tool] predictable?',
        responseType: 'Likert',
        responseOptions: [
          { val: '1 (I do not trust it at all.)' },
          { val: '2' },
          { val: '3' },
          { val: '4' },
          { val: '5' },
          { val: '6' },
          { val: '7 (I trust it completely)' },
        ],
        required: true,
        id: 'q-3-2',
      },
      {
        content: 'Is the [tool] reliable? Do you think it is safe?',
        responseType: 'Likert',
        responseOptions: [
          { val: '1 (I do not trust it at all.)' },
          { val: '2' },
          { val: '3' },
          { val: '4' },
          { val: '5' },
          { val: '6' },
          { val: '7 (I trust it completely)' },
        ],
        required: true,
        id: 'q-3-3',
      },
      {
        content: 'Is the [tool] efficient at what it does?',
        responseType: 'Likert',
        responseOptions: [
          { val: '1 (I do not trust it at all.)' },
          { val: '2' },
          { val: '3' },
          { val: '4' },
          { val: '5' },
          { val: '6' },
          { val: '7 (I trust it completely)' },
        ],
        required: true,
        id: 'q-3-4',
      },
    ],
  },
  {
    name: 'Trust Scale (Hoffman)',
    category: 'Trust',
    id: 'q-4',
    questions: [
      {
        content: 'I am confident in the [tool]. I feel that it works well.',
        responseType: 'Likert',
        responseOptions: [
          { val: 'I agree strongly' },
          { val: 'I agree somewhat' },
          { val: "I'm neutral about it" },
          { val: 'I disagree somewhat' },
          { val: 'I disagree strongly' },
        ],
        required: true,
        id: 'q-4-1',
      },
      {
        content: 'The outputs of the [tool] are very predictable.',
        responseType: 'Likert',
        responseOptions: [
          { val: 'I agree strongly' },
          { val: 'I agree somewhat' },
          { val: "I'm neutral about it" },
          { val: 'I disagree somewhat' },
          { val: 'I disagree strongly' },
        ],
        required: true,
        id: 'q-4-2',
      },
      {
        content: 'I feel safe that when I rely on the [tool] I will get the right answers.',
        responseType: 'Likert',
        responseOptions: [
          { val: 'I agree strongly' },
          { val: 'I agree somewhat' },
          { val: "I'm neutral about it" },
          { val: 'I disagree somewhat' },
          { val: 'I disagree strongly' },
        ],
        required: true,
        id: 'q-4-3',
      },
      {
        content: 'The [tool] is efficient in that it works very quickly.',
        responseType: 'Likert',
        responseOptions: [
          { val: 'I agree strongly' },
          { val: 'I agree somewhat' },
          { val: "I'm neutral about it" },
          { val: 'I disagree somewhat' },
          { val: 'I disagree strongly' },
        ],
        required: true,
        id: 'q-4-4',
      },
      {
        content: 'I am wary of the [tool].',
        responseType: 'Likert',
        responseOptions: [
          { val: 'I agree strongly' },
          { val: 'I agree somewhat' },
          { val: "I'm neutral about it" },
          { val: 'I disagree somewhat' },
          { val: 'I disagree strongly' },
        ],
        required: true,
        id: 'q-4-5',
      },
      {
        content: ' The [tool] can perform the task better than a novice human user.',
        responseType: 'Likert',
        responseOptions: [
          { val: 'I agree strongly' },
          { val: 'I agree somewhat' },
          { val: "I'm neutral about it" },
          { val: 'I disagree somewhat' },
          { val: 'I disagree strongly' },
        ],
        required: true,
        id: 'q-4-6',
      },
      {
        content: 'I like using the system for decision making.',
        responseType: 'Likert',
        responseOptions: [
          { val: 'I agree strongly' },
          { val: 'I agree somewhat' },
          { val: "I'm neutral about it" },
          { val: 'I disagree somewhat' },
          { val: 'I disagree strongly' },
        ],
        required: true,
        id: 'q-4-7',
      },
    ],
  },
];

export type PersonaType = {
  evaluation: Questionnaire;
  updatePersona?: any;
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
  updatePersona,
  persona,
  usecaseId,
  intent_cat,
}) => {
  const [questions, setQuestions] = useState(evaluation.questions || []);
  // New Load Quesionts Popu Functions
  const [isQuestionModal2Visible, setIsQuestionModal2Visible] = useState(false);
  const [importQuestionnaire, setImportQuestionnaire] = useState(undefined);
  const [isChangedQuestion, setIsChangedQuestion] = useState(false);

  const showModalQ2 = () => {
    setIsQuestionModal2Visible(true);
  };

  const handleOkQ2 = () => {
    setIsQuestionModal2Visible(false);
  };

  const handleCancelQ2 = () => {
    setIsQuestionModal2Visible(false);
  };

  const updateQuestions = (temp: Question[]) => {
    const temp_persona = evaluation;
    evaluation.questions = temp;
    updatePersona(temp_persona);
  };

  const onFinish2 = (values: any) => {
    if (values.questions.length > 0) setIsChangedQuestion(true);
    else setIsChangedQuestion(false);

    const questionList: Question[] =
      // collect questions based on the id from pre-existing questionnaires
      questionnaires
        .filter((q) => q.id == values.questionnaire)[0]
        ?.questions?.filter((q) => values.questions.includes(q.id))
        ?.map((q) => ({
          ...q,
          id: 'q-' + uuidv4(),
          dimension: questionnaires.filter((qs) => qs.id == values.questionnaire)[0].category,
        })) || [];

    handleOkQ2();

    setQuestions([...questions, ...questionList]);
    updateQuestions([...questions, ...questionList]);

    message.success({ content: 'Succesfully Added Question', duration: 2 });
  };

  const addQuestion = () => {
    const blank_obj: Question = {
      id: 'q-' + uuidv4(),
      responseOptions: [{ val: 'Option 1' }, { val: 'Option 2' }],
    };

    const append = [blank_obj, ...questions];

    setIsChangedQuestion(true);
    setQuestions(append);
    updateQuestions(append);

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
    } else if (question.responseType === 'Nnumber') {
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
      await api_persona_save_intent_evaluation(usecaseId, persona.id, intent_cat, questions);
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
              onChange={(newQuestions) => {
                setQuestions(newQuestions);
                setIsChangedQuestion(true);
              }}
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
            label="select a questionnaire"
            name="questionnaire"
            tooltip="This is a required field"
            initialValue={importQuestionnaire}
            rules={[{ required: true, message: 'Input is required!' }]}
          >
            <Select defaultValue={importQuestionnaire}>
              {questionnaires.map((questionnaire) => (
                <Select.Option key={questionnaire.id} value={questionnaire.id}>
                  {questionnaire.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          {importQuestionnaire && (
            <Form.Item
              label="select questions"
              name="questions"
              tooltip="This is a required field"
              rules={[{ required: true, message: 'Input is required!' }]}
            >
              <Checkbox.Group
                className="checkbox-group"
                options={
                  questionnaires
                    .filter((q) => q.id == importQuestionnaire)[0]
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
