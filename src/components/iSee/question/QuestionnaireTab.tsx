import { DownloadOutlined, SaveOutlined } from '@ant-design/icons';
import { Form, Button, Card, Empty, Col, Row, Select, message } from 'antd';
import type { Question, Questionnaire } from '@/models/questionnaire';
import QuestionnaireEditor from '@/components/iSee/question/toolkit/QuestionnaireEditor';
import Modal from 'antd/lib/modal/Modal';
import { useState } from 'react';
import DATA_FILEDS from '@/models/common';
import type { Persona } from '@/models/persona';
import { api_persona_save_intent_evaluation } from '@/services/isee/usecases';

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
    console.log('Success:', values);

    if (values.questions.length > 0) setIsChangedQuestion(true);
    else setIsChangedQuestion(false);

    const questionList: Question[] = questionnaires
      .map(
        (questionnaire) =>
          (questionnaire.questions &&
            questionnaire.questions.map((question) => ({
              ...question,
              category: questionnaire.category,
            }))) ||
          [],
      )
      .flat()
      .filter((question) => question && values.questions.includes(question.id));

    setQuestions([...questions, ...questionList]);

    updateQuestions([...questions, ...questionList]);
    handleOkQ2();
    message.success('Succesfully Added Question');
  };

  // New Persona Popu Functions

  const [isQuestionModalVisible, setIsQuestionModalVisible] = useState(false);

  const handleOkQ = () => {
    setIsQuestionModalVisible(false);
  };

  const handleCancelQ = () => {
    setIsQuestionModalVisible(false);
  };

  const onFinish = (values: any) => {
    console.log('Success:', values);

    const blank_obj: Question = {
      id: 'q-' + Math.floor(Math.random() * 100000) + 1,
      completed: false,
      text: 'Question',
      metric: 'Free-Text',
      required: false,
      category: values.category,
    };

    const append = [...questions, blank_obj];
    setQuestions(append);
    console.log('Success:', blank_obj);
    console.log('append:', append);
    setIsChangedQuestion(true);
    updateQuestions(append);
    handleOkQ();
    message.success('Succesfully Added Question');
  };

  async function saveQuestionnaire() {
    console.log('Saveeee');
    console.log(questions);
    await api_persona_save_intent_evaluation(usecaseId, persona.id, intent_cat, questions);

    setIsChangedQuestion(false);
    message.success('Saved Evaluation Questionaire');
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
              <Button
                type="primary"
                disabled={!isChangedQuestion}
                onClick={() => saveQuestionnaire()}
                icon={<SaveOutlined />}
                name="addQuestionButton"
              >
                Save Questionnaire
              </Button>
            </div>
          }
        >
          {questions.length != 0 ? (
            <QuestionnaireEditor
              defaultQuestions={questions}
              onChange={(newQuestions) => {
                setQuestions(newQuestions);
                setIsChangedQuestion(true);
              }}
            />
          ) : (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No Questions" />
          )}
        </Card>
      </Col>

      {/* New Question Popup  */}
      <Modal
        title="Create new Question"
        visible={isQuestionModalVisible}
        key={'eval-modal-' + evaluation.id}
        onCancel={handleCancelQ}
        footer={[
          <Button key="back" onClick={handleCancelQ}>
            Cancel
          </Button>,
          <Button key="create" form={'eval-' + evaluation.id} htmlType="submit" type="primary">
            Create
          </Button>,
        ]}
      >
        <Form
          id={'eval-' + evaluation.id}
          name={'eval-' + evaluation.id}
          layout="vertical"
          labelCol={{ span: 0 }}
          // initialValues={{ remember: true }}
          // onFinish=
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="Questionnaire Category"
            name="category"
            tooltip="This is a required field"
            rules={[{ required: true, message: 'Input is required!' }]}
          >
            <Select>
              {DATA_FILEDS.QUESTION_CATEGORY.map((option) => (
                <Select.Option key={option} value={option}>
                  {option}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>

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
            Create
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
        >
          <Form.Item
            label="select questions"
            name="questions"
            tooltip="This is a required field"
            rules={[{ required: true, message: 'Input is required!' }]}
          >
            <Select mode="multiple">
              {questionnaires.map((questionnaire) => (
                <Select.OptGroup key={questionnaire.id} label={questionnaire.name}>
                  {questionnaire.questions &&
                    questionnaire.questions.map((q) => (
                      <Select.Option key={q.id} value={q.id}>
                        {' '}
                        {q.text}{' '}
                      </Select.Option>
                    ))}
                </Select.OptGroup>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </Row>
  );
};

export default QuestionnaireTab;
