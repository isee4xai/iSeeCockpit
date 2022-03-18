import { DeleteOutlined, DownloadOutlined, MinusCircleOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons';
import { Form, Button, Space, Card, Empty, Divider, Popconfirm, Col, Row, Collapse, Tabs, Tag, Input, Select, message, Badge } from 'antd';
import { Question, Questionnaire } from '@/models/questionnaire';
import QuestionForm from './QuestionForm';
import Modal from 'antd/lib/modal/Modal';
import { useState } from 'react';
import DATA_FILEDS from '@/models/common';
import { Persona } from '@/models/persona';
import { api_persona_save_intent_evaluation } from '@/services/isee/usecases';

// export type QuestionnaireType = {
//     questionnaire: Questionnaire,
//     setPersonas?: React.Dispatch<React.SetStateAction<Persona[]>>

// };

export type PersonaType = {
    evaluation: Questionnaire,
    updatePersona?: any,
    persona: Persona,
    usecaseId: string,
    intent_cat: string
};

const { Panel } = Collapse;

const QuestionnaireTab: React.FC<PersonaType> = (props) => {
    const { evaluation, updatePersona, persona, usecaseId, intent_cat } = props;

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

    const onFinish2 = (values: any) => {
        console.log('Success:', values);

        let blank_obj: Question = {
            id: "q-" + Math.floor(Math.random() * 100000) + 1,
            completed: false,
            text: "Question",
            metric: "Free-Text",
            required: false,
            category: values.category
        }

        const append = [...questions, blank_obj]
        setQuestions(append)
        console.log('Success:', blank_obj);

        updateQuestions(append)
        handleOkQ2();
        message.success('Succesfully Added Question');
    };

    // New Persona Popu Functions
    const [isQuestionModalVisible, setIsQuestionModalVisible] = useState(false);

    const showModalQ = () => {
        setIsQuestionModalVisible(true);
    };

    const handleOkQ = () => {
        setIsQuestionModalVisible(false);
    };

    const handleCancelQ = () => {
        setIsQuestionModalVisible(false);
    };

    const onFinish = (values: any) => {
        console.log('Success:', values);

        let blank_obj: Question = {
            id: "q-" + Math.floor(Math.random() * 100000) + 1,
            completed: false,
            text: "Question",
            metric: "Free-Text",
            required: false,
            category: values.category
        }

        const append = [...questions, blank_obj]
        setQuestions(append)
        console.log('Success:', blank_obj);
        console.log('append:', append);
        setIsChangedQuestion(true);
        updateQuestions(append)
        handleOkQ();
        message.success('Succesfully Added Question');
    };

    const updateQuestions = (temp: Question[]) => {
        let temp_persona = evaluation;
        evaluation.questions = temp
        updatePersona(temp_persona)
    };

    // - End

    const genExtra2 = (question: Question, index: number) => (
        <div>

            <Tag color="default">{question.category}</Tag>

            {/* {!question.completed && <Tag color="red">Incomplete</Tag>}
            {question.completed && <Tag color="success">Completed</Tag>} */}

            <Popconfirm
                title={'Are you sure to delete?'}
                onConfirm={() => {
                    let temp = questions.filter(p => p.id !== question.id)
                    setQuestions(temp);
                    updateQuestions(temp)
                }}

                okText="Yes"
                cancelText="No"
            >
                <Button
                    danger={true}
                    size="small"
                    className="dynamic-delete-button"
                    onClick={event => {

                        event.stopPropagation();
                    }}
                    icon={<DeleteOutlined />}
                ></Button>
            </Popconfirm>
        </div>
    );

    async function saveQuestionnaire() {
        console.log("Saveeee");
        console.log(questions)
        await api_persona_save_intent_evaluation(usecaseId, persona.id, intent_cat, questions);

        setIsChangedQuestion(false);
        message.success("Saved Evaluation Questionaire")

    }

    function changeQuestion(question: Question) {
        const q_index = questions.findIndex((obj => obj.id == question.id));

        let temp_questions = questions;
        temp_questions[q_index] = question;

        setQuestions(temp_questions);
        setIsChangedQuestion(true);

        console.log(question);
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
                                // className="dynamic-delete-button"
                                // color='primary'
                                // ghost
                                // danger={true}
                                // type="primary"
                                // size="small"
                                onClick={() => showModalQ2()}
                                icon={<DownloadOutlined />}
                                name='2addQuestionButton'
                            >
                                Load Questionaire
                            </Button>
                            &nbsp;
                            <Button
                                // className="dynamic-delete-button"
                                // color='primary'
                                // ghost
                                // danger={true}
                                // type="primary"
                                // size="small"
                                onClick={() => showModalQ()}
                                icon={<PlusOutlined />}
                                name='addQuestionButton'
                            >
                                Add Question
                            </Button>
                            &nbsp;
                            <Button
                                // className="dynamic-delete-button"
                                // color='primary'
                                // ghost
                                // danger={true}
                                type="primary"
                                disabled={!isChangedQuestion}
                                // size="small"
                                onClick={() => saveQuestionnaire()}
                                icon={<SaveOutlined />}
                                name='addQuestionButton'
                            >
                                Save Questionnaire
                            </Button>
                        </div>

                    }
                >
                    {
                        questions.length != 0 ? (
                            <Collapse>
                                {questions.map((question, index) => (
                                    <Panel
                                        header={question.text}
                                        key={"panelq-" + question.id}
                                        extra={genExtra2(question, index)}
                                    >
                                        <QuestionForm
                                            question={question}
                                            changeQuestion={changeQuestion}
                                            key={"qform-" + question.id} />
                                    </Panel>

                                ))}
                            </Collapse>

                        ) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No Questions" />
                    }
                </Card>
            </Col>

            {/* New Question Popup  */}
            <Modal
                title="Create new Question"
                visible={isQuestionModalVisible}
                key={"eval-modal-" + evaluation.id}
                onCancel={handleCancelQ}
                footer={[
                    <Button key="back" onClick={handleCancelQ}>
                        Cancel
                    </Button>,
                    <Button form={"eval-" + evaluation.id} htmlType="submit" type="primary">
                        Create
                    </Button>,
                ]}
            >
                <Form
                    id={"eval-" + evaluation.id}
                    name={"eval-" + evaluation.id}
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
                    // initialValues={{ remember: true }}
                    // onFinish=
                    onFinish={onFinish2}
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
        </Row>
    );
};

export default QuestionnaireTab;
