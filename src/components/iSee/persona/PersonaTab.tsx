import { Intent } from '@/models/intent';
import { Persona } from '@/models/persona';
import { DeleteOutlined, PlusOutlined, RocketFilled, SaveOutlined, UserSwitchOutlined } from '@ant-design/icons';
import {
    Button,
    Card,
    Col,
    Collapse,
    Empty,
    Form,
    List,
    message,
    Modal,
    Popconfirm,
    Row,
    Select,
    Tabs,
    Tag,
} from 'antd';
import { useState } from 'react';
import QuestionnaireTab from '../question/QuestionnaireTab';

const { Panel } = Collapse;
const { Option, OptGroup } = Select;

export type PersonaType = {
    persona: Persona,
    updatePersona: any
};

const PersonaTab: React.FC<PersonaType> = (props) => {
    const { persona, updatePersona } = props

    const genIntentStatus = (intent: Intent) => (

        <div>
            {!intent.completed && <Tag color="red">Incomplete Intent</Tag>}
            {intent.completed && <Tag color="success">Completed Intent</Tag>}

            <Popconfirm
                title={'Are you sure to delete?'}
                // onConfirm={() => {
                //     console.log(persona)
                //     setPersonas(personas.filter(p => p.id !== persona.id));
                // }}
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



    // New Persona Popu Functions
    const [isModalVisible, setIsModalVisible] = useState(false);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };
    const getHeader = (name: string) => (
        <>
            <strong>{name}</strong>&nbsp;Intent
        </>
    );


    const onFinishNewIntent = (values: any) => {
        let newintent = values.name.split("#");
        let intent_cat = newintent[0]
        let intent_question = newintent[1]
        console.log('values:', newintent);
        console.log('persona:', persona);

        let exists = false;
        persona.intents?.forEach(intent => {
            if (intent.name == intent_cat) {
                intent.questions?.push(intent_question);
                exists = true
            }
        });

        if (!exists) {
            const blank_intent: Intent = {
                id: "intent-" + Math.floor(Math.random() * 100000) + 1,
                name: intent_cat,
                completed: false,
                evaluation: { id: "eval-" + Math.floor(Math.random() * 100000) + 1, name: "eval", questions: [] },
                questions: [intent_question]
            }
            persona.intents?.push(blank_intent);
        }

        // setPersonas([...personas, blank_obj]);
        console.log('Success:', persona);
        handleOk();
        message.success('Succesfully Added Intent Question');
    };

    // - End

    const IntentOptions = [
        {
            "name": "About",
            "questions": [
                'I want to know about the result',
                'Tell me more about why this happened?'
            ]
        },
        {
            "name": "Actionable",
            "questions": [
                'I dont know what to put here',
                'I might know what to put here'
            ]

        }
    ];


    return (
        <Card title="Persona Intents" type="inner"
            extra={<Button
                type="primary"
                onClick={showModal}
                htmlType="button"
                icon={<PlusOutlined />}
                key={"intent-card-" + persona.id}
            >
                Add New Intent Question
            </Button>
            }
        >

            {persona.intents?.length == 0 ? (
                <Form.Item>
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No Persona Intents Added" />
                </Form.Item>
            ) : null}

            <Collapse key={"intent-collapse-" + persona.id}>

                {persona.intents?.map((intent, index) => (
                    <Panel header={getHeader(intent.name)} key={"panel-intent-" + intent.id}
                        extra={genIntentStatus(intent)}>
                        <Tabs type="card" size="middle" tabPosition='top' >
                            <Tabs.TabPane
                                key={"intentkey-" + persona.id}
                                tab={'Intent Questions'}
                            >
                                <Row gutter={20}>
                                    <Col span={24} className="gutter-row">
                                        {intent.questions?.map((question, index) => {
                                            return (
                                                <List.Item
                                                    actions={[
                                                        <Button
                                                            danger={true}
                                                            size="small"
                                                            className="dynamic-delete-button"
                                                            icon={<DeleteOutlined />}
                                                        />
                                                    ]}
                                                >
                                                    {question}
                                                </List.Item>
                                            )
                                        })}
                                    </Col>
                                </Row>
                            </Tabs.TabPane>
                            <Tabs.TabPane tab="Explanation Strategy" key="3">
                                <Button
                                    // danger={true}
                                    // size="small"
                                    type='primary'
                                    style={{ marginLeft: 10 }}
                                    // className="dynamic-delete-button"
                                    onClick={event => {

                                        event.stopPropagation();
                                    }}
                                    icon={<RocketFilled />}
                                >Generate Explanation Strategy</Button>
                            </Tabs.TabPane>
                            <Tabs.TabPane tab="Evaluation Questionaire" key={"tabpane-" + persona.id}>
                                <QuestionnaireTab
                                    key={"qtab-" + persona.id}
                                    evaluation={intent.evaluation}
                                    updatePersona={updatePersona}
                                // questionnaire={persona.evaluation_questionnaire || {}}
                                />
                            </Tabs.TabPane>
                        </Tabs>

                    </Panel>
                ))}
            </Collapse>

            {/* New Persona Popup  */}
            <Modal
                title={"Add New Intent Question " + persona.name}
                visible={isModalVisible}
                onCancel={handleCancel}
                key={"intent-modal-" + persona.id}
                footer={[
                    <Button key="back" onClick={handleCancel}>
                        Cancel
                    </Button>,
                    <Button form={"intent-addIntent-" + persona.id} key="submit" htmlType="submit" type="primary">
                        Add Intent Question
                    </Button>,
                ]}
            >
                <Form
                    id={"intent-addIntent-" + persona.id}
                    name={"intent-addIntent-" + persona.id}
                    layout="vertical"
                    key={"intent-modal-form-" + persona.id}
                    labelCol={{ span: 0 }}
                    initialValues={{ remember: true }}
                    onFinish={onFinishNewIntent}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Intent Question"
                        name="name"
                        rules={[{ required: true, message: 'Input is required!' }]}
                    >
                        <Select
                            showSearch
                            placeholder="Select an intent question"
                            optionFilterProp="children"

                        // onChange={onChange}
                        // onSearch={onSearch}
                        // filterOption={(input, option) =>
                        //     option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        // }
                        >
                            {IntentOptions.map((category, index) => (
                                <OptGroup label={category.name}>
                                    {category.questions.map((question, index) => (
                                        <Option value={category.name + "#" + question}>{question}</Option>
                                    ))}
                                </OptGroup>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>

        </Card>


    );
};

export default PersonaTab;
