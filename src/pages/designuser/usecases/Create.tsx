import AssetmentField from '@/components/iSee/AssetmentFieldSet';
import PersonaTabs from '@/components/iSee/persona/PersonaTabs';
import DATA_FILEDS from '@/models/common';
import type { Persona } from '@/models/persona';
import type { Usecase, UsecaseSettings } from '@/models/usecase';
import { get_usecase_fields } from '@/services/isee/ontology';
import {
  api_create_persona,
  api_delete,
  api_get,
  api_get_casestructure,
  api_publish,
  api_update_settings,
} from '@/services/isee/usecases';
import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  PlusOutlined,
  SaveOutlined,
  SettingOutlined,
  UploadOutlined,
  UserSwitchOutlined,
} from '@ant-design/icons';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import {
  Button,
  Card,
  Cascader,
  Col,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  notification,
  PageHeader,
  Popconfirm,
  Radio,
  Result,
  Row,
  Select,
  Space,
  Switch,
  Tag,
  Upload,
} from 'antd';
import React, { useEffect, useState } from 'react';
const { Option } = Select;

const sample_personas: Persona[] = [];

export type Params = {
  match: {
    params: {
      id: string;
    };
  };
};

const Create: React.FC<Params> = (props) => {
  const [personas, setPersonas] = useState(sample_personas);
  const [pageStatus, setPageStatus] = useState('');
  // const { id } = useParams();

  const usecaseId = props.match.params.id;

  const [settings, setSettings] = useState<UsecaseSettings>();
  const [isSettingChanged, SetIsSettingChanged] = useState(false);

  const [settingsForm] = Form.useForm();
  const [ontoValues, setOntoValues] = useState<API.OntoParams>();
  const [usecase, setUsecase] = useState<Usecase>({ _id: '0', name: '', published: false });

  useEffect(() => {
    (async () => {
      const res_usecase = await api_get(props.match.params.id);
      console.log("RUNNING FIRST QUERY")
      console.log(res_usecase);

      const onto_params = await get_usecase_fields();
      setOntoValues(onto_params)

      setUsecase(res_usecase);
      if (!res_usecase) {
        setPageStatus('404');
      } else {
        setPageStatus('200');
        settingsForm.setFieldsValue(res_usecase.settings);
        setSettings(res_usecase.settings);
        setPersonas(res_usecase.personas);
      }
    })();
  }, [props.match.params.id, settingsForm]);

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

  async function onFinishPersona(values: any) {
    // We need to update this blank model if we change the object
    const new_persona: Persona = {
      _id: 'persona-' + Math.floor(Math.random() * 100000) + 1,
      completed: false,
      details: {
        name: values.name,
        domain_knowledge_level: null,
        ai_knowledge_level: null,
      },
      intents: [],
    };

    console.log('Success Create Persona:', new_persona);
    const added_persona = await api_create_persona(usecase._id, new_persona);
    if (added_persona) {
      new_persona._id = added_persona._id
      setPersonas([...personas, new_persona]);
      handleOk();
      message.success('Succesfully Added Persona');
    } else {
      message.error('Error Adding Persona');
    }

  }

  // - End

  const uploadprops = {
    name: 'file',
    action: '',
    onChange(info: any) {
      if (info.file.status !== 'uploading') {
        // console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  async function saveSettings() {
    const updateSettings: UsecaseSettings = settingsForm.getFieldsValue();

    if (
      // updateSettings.ai_method?.length > 0 &&
      updateSettings.ai_task != '' &&
      updateSettings.data_type != ''
    ) {
      updateSettings.completed = true;
    } else {
      updateSettings.completed = false;
    }

    setSettings(updateSettings);

    const test = await api_update_settings(usecase._id, {
      ...usecase,
      settings: { ...updateSettings },
    });
    console.log('Success Update Settings:', test);
    message.success('Succesfully saved AI Model Settings');
    SetIsSettingChanged(false);
  }

  const filterCascader = (inputValue: string, path: API.OntoOption[]) =>
    path.some(
      (option) => (option.label as string).toLowerCase().indexOf(inputValue.toLowerCase()) > -1,
    );

  const genExtra = () => (
    <Space size="middle">
      <Button
        type="primary"
        onClick={() => saveSettings()}
        disabled={!isSettingChanged}
        htmlType="button"
        className="r-10"
        icon={<SaveOutlined />}
      >
        Save AI Model Settings
      </Button>

      {(!settings?.completed && <Tag color="red">Pending</Tag>) ||
        (settings?.completed && <Tag color="green">Completed</Tag>)}
    </Space>
  );

  const genPersona = () => (
    <Space size="middle">
      <Button
        type="primary"
        onClick={showModal}
        htmlType="button"
        className="r-10"
        icon={<PlusOutlined />}
      >
        Create New Persona
      </Button>
      <Tag color="red">Pending</Tag>
    </Space>
  );

  return (
    <>
      {pageStatus == '404' && (
        <Result
          status="404"
          title="404"
          subTitle="Sorry, we couldn't find the Usecase"
          extra={
            <Button type="primary" onClick={() => (window.location.pathname = '/')}>
              Back Home
            </Button>
          }
        />
      )}
      {pageStatus == '200' && (
        <PageHeaderWrapper>
          <PageHeader
            key="head2"
            ghost={false}
            title={usecase.name}
            subTitle={
              usecase.published ? (
                <Tag color="green">Published</Tag>
              ) : (
                <Tag color="red">Unpublished</Tag>
              )
            }
            extra={[
              <div key="head3">
                Publish &nbsp;&nbsp;
                <Switch
                  onChange={async (checked) => {
                    await api_publish(usecase._id || '', checked);
                    setUsecase({ ...usecase, published: checked });
                  }}
                  checkedChildren={<CheckOutlined />}
                  unCheckedChildren={<CloseOutlined />}
                  defaultChecked={usecase.published}
                />
                <Button
                  type="primary"
                  style={{ margin: '0 1rem' }}
                  onClick={async () => {
                    const json = await api_get_casestructure(usecase._id || '');

                    notification.open({
                      message: json.length + ' Cases - ' + 'iSee Case Structure Export',
                      description: (
                        <pre>
                          <code>{JSON.stringify(json, null, 2)}</code>
                        </pre>
                      ),
                      onClick: () => {
                        console.log('Export Clicked!');
                      },
                    });
                  }}
                  htmlType="button"
                  icon={<SaveOutlined />}
                >
                  Export JSON
                </Button>{' '}
                <Popconfirm
                  title={'Are you sure to delete?'}
                  onConfirm={async () => {
                    await api_delete(usecase._id || '');
                    window.location.pathname = '/usecases';
                  }}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button
                    danger={true}
                    className="dynamic-delete-button"
                    icon={<DeleteOutlined />}
                  />
                </Popconfirm>
              </div>,
            ]}
          />

          <Card
            title={
              <h4>
                <SettingOutlined /> AI Model Settings
              </h4>
            }
            extra={genExtra()}
            headStyle={{ backgroundColor: '#fafafa', border: '1px solid #d9d9d9' }}
          >
            <Form
              name="basic"
              labelCol={{ span: 0 }}
              onFieldsChange={() => {
                SetIsSettingChanged(true);
                const updateSettings: UsecaseSettings = settingsForm.getFieldsValue();
                setSettings(updateSettings);
              }}
              form={settingsForm}
              autoComplete="off"
            >
              <Row gutter={20}>
                <Col span={12} className="gutter-row">
                  <Form.Item
                    label="AI Task"
                    name="ai_task"
                    tooltip="This is a required field"
                    rules={[{ required: false, message: 'Input is required!' }]}
                  >
                    <Cascader fieldNames={{ label: 'label', value: 'key', children: 'children' }} options={ontoValues?.AI_TASK.children} showSearch={{ filterCascader }} placeholder="Select the AI Task" changeOnSelect />
                  </Form.Item>

                  <Form.Item
                    label="AI Method"
                    name="ai_method"
                    tooltip="This is a required field"
                    rules={[{ required: false, message: 'Input is required!' }]}
                  >
                    <Cascader fieldNames={{ label: 'label', value: 'key', children: 'children' }} options={ontoValues?.AI_METHOD.children} showSearch={{ filterCascader }} placeholder="Select one or more AI Methods" changeOnSelect multiple maxTagCount="responsive" />
                  </Form.Item>

                  <Form.Item
                    label="Dataset Type"
                    name="dataset_type"
                    tooltip="This is a required field"
                    rules={[{ required: false, message: 'Input is required!' }]}
                  >
                    <Radio.Group>
                      {ontoValues?.DATASET_TYPE.map((option) => (
                        <Radio key={option.key} value={option.key}>
                          {option.label}
                        </Radio>
                      ))}
                    </Radio.Group>
                  </Form.Item>

                  <Form.Item
                    label="Data Type"
                    name="data_type"
                    tooltip="This is a required field"
                    rules={[{ required: false, message: 'Input is required!' }]}
                  >
                    <Radio.Group>
                      {ontoValues?.DATA_TYPE.map((option) => (
                        <Radio key={option.key} value={option.key}>
                          {option.label}
                        </Radio>
                      ))}
                    </Radio.Group>
                  </Form.Item>

                  <Form.Item
                    label="Number of Features"
                    name="num_features"
                    tooltip=""
                  // rules={[{ required: true, message: 'Input is required!' }]}
                  >
                    <Select placeholder="Number of Features">
                      {ontoValues?.FEATURE_RANGE.map((option) => (
                        <Select.Option key={option.key} value={option.key}>
                          {option.label}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <Form.Item
                    label="Number of Instances"
                    name="num_instances"
                    tooltip=""
                  // rules={[{ required: true, message: 'Input is required!' }]}
                  >
                    <Select placeholder="Number of Instances">
                      {ontoValues?.INSTANCE_RANGE.map((option) => (
                        <Select.Option key={option.key} value={option.key}>
                          {option.label}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <Form.Item
                    label="Model Upload Method"
                    name="model_mode"
                    rules={[{ required: false, message: 'Input is required!' }]}
                  >
                    <Radio.Group buttonStyle="solid">
                      <Radio.Button key="file" value="file">
                        Model File Upload (.h5, .pkl..)
                      </Radio.Button>
                      <Radio.Button key="api" value="api">
                        Provide API URL
                      </Radio.Button>
                    </Radio.Group>
                  </Form.Item>
                  {settings?.model_mode == 'file' && (
                    <>
                      <Form.Item
                        label="Model File"
                        name="model"
                        tooltip="Please upload the model using any of the following file formats: json, h5, csv and pkl"
                        rules={[{ required: false, message: 'Input is required!' }]}
                      >
                        <Upload {...uploadprops}>
                          <Button icon={<UploadOutlined />}>Click to Upload Model</Button>
                        </Upload>
                      </Form.Item>

                      <Form.Item
                        label="Implementation Framework"
                        name="model_backend"
                        tooltip=""
                      // rules={[{ required: true, message: 'Input is required!' }]}
                      >
                        <Select placeholder="Implementation Framework">
                          {ontoValues?.IMPLEMENTATION_FRAMEWORK.map((option) => (
                            <Select.Option key={option.key} value={option.key}>
                              {option.label}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </>
                  )}
                  {settings?.model_mode == 'api' && (
                    <Form.Item
                      label="ML Model API URL (POST)"
                      name="model"
                      tooltip="More instructions in the future"
                      rules={[{ required: false, message: 'Input is required!' }]}
                    >
                      <Input />
                    </Form.Item>
                  )}
                </Col>
                <Col span={12} className="gutter-row">
                  <AssetmentField types={ontoValues?.AI_MODEL_A_METRIC} />
                </Col>
              </Row>
            </Form>
          </Card>

          <Card
            title={
              <h4>
                <UserSwitchOutlined /> User Personas
              </h4>
            }
            extra={genPersona()}
            headStyle={{ backgroundColor: '#fafafa', border: '1px solid #d9d9d9' }}
          >
            <PersonaTabs usecaseId={usecaseId} setPersonas={setPersonas} personas={personas} ontoValues={ontoValues} />
          </Card>

          {/* New Persona Popup  */}
          <Modal
            title="Create new Persona"
            visible={isModalVisible}
            onCancel={handleCancel}
            footer={[
              <Button key="back" onClick={handleCancel}>
                Cancel
              </Button>,
              <Button form="createpersona" key="submit" htmlType="submit" type="primary">
                Create
              </Button>,
            ]}
          >
            <Form
              id="createpersona"
              name="createpersona"
              layout="vertical"
              labelCol={{ span: 0 }}
              initialValues={{ remember: true }}
              onFinish={onFinishPersona}
              autoComplete="off"
            >
              <Form.Item
                label="Name of the Persona"
                name="name"
                rules={[{ required: true, message: 'Input is required!' }]}
              >
                <Input />
              </Form.Item>
            </Form>
          </Modal>
        </PageHeaderWrapper>
      )}
    </>
  );
};

export default Create;
