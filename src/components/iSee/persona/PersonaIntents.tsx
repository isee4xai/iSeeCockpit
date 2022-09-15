import type { Persona, PersonaIntent } from '@/models/persona';
import {
  api_persona_delete_intent,
  api_persona_new_intent,
  api_persona_update_intent,
} from '@/services/isee/usecases';
import { DeleteOutlined, PlusOutlined, RocketFilled } from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  Collapse,
  Empty,
  Form,
  Image,
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
  persona: Persona;
  usecaseId: string;
  updatePersona: any;
};

const PersonaIntents: React.FC<PersonaType> = (props) => {
  const { persona, updatePersona, usecaseId } = props;
  const [personaState, setPersonaState] = useState(persona);

  const genIntentStatus = (intent: PersonaIntent) => (
    <div>
      {!intent.completed && <Tag color="red">Incomplete Intent</Tag>}
      {intent.completed && <Tag color="success">Completed Intent</Tag>}

      <Popconfirm
        title={'Are you sure to delete?'}
        onConfirm={async () => {
          const temp = personaState.intents?.filter((i) => i.id !== intent.id);

          setPersonaState((old) => ({ ...old, intents: temp }));

          updatePersona(personaState);

          await api_persona_delete_intent(usecaseId, personaState._id, intent.id);
          message.error('Deleted Persona Intent - ' + intent.name);
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

  // New Persona Popup Functions
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loadStrat, setLoadStrat] = useState(false);

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

  const removeQuestion = async (intent: PersonaIntent, question: string) => {
    const questions = intent.questions?.filter((q) => q !== question);

    if ((questions || []).length === 0) {
      api_persona_delete_intent(usecaseId, personaState._id, intent.id);
      message.error('Deleted Persona Intent - ' + intent.name);
      setPersonaState((old) => ({
        ...old,
        intents: personaState.intents?.filter((i) => i.id !== intent.id),
      }));
    } else {
      api_persona_update_intent(usecaseId, personaState._id, intent.id, {
        ...intent,
        questions,
      });
      message.success('Updated Persona Intent - ' + intent.name);
      setPersonaState((old) => ({
        ...old,
        intents: personaState.intents?.map((i) => {
          if (i.id === intent.id) {
            return { ...i, questions };
          }
          return i;
        }),
      }));
    }
  };

  const onFinishNewIntent = async (values: any) => {
    const newintent = values.name.split('#');
    const intent_cat = newintent[0];
    const intent_question = newintent[1];
    console.log('values:', newintent);
    console.log('persona:', persona);

    let exists = false;
    let unique = true;
    personaState.intents?.forEach((intent) => {
      if (intent.name == intent_cat) {
        if (intent.questions?.includes(intent_question)) {
          unique = false;
        } else {
          intent.questions?.push(intent_question);
        }
        exists = true;
      }
    });

    if (unique) {
      if (!exists) {
        const blank_intent: PersonaIntent = {
          id: 'intent-' + Math.floor(Math.random() * 100000) + 1,
          name: intent_cat,
          completed: false,
          evaluation: {
            _id: 'eval-' + Math.floor(Math.random() * 100000) + 1,
            name: 'eval',
            questions: [],
          },
          questions: [intent_question],
        };
        personaState.intents?.push(blank_intent);
        await api_persona_new_intent(usecaseId, personaState._id, blank_intent);
      } else {
        const intent = personaState.intents?.find((inte) => inte.name == intent_cat);
        if (intent) {
          await api_persona_update_intent(usecaseId, personaState._id, intent.id, intent);
        }
      }
    }

    // setPersonas([...personas, blank_obj]);
    console.log('Success:', persona);
    handleOk();
    message.success('Succesfully Added Intent Question');
  };

  // - End

  const IntentOptions = [
    {
      name: 'Trust',
      questions: ['Which similar cases contributed to this outcome?'],
    },
    {
      name: 'Transparency',
      questions: ['Which features contributed to this outcome?'],
    },
    {
      name: 'About',
      questions: [
        'What is the AI model which decided the outcome?',
        'What data is this outcome based upon?',
      ],
    },
    {
      name: 'Actionable',
      questions: ['How can I change the outcome?', 'What should I change to change the outcome?'],
    },
    {
      name: 'Debugging',
      questions: ['Why was this outcome generated?'],
    },
    {
      name: 'Performance',
      questions: ['How confident was the outcome?', 'How accurate is the AI model?'],
    },
  ];

  return (
    <Card
      title="Persona Intents"
      type="inner"
      extra={
        <Button
          type="primary"
          onClick={showModal}
          htmlType="button"
          icon={<PlusOutlined />}
          key={'intent-card-' + personaState._id}
        >
          Add New Intent Question
        </Button>
      }
    >
      {personaState.intents?.length == 0 ? (
        <Form.Item>
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No Persona Intents Added" />
        </Form.Item>
      ) : null}

      <Collapse key={'intent-collapse-' + personaState._id}>
        {personaState.intents?.map((intent) => (
          <Panel
            header={getHeader(intent.name)}
            key={'panel-intent-' + intent.id}
            extra={genIntentStatus(intent)}
          >
            <Tabs type="card" size="middle" tabPosition="top">
              <Tabs.TabPane key={'intentkey-' + personaState._id} tab={'Intent Questions'}>
                <Row gutter={20}>
                  <Col span={24} className="gutter-row">
                    {intent.questions?.map((question) => {
                      return (
                        <List.Item
                          key={'intent-question-' + question}
                          actions={[
                            <Popconfirm
                              key={'delete-intent-question-' + question}
                              title={'Are you sure to delete?'}
                              onConfirm={() => removeQuestion(intent, question)}
                              okText="Yes"
                              cancelText="No"
                            >
                              <Button
                                key={'intent-question-' + question + '-delete'}
                                danger={true}
                                size="small"
                                className="dynamic-delete-button"
                                icon={<DeleteOutlined />}
                              />
                            </Popconfirm>,
                          ]}
                        >
                          {question}
                        </List.Item>
                      );
                    })}
                  </Col>
                </Row>
              </Tabs.TabPane>
              <Tabs.TabPane tab="Explanation Strategy" key="3">
                {loadStrat && <Image width={600} preview={false} src="/strat.png" />}

                {!loadStrat && (
                  <Button
                    // danger={true}
                    // size="small"
                    type="primary"
                    style={{ marginLeft: 10 }}
                    // className="dynamic-delete-button"
                    onClick={async (event) => {
                      event.stopPropagation();
                      message.config({
                        top: 400,
                      });
                      const hide = message.loading(
                        'Retrieving explanation strategies from iSee CBR...',
                        0,
                      );
                      // Dismiss manually and asynchronously
                      setTimeout(hide, 2000);
                      await new Promise((r) => setTimeout(r, 2000));

                      setLoadStrat(true);
                    }}
                    icon={<RocketFilled />}
                  >
                    Generate Explanation Strategy
                  </Button>
                )}
              </Tabs.TabPane>
              <Tabs.TabPane tab="Evaluation Questionaire" key={'tabpane-' + personaState._id}>
                <QuestionnaireTab
                  key={'qtab-' + personaState._id}
                  evaluation={intent.evaluation}
                  updatePersona={updatePersona}
                  intent_cat={intent.name}
                  persona={persona}
                  usecaseId={usecaseId}
                  // questionnaire={personaState.evaluation_questionnaire || {}}
                />
              </Tabs.TabPane>
            </Tabs>
          </Panel>
        ))}
      </Collapse>

      {/* New Persona Popup  */}
      <Modal
        title={'Add New Intent Question ' + personaState.details.name}
        visible={isModalVisible}
        onCancel={handleCancel}
        key={'intent-modal-' + personaState._id}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button
            form={'intent-addIntent-' + personaState._id}
            key="submit"
            htmlType="submit"
            type="primary"
          >
            Add Intent Question
          </Button>,
        ]}
      >
        <Form
          id={'intent-addIntent-' + personaState._id}
          name={'intent-addIntent-' + personaState._id}
          layout="vertical"
          key={'intent-modal-form-' + personaState._id}
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
              {IntentOptions.map((category) => (
                <OptGroup label={category.name} key={category.name}>
                  {category.questions.map((question) => (
                    <Option
                      key={category.name + '#' + question}
                      value={category.name + '#' + question}
                    >
                      {question}
                    </Option>
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

export default PersonaIntents;
