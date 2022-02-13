import { DeleteOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Form, Button, Space, Card, Empty, Divider, Popconfirm, Col, Row, Collapse, Tabs, Tag, Input, Select, message, Badge } from 'antd';
import { Question, Questionnaire } from '@/models/questionnaire';
import QuestionForm from './QuestionForm';
import Modal from 'antd/lib/modal/Modal';
import { useState } from 'react';
import DATA_FILEDS from '@/models/common';
import { Persona } from '@/models/usecase';

// export type QuestionnaireType = {
//     questionnaire: Questionnaire,
//     setPersonas?: React.Dispatch<React.SetStateAction<Persona[]>>

// };

export type PersonaType = {
    persona: Persona,
    updatePersona?: any
};

const { Panel } = Collapse;

const QuestionnaireTab: React.FC<PersonaType> = (props) => {
    const { persona, updatePersona } = props;

    const [questions, setQuestions] = useState(persona.evaluation.questions || []);


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
            text: "Question Name",
            metric: "Free-Text",
            required: false,
            category: values.category
        }

        const append = [...questions, blank_obj]
        setQuestions(append)
        console.log('Success:', blank_obj);
        console.log('append:', append);

        updateQuestions(append)
        handleOkQ();
        message.success('Succesfully Added Question');
    };

    const updateQuestions = (temp: Question[]) => {
        let temp_persona = persona;
        persona.evaluation.questions = temp
        updatePersona(temp_persona)
    };

    // - End

    const genExtra2 = (question: Question, index: number) => (
        <div>
            <Tag color="default">{question.category}</Tag>

            {!question.completed && <Tag color="red">Incomplete</Tag>}
            {question.completed && <Tag color="success">Completed</Tag>}

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
                    icon={<DeleteOutlined />}
                />
            </Popconfirm>
        </div>
    );

    return (
        <Row gutter={24}>
            <Col span={24}>
                <Card
                    size="small"
                    title={'Evaluation Questions'}
                    extra={
                        <Button
                            // className="dynamic-delete-button"
                            // color='primary'
                            // ghost
                            // danger={true}
                            type="primary"
                            // size="small"
                            onClick={() => showModalQ()}
                            icon={<PlusOutlined />}
                            name='addQuestionButton'
                        >
                            Add Question
                        </Button>
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
                                        <QuestionForm question={question} key={"qform-" + question.id} />
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
                onCancel={handleCancelQ}
                footer={[
                    <Button key="back" onClick={handleCancelQ}>
                        Cancel
                    </Button>,
                    <Button form="createQuestion2" key="submitQ" htmlType="submit" type="primary">
                        Create
                    </Button>,
                ]}
            >
                <Form
                    id="createQuestion2"
                    name="createQuestion2"
                    layout="vertical"
                    labelCol={{ span: 0 }}
                    // initialValues={{ remember: true }}
                    // onFinish=
                    onFinish={(values) => {
                        console.log('Success:', values);

                        let blank_obj: Question = {
                            id: "q-" + Math.floor(Math.random() * 100000) + 1,
                            completed: false,
                            text: "Question Name",
                            metric: "Free-Text",
                            required: false,
                            category: values.category
                        }

                        const append = [...questions, blank_obj]
                        setQuestions(append)
                        console.log('Success:', blank_obj);
                        console.log('append:', append);

                        updateQuestions(append)
                        handleOkQ();
                        message.success('Succesfully Added Question');
                    }}

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
