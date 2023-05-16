import type { Persona, PersonaIntent } from '@/models/persona';
import {
  api_persona_delete_intent,
  api_persona_new_intent,
  api_persona_query_set_default,
  api_persona_query_strategies,
  api_persona_query_strategies_reuse,
  api_persona_update_intent,
} from '@/services/isee/usecases';
import { BulbOutlined, CheckOutlined, CloseOutlined, DeleteOutlined, EditOutlined, ExperimentOutlined, EyeOutlined, HistoryOutlined, PlusOutlined, QuestionCircleOutlined, ReloadOutlined, RocketFilled, SearchOutlined, StarOutlined } from '@ant-design/icons';
import {
  Alert,
  Badge,
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
  Popover,
  Progress,
  Row,
  Select,
  Space,
  Switch,
  Table,
  Tabs,
  Tag,
  Tooltip,
} from 'antd';
import { useEffect, useState } from 'react';
import QuestionnaireTab from '../question/QuestionnaireTab';
import DATA_FILEDS from '@/models/common';
import { IntentQuestion } from '@/models/questionnaire';
import TOOL_TIPS from '@/models/tooltips';

const { Panel } = Collapse;
const { Option, OptGroup } = Select;

export type PersonaType = {
  persona: Persona;
  usecaseId: string;
  updatePersona: any;
  ontoExplainers: any;
  ontoValues?: API.OntoParams

};

const PersonaIntents: React.FC<PersonaType> = (props) => {
  const { persona, updatePersona, usecaseId } = props;
  const [personaState, setPersonaState] = useState(persona);

  const genIntentStatus = (intent: PersonaIntent) => {
    let intent_status = intent.strategy_selected && (intent?.evaluation?.questions && intent?.evaluation?.questions?.length > 0) || false;

    console.log("genIntentStatus", intent_status)
    return (<div>
      {!intent_status && <Tag color="red">Incomplete Intent</Tag>}
      {intent_status && <Tag color="success">Completed Intent</Tag>}

      <Popconfirm
        title={'Are you sure to delete?'}
        onConfirm={async () => {
          const temp = personaState.intents?.filter((i) => i.id !== intent.id);

          setPersonaState((old) => ({ ...old, intents: temp }));

          updatePersona(personaState);

          await api_persona_delete_intent(usecaseId, personaState._id, intent.id);
          message.error('Deleted Persona Intent - ' + intent.label);
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
    </div>)
  };

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
      message.error('Deleted Persona Intent - ' + intent.label);
      setPersonaState((old) => ({
        ...old,
        intents: personaState.intents?.filter((i) => i.id !== intent.id),
      }));
    } else {
      api_persona_update_intent(usecaseId, personaState._id, intent.id, {
        ...intent,
        questions,
      });
      message.success('Intent Question Removed Successfully');
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

  const updateIntentEvaluation = async (intent: PersonaIntent, questions: any) => {
    console.log(intent)
    console.log(questions)
    const evaluation = { questions: questions }

    setPersonaState((old) => ({
      ...old,
      intents: personaState.intents?.map((i) => {
        if (i.id === intent.id) {
          return { ...i, evaluation };
        }
        return i;
      }),
    }));

  };

  const getStrategies = async (intent: PersonaIntent, loadMore: boolean) => {
    message.config({
      top: 400,
    });

    const hide = message.loading(
      'Retrieving explanation strategies from iSee CBR...',
      0,
    );

    // Dismiss manually and asynchronously
    const strategies = await api_persona_query_strategies(usecaseId, personaState._id, intent.id, loadMore);
    intent.strategies = strategies
    intent.strategy_selected = false
    hide();

    if (strategies.length > 0) {
      notification.success({
        message: 'Retrieved Strategies for "' + intent.label + '" Intent',
        placement: 'top',
        duration: 3,
      });
    }

    setPersonaState((old) => ({
      ...old,
      intents: personaState.intents?.map((i) => {
        return i;
      }),
    }));
  };

  const getStrategiesReuse = async (intent: PersonaIntent) => {
    message.config({
      top: 400,
    });

    const hide = message.loading(
      'Generating a personalised strategy from iSee CBR... Please Wait...',
      0,
    );

    // Dismiss manually and asynchronously
    const strategies = await api_persona_query_strategies_reuse(usecaseId, personaState._id, intent.id);

    console.log(strategies)
    intent.strategies = strategies
    intent.strategy_selected = false
    hide();

    if (strategies.length > 0) {
      notification.success({
        message: 'Generated Personalised Strategy for "' + intent.label + '" Intent',
        placement: 'top',
        duration: 3,
      });
    }

    setPersonaState((old) => ({
      ...old,
      intents: personaState.intents?.map((i) => {
        return i;
      }),
    }));
  };

  const setSelectedStrategy = async (event: any, strategy: any) => {

    message.config({
      top: 400,
    });
    const hide = message.loading(
      'Setting as default strategy...',
      0,
    );

    let selectedIntent: PersonaIntent = {
      id: "",
      completed: false,
      name: "",
      evaluation: {}
    };

    personaState?.intents?.forEach(intent_ => {
      intent_.strategies?.forEach(strat => {
        if (strat.id == strategy.id) {
          selectedIntent = intent_;
        }
      })
    });

    if (selectedIntent.id == "") {
      hide()
      message.error("Couldnt find a matching intent!")
    } else {
      await api_persona_query_set_default(usecaseId, personaState._id, selectedIntent.id, strategy.id);
      hide()
      selectedIntent.strategies?.forEach(strat => {
        if (strat.id != strategy.id) {
          strat.selected = false
        }
      })
      strategy.selected = event
      selectedIntent.strategy_selected = strategy.tree
      setPersonaState((old) => ({
        ...old,
        intents: personaState.intents?.map((i) => {
          return i;
        }),
      }));
    }
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
        // Validate if the question is already existing in the intent
        let validateExisting = intent.questions?.filter(e => e?.text === intent_question.text) || []
        if (validateExisting?.length > 0) {
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
      message.success('Succesfully Added Intent Question');
    } else {
      message.warning('Intent Question Already Exists');
    }

    handleOk();
  };


  const retrievalTableColumns = [
    {
      title: 'Select',
      key: 'select',
      render: (_: any, strategy: any) =>
      (<Switch
        checked={strategy.selected}
        onClick={(event) => setSelectedStrategy(event, strategy)}
        checkedChildren={<CheckOutlined />}
        unCheckedChildren={<CloseOutlined />}
      />
      )
    },
    {
      title: 'Similarity Score',
      dataIndex: 'percentage',
      key: 'percentage',
      render: (val: number, obj: any, index: number) =>
        <>
          {obj.percentage != "reuse" &&
            <Progress
              percent={val} steps={5} strokeWidth={15}
              strokeColor={val < 50 ? "#ff4d4f" : (val < 80 ? "#108ee9" : "#6fc648")}
            />
          }
          {obj.percentage == "reuse" &&
            <p>
              <Tag style={{ fontSize: 13, padding: 5 }} icon={<BulbOutlined />} color="green">Generated Strategy</Tag>
            </p>
          }

          {obj.index == 1 && <p>
            <Tag style={{ fontSize: 13, padding: 5 }} icon={<StarOutlined />} color="orange">
              Recommended
            </Tag>
          </p>
          }
        </>
    },
    {
      title: 'Explainers',
      dataIndex: 'methods',
      key: 'methods',
      render: (methods: any) =>
        <>{methods.map((m: string) => (
          <p>
            <Tag color="blue">{m}</Tag>
            <Popover placement='right' content={
              <>
                <table style={{ width: 400 }}>
                  <tbody>
                    <tr>
                      <td style={{ paddingRight: 5 }}><strong>Explainer Description</strong></td>
                      <td>{props.ontoExplainers[m]?.explainer_description}
                        <hr></hr>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ paddingRight: 5 }}><strong>Explanation Description</strong></td>
                      <td>{props.ontoExplainers[m]?.explanation_description}
                        <hr></hr>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </>
            } title={m} trigger="click">
              <Button size="small"
                icon={<QuestionCircleOutlined />}
              >
                More Info
              </Button>
            </Popover>
            <br></br>
          </p>
        ))}</>
    },
    {
      title: 'BT Strategy',
      key: 'bt',
      render: (_: any, strategy: any) => (
        <> <p>
          <Button block href={"https://editor-dev.isee4xai.com/#/vid/" + strategy.tree} target="_blank" type="primary" shape="round" ghost icon={<EyeOutlined />} >
            View
          </Button>
        </p>
          <p style={{ marginTop: -10 }}>
            <Button block href={"https://editor-dev.isee4xai.com/#/id/" + strategy.tree} target="_blank" type="dashed" shape="round" icon={<EditOutlined />} >
              Edit
            </Button>
          </p></>
      ),
    },
  ];

  // - End

  return (
    <Card
      title="Persona Intents"
      type="inner"
      extra={
        <>

          <Button
            type="primary"
            onClick={showModal}
            htmlType="button"
            icon={<PlusOutlined />}
            key={'intent-card-' + personaState._id}
          >
            Add New Intent Question
          </Button>
          <Tooltip title={TOOL_TIPS.persona_intent_btn}>
            &nbsp;
            <Button
              icon={<QuestionCircleOutlined />}
            >
            </Button>
          </Tooltip>
        </>
      }
    >
      {personaState.intents?.length == 0 ? (
        <>
          <Alert type='info' message={TOOL_TIPS.persona_intent_info} />
          <Form.Item>
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No Persona Intents Added" />
          </Form.Item>
        </>
      ) : null}

      <Collapse key={'intent-collapse-' + personaState._id}>
        {personaState.intents?.map((intent) => (
          <Panel
            header={getHeader(intent.label + "")}
            key={'panel-intent-' + intent.id}
            extra={genIntentStatus(intent)}
          >
            <Tabs type="card" size="middle" tabPosition="top">
              <Tabs.TabPane key={'intentkey-' + personaState._id} tab={
                <>
                  Intent Questions &nbsp;
                  <Badge count={intent.questions?.length} />
                </>
              }
              >
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
                  <>
                    <Button
                      type="primary"
                      style={{ marginBottom: 10 }}
                      danger
                      ghost
                      onClick={() => getStrategies(intent, false)}
                      icon={<ReloadOutlined />}
                    >
                      Retrieve Strategies Again
                    </Button>
                    <Table size="middle" bordered dataSource={intent.strategies} columns={retrievalTableColumns} pagination={false} scroll={{ x: 1000 }} />
                  </>
                }

                {!intent.strategies && (
                  <>
                    <Alert type='info' message={TOOL_TIPS.persona_strategy_info} />
                    <Button
                      type="primary"
                      style={{ marginTop: 10 }}
                      onClick={() => getStrategies(intent, false)}
                      icon={<RocketFilled />}
                    >
                      Retrieve Explanation Strategies
                    </Button>
                  </>
                )}

                {intent.strategies && (
                  <>

                    <Button
                      type="dashed"
                      style={{ marginTop: 10 }}
                      // ghost
                      onClick={() => getStrategies(intent, true)}
                      icon={<SearchOutlined />}
                    >
                      Load More
                    </Button>

                    <Button
                      type="primary"
                      style={{ marginLeft: 10 }}
                      // danger
                      // ghost
                      onClick={() => getStrategiesReuse(intent)}
                      icon={<BulbOutlined />}
                    >
                      Generate Personalised Strategy
                    </Button>

                  </>
                )}
              </Tabs.TabPane>
              <Tabs.TabPane tab="Evaluation Questionaire" key={'tabpane-' + personaState._id}>
                <Alert type='info' message={TOOL_TIPS.persona_eval_info} style={{ marginBottom: 10 }} />

                <QuestionnaireTab
                  key={'qtab-' + personaState._id}
                  evaluation={intent.evaluation}
                  intent_cat={intent.name}
                  persona={personaState}
                  usecaseId={usecaseId}
                  updateIntentEvaluation={updateIntentEvaluation}
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
        destroyOnClose={true}
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
          preserve={false}
          autoComplete="off"
        >
          <Alert message={TOOL_TIPS.persona_intent_create} type="info" /><br></br>
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
