import type { Persona, PersonaIntent } from '@/models/persona';
import {
  api_persona_delete_intent,
  api_persona_new_intent,
  api_persona_query_set_default,
  api_persona_query_strategies,
  api_persona_update_intent,
} from '@/services/isee/usecases';
import { CheckOutlined, CloseOutlined, DeleteOutlined, EyeOutlined, PlusOutlined, RocketFilled } from '@ant-design/icons';
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
  notification,
  Popconfirm,
  Progress,
  Row,
  Select,
  Switch,
  Tabs,
  Tag,
} from 'antd';
import { useState } from 'react';
import QuestionnaireTab from '../question/QuestionnaireTab';
import DATA_FILEDS from '@/models/common';
import { IntentQuestion } from '@/models/questionnaire';

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

  const removeQuestion = async (intent: PersonaIntent, question: IntentQuestion) => {
    const questions = intent.questions?.filter((q) => q.id !== question.id);

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

  const getStrategies = async (intent: PersonaIntent) => {

    message.config({
      top: 400,
    });
    const hide = message.loading(
      'Retrieving explanation strategies from iSee CBR...',
      0,
    );
    // Dismiss manually and asynchronously
    const strategies = await api_persona_query_strategies(usecaseId, personaState._id, intent.id);
    intent.strategies = strategies
    intent.strategy_selected = false
    hide();

    notification.success({
      message: 'Retrieved Strategies for "' + intent.label + '" Intent',
      placement: 'top',
      duration: 3,
    });

    setPersonaState((old) => ({
      ...old,
      intents: personaState.intents?.map((i) => {
        return i;
      }),
    }));
  };

  const setSelectedStrategy = async (event: any, intent: PersonaIntent, strategy: any) => {

    message.config({
      top: 400,
    });
    const hide = message.loading(
      'Setting as default strategy...',
      0,
    );
    await api_persona_query_set_default(usecaseId, personaState._id, intent.id, strategy.id);

    hide()
    strategy.selected = event
    intent.strategy_selected = strategy.tree
    setPersonaState((old) => ({
      ...old,
      intents: personaState.intents?.map((i) => {
        return i;
      }),
    }));
  };

  const onFinishNewIntent = async (values: any) => {
    const newintent = JSON.parse(values.name)
    const intent_cat = newintent.category;
    let intent_question = newintent.question;
    intent_question.id = 'iq-' + Math.floor(Math.random() * 100000) + 1;

    let exists = false;
    let unique = true;
    personaState.intents?.forEach((intent) => {
      if (intent.name == intent_cat.name) {
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
          name: intent_cat.name,
          label: intent_cat.label,
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
        const intent = personaState.intents?.find((inte) => inte.name == intent_cat.name);
        if (intent) {
          await api_persona_update_intent(usecaseId, personaState._id, intent.id, intent);
        }
      }
    }
    // setPersonas([...personas, blank_obj]);
    // console.log('Success:', persona);
    handleOk();
    message.success('Succesfully Added Intent Question');
  };

  // - End

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
            header={getHeader(intent.label + "")}
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
                          key={question.id}
                          actions={[
                            <Popconfirm
                              key={'delete-intent-question-' + question.id}
                              title={'Are you sure to delete?'}
                              onConfirm={() => removeQuestion(intent, question)}
                              okText="Yes"
                              cancelText="No"
                            >
                              <Button
                                key={'intent-question-' + question.text + '-delete'}
                                danger={true}
                                size="small"
                                className="dynamic-delete-button"
                                icon={<DeleteOutlined />}
                              />
                            </Popconfirm>,
                          ]}
                        >
                          {question.text}
                        </List.Item>
                      );
                    })}
                  </Col>
                </Row>
              </Tabs.TabPane>
              <Tabs.TabPane tab="Explanation Strategy" key="3">
                {intent.strategies &&
                  <Row gutter={[20, 20]}>
                    {intent.strategies?.map((strategy) => (
                      <Col span={12}>
                        <Card size="small" title={strategy.name.replace('http://www.w3id.org/iSeeOnto/explanationexperience/', '')}
                          extra={
                            <>
                              <p>Set as Default:&nbsp;
                                <Switch
                                  checked={strategy.selected}
                                  disabled={intent.strategy_selected}
                                  onClick={(event) => setSelectedStrategy(event, intent, strategy)}
                                  checkedChildren={<CheckOutlined />}
                                  unCheckedChildren={<CloseOutlined />}
                                />
                              </p>
                            </>
                          }
                        >
                          <div>
                            <Progress percent={strategy.percentage} status="active" strokeColor={{ from: '#108ee9', to: '#87d068' }} style={{ paddingRight: 20 }} />
                          </div>
                          <p>Explaination Methods:&nbsp;
                          </p>
                          <p>
                            {strategy.methods.map((m: string) => (
                              <Tag color="blue">{m}</Tag>
                            ))}
                          </p>
                          {(!intent.strategy_selected || strategy.selected) &&
                            <Button href={"https://editor-dev.isee4xai.com/#/vid/" + strategy.tree} target="_blank" type="primary" block shape="round" icon={<EyeOutlined />} >
                              View Strategy
                            </Button>
                          }
                        </Card>
                      </Col>
                    ))}
                  </Row>
                }

                {!intent.strategies && (
                  <Button
                    type="primary"
                    style={{ marginLeft: 10 }}
                    onClick={() => getStrategies(intent)}
                    icon={<RocketFilled />}
                  >
                    Retrieve Explanation Strategies
                  </Button>
                )}

                {intent.strategy_selected && (
                  <Button
                    type="primary"
                    style={{ marginLeft: 10 }}
                    danger
                    onClick={() => getStrategies(intent)}
                    icon={<RocketFilled />}
                  >
                    Retrieve Strategies Again
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
              {DATA_FILEDS.INTENT_QUESTIONS.map((category) => (
                <OptGroup label={category.label} key={category.name}>
                  {category.questions.map((question) => (
                    <Option
                      key={category.name + "#" + question.text + '#' + question.target}
                      value={JSON.stringify({ category: category, question: question })}
                    >
                      {question.text}
                    </Option>
                  ))}
                </OptGroup>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </Card >
  );
};

export default PersonaIntents;
