import {
  DownloadOutlined,
  SaveOutlined,
  DashboardOutlined,
  FieldStringOutlined,
  CheckCircleOutlined,
  FieldNumberOutlined,
  CheckSquareOutlined,
} from '@ant-design/icons';
import { Form, Button, Card, Col, Row, Empty, Select, message, Checkbox } from 'antd';
import type { Question, Questionnaire } from '@/models/questionnaire';
import QuestionnaireEditor from '@/components/iSee/question/toolkit/QuestionnaireEditor';
import Modal from 'antd/lib/modal/Modal';
import { useState } from 'react';
import type { Persona } from '@/models/persona';
import { api_persona_save_intent_evaluation } from '@/services/isee/usecases';
import { v4 as uuidv4 } from 'uuid';
const questionnaires: Questionnaire[] = [
  {
    name: 'Explanation Satisfaction Scale (Hoffman)',
    category: 'Satisfaction',
    id: 'q-1',
    questions: [
      {
        text: 'From the explanation, I understand how the AI model works.',
        metric: 'Likert',
        metric_values: [
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
        text: 'This explanation of how the AI model works is satisfying.',
        metric: 'Likert',
        metric_values: [
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
        text: 'This explanation of how the AI model works has sufficient detail.',
        metric: 'Likert',
        metric_values: [
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
        text: 'This explanation of how the AI model works seems complete.',
        metric: 'Likert',
        metric_values: [
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
        text: 'This explanation of how the AI model works tells me how to use it',
        metric: 'Likert',
        metric_values: [
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
        text: 'This explanation of how the AI model works is useful to my goals.',
        metric: 'Likert',
        metric_values: [
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
        text: 'This explanation of the [software, algorithm, tool] shows me how accurate the AI model is.',
        metric: 'Likert',
        metric_values: [
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
        text: 'This explanation lets me judge when I should trust and not trust the AI model. ',
        metric: 'Likert',
        metric_values: [
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
        text: 'The explanation helps me understand how the AI model works.',
        metric: 'Radio',
        metric_values: [{ val: 'Yes' }, { val: 'No' }],
        required: true,
        id: 'q-2-1',
      },
      {
        text: 'The explanation of how the AI model works is satisfying.',
        metric: 'Radio',
        metric_values: [{ val: 'Yes' }, { val: 'No' }],
        required: true,
        id: 'q-2-2',
      },
      {
        text: 'The explanation of the AI model sufficiently detailed. ',
        metric: 'Radio',
        metric_values: [{ val: 'Yes' }, { val: 'No' }],
        required: true,
        id: 'q-2-3',
      },
      {
        text: 'The explanation of how the AI model works is sufficiently complete.',
        metric: 'Radio',
        metric_values: [{ val: 'Yes' }, { val: 'No' }],
        required: true,
        id: 'q-2-4',
      },
      {
        text: 'The explanation is actionable, that is, it helps me know how to use the AI M=model',
        metric: 'Radio',
        metric_values: [{ val: 'Yes' }, { val: 'No' }],
        required: true,
        id: 'q-2-5',
      },
      {
        text: 'The explanation lets me know how accurate or reliable the AI model is.',
        metric: 'Radio',
        metric_values: [{ val: 'Yes' }, { val: 'No' }],
        required: true,
        id: 'q-2-6',
      },
      {
        text: 'The explanation lets me know how trustworthy the AI model is.',
        metric: 'Radio',
        metric_values: [{ val: 'Yes' }, { val: 'No' }],
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
        text: 'What is your confidence in the [tool]? Do you have a feeling of trust in it?',
        metric: 'Likert',
        metric_values: [
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
        text: 'Are the actions of the [tool] predictable?',
        metric: 'Likert',
        metric_values: [
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
        text: 'Is the [tool] reliable? Do you think it is safe?',
        metric: 'Likert',
        metric_values: [
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
        text: 'Is the [tool] efficient at what it does?',
        metric: 'Likert',
        metric_values: [
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
        text: 'I am confident in the [tool]. I feel that it works well.',
        metric: 'Likert',
        metric_values: [
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
        text: 'The outputs of the [tool] are very predictable.',
        metric: 'Likert',
        metric_values: [
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
        text: 'I feel safe that when I rely on the [tool] I will get the right answers.',
        metric: 'Likert',
        metric_values: [
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
        text: 'The [tool] is efficient in that it works very quickly.',
        metric: 'Likert',
        metric_values: [
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
        text: 'I am wary of the [tool].',
        metric: 'Likert',
        metric_values: [
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
        text: ' The [tool] can perform the task better than a novice human user.',
        metric: 'Likert',
        metric_values: [
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
        text: 'I like using the system for decision making.',
        metric: 'Likert',
        metric_values: [
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
    setImportQuestionnaire(undefined);
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
      questionnaires
        .filter((q) => q.id == values.questionnaire)[0]
        ?.questions?.filter((q) => values.questions.includes(q.id))
        ?.map((q) => ({ ...q, id: 'q-' + uuidv4() })) || [];

    handleOkQ2();

    setQuestions([...questions, ...questionList]);
    updateQuestions([...questions, ...questionList]);

    message.success('Succesfully Added Question');
  };

  const addQuestion = () => {
    const blank_obj: Question = {
      id: 'q-' + uuidv4(),
    };

    const append = [blank_obj, ...questions];

    setIsChangedQuestion(true);
    setQuestions(append);
    updateQuestions(append);

    message.success('Succesfully Added Question');
  };

  const isQuestionValid = (question: Question) => {
    // this function return true if the text isn't juste space or emty
    // and if the type is valid, in certain case metric values must be longer than 0
    // and also if the category is valid
    // otherwise return false

    if (!question.text || question.text.trim() === '') {
      return false;
    }

    if (!['Free-Text', 'Radio', 'Checkbox', 'Number', 'Likert'].includes(question.metric ?? '')) {
      return false;
    } else {
      if (['Likert', 'Radio', 'Checkbox'].includes(question.metric ?? '')) {
        if (!question.metric_values || question.metric_values.length === 0) {
          return false;
        }
      }
    }

    if (
      ![
        'Goodness',
        'Satisfaction',
        'Mental Model',
        'Curiosity',
        'Trust',
        'Performance',
        'Custom',
      ].includes(question.category ?? '')
    ) {
      return false;
    }

    return true;
  };

  const isQuestionnaireValid = () => questions.every((question) => isQuestionValid(question));

  async function saveQuestionnaire() {
    // console log some text using css to style it
    console.log('%c Saving.... ', 'font-size: 20px; color: orange;');

    if (isQuestionnaireValid()) {
      console.log('%c Valid ! ', 'font-size: 20px; color: green;');
      setIsChangedQuestion(false);
      await api_persona_save_intent_evaluation(usecaseId, persona.id, intent_cat, questions);
      message.success('Saved Evaluation Questionnaire');
    } else {
      console.log('%c Invalid ! ', 'font-size: 20px; color: red;');

      message.error('Invalid Evaluation Questionnaire');
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
              noAdd
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
            label="select a questionnaire"
            name="questionnaire"
            tooltip="This is a required field"
            rules={[{ required: true, message: 'Input is required!' }]}
          >
            <Select>
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
                options={
                  questionnaires
                    .filter((q) => q.id == importQuestionnaire)[0]
                    ?.questions?.map((q) => ({
                      label: (
                        <>
                          {questionTypeToIcon[q.metric ?? '']} {q.text ?? ''}
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
