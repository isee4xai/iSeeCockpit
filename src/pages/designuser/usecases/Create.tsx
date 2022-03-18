import React, { useEffect, useState } from 'react';
import {
  Card,
  Button,
  message,
  Form,
  Row,
  Col,
  Radio,
  Select,
  Upload,
  Collapse,
  Tag,
  PageHeader,
  Switch,
  Input,
  Modal,
  Space,
  Result,
  notification,
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import {
  CheckOutlined,
  CloseOutlined,
  PlusOutlined,
  SaveFilled,
  SaveOutlined,
  SettingOutlined,
  UploadOutlined,
  UserSwitchOutlined,
} from '@ant-design/icons';
import AssetmentField from '@/components/iSee/AssetmentFieldSet';
import { Persona } from '@/models/persona';
import { Usecase, UsecaseSettings } from '@/models/usecase';
import PersonaTabs from '@/components/iSee/persona/PersonaTabs';
import DATA_FILEDS from '@/models/common';
import { useParams } from 'umi';
const { Option } = Select;
const { Panel } = Collapse;
import { history } from 'umi';
import { api_create_persona, api_get, api_update_settings } from '@/services/isee/usecases';

// const sample_personas: Persona[] = [{
//   id: "123", name: "Doctor", completed: false,
//   evaluation: {
//     questions: [
//     ]
//   }
// },
// {
//   id: "234", name: "Patient", completed: true,
//   intent: 'Trust',
//   intent_questions: ['How confident is the AI model?', "How does this outcome affect my health?", "Are there adverse effects of taking AI's decision?"],
//   // todo
//   evaluation: {
//     questions: [
//       {
//         id: "124",
//         category: "Trust",
//         text: "Are you now able to trust the AI model?",
//         metric: "Radio",
//         metric_values: ["Yes", "No"]
//       },
//       {
//         id: "125",
//         category: "Trust",
//         text: "Next time, would you like the explanation with the AI model's decision?",
//         metric: "Radio",
//         metric_values: ["Yes", "No"],
//         completed: true
//       }]
//   }
// }]

const sample_personas: Persona[] = []

export type Params = {
  match: {
    params: {
      id: string
    }
  }
};


const Create: React.FC<Params> = (props) => {

  const [personas, setPersonas] = useState(sample_personas);
  const [pageStatus, setPageStatus] = useState("");
  // const { id } = useParams();

  const usecaseId = props.match.params.id

  const [settings, setSettings] = useState<UsecaseSettings>();
  const [isSettingChanged, SetIsSettingChanged] = useState(false);

  const [settingsForm] = Form.useForm();

  const [usecase, setUsecase] = useState({ id: "new" });

  useEffect(() => {
    async function get() {
      const res_usecase = await api_get(props.match.params.id);

      setUsecase(res_usecase);
      if (!res_usecase) {
        setPageStatus("404");
      } else {
        setPageStatus("200");
        console.log(res_usecase.settings)
        settingsForm.setFieldsValue(res_usecase.settings)
        setSettings(res_usecase.settings)
        setPersonas(res_usecase.personas)
      }
    }
    get();
  }, []);

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
    let new_persona: Persona = {
      id: "persona-" + Math.floor(Math.random() * 100000) + 1,
      completed: false,
      details: {
        name: values.name,
        domain_level: 'Medium',
        ai_level: 'Medium',
      },
      intents: [
      ],
    }

    setPersonas([...personas, new_persona]);
    console.log('Success Create Persona:', new_persona);
    await api_create_persona(usecase.id, new_persona)
    handleOk();
    message.success('Succesfully Added Persona');
  };

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
    let updateSettings: UsecaseSettings = settingsForm.getFieldsValue();

    if (updateSettings.ai_method != '' && updateSettings.ai_task != '' && updateSettings.data_type != '' && updateSettings.model_outcome != '') {
      updateSettings.completed = true;
    } else {
      updateSettings.completed = false;
    }

    setSettings(updateSettings);

    await api_update_settings(usecase.id, updateSettings)
    console.log("Updating Settings", usecase)
    message.success('Succesfully saved AI Model Settings');
    SetIsSettingChanged(false);
  }

  const genExtra = () => (
    <Space size="middle">
      <Button
        type="primary"
        onClick={() => saveSettings()}
        disabled={!isSettingChanged}
        htmlType="button"
        className='r-10'
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
        className='r-10'
        icon={<PlusOutlined />}
      >
        Create New Persona
      </Button>
      <Tag color="red">Pending</Tag>
    </Space>
  );


  return (

    <>
      {pageStatus == "404" &&
        <Result
          status="404"
          title="404"
          subTitle="Sorry, we couldn't find the Usecase"
          extra={
            <Button type="primary" onClick={() => history.push('/')}>
              Back Home
            </Button>
          }
        />
      }
      {pageStatus == "200" &&
        <PageHeaderWrapper>
          <PageHeader
            key="head2"
            ghost={false}
            // onBack={() => window.history.back()}
            title={usecase.name}
            subTitle={<Tag color="red">Unpublished</Tag>}
            extra={[
              <div key="head3">
                <Button
                  type="primary"
                  danger
                  onClick={() => {
                    const saved_usecases = localStorage.getItem("USECASES");

                    let arr = JSON.parse(saved_usecases) || [];
                    const ucindex = arr.findIndex((obj => obj.id == usecase.id));

                    notification.open({
                      message: 'JSON Object',
                      description:
                        JSON.stringify(arr[ucindex]),
                      onClick: () => {
                        console.log('Export Clicked!');
                      },
                    });
                  }
                  }
                  htmlType="button"
                  className='r-10'
                  icon={<SaveOutlined />}
                >
                  Export JSON
                </Button> &nbsp;&nbsp;
                Publish &nbsp;&nbsp;
                <Switch
                  checkedChildren={<CheckOutlined />}
                  unCheckedChildren={<CloseOutlined />}
                  defaultChecked={false}
                />
              </div>,
            ]}
          />

          <Card title={<h4><SettingOutlined /> AI Model Settings</h4>}
            extra={genExtra()}
            headStyle={{ backgroundColor: "#fafafa", border: "1px solid #d9d9d9" }}
          // actions={[
          //   <Button type="primary" htmlType="submit">
          //     Save AI Model Settings
          //   </Button>,
          // ]}
          >
            <Form
              name="basic"
              // layout="vertical"
              labelCol={{ span: 0 }}
              // wrapperCol={{ span: 10 }}
              // onFinish={onFinish}
              // onFinishFailed={onFinishFailed}
              onFieldsChange={(_, allFields) => {
                SetIsSettingChanged(true);
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
                    <Select>
                      {DATA_FILEDS.AITask.map((option) => (
                        <Option key={option} value={option}>
                          {option}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <Form.Item
                    label="AI Method"
                    name="ai_method"
                    tooltip="This is a required field"
                    rules={[{ required: false, message: 'Input is required!' }]}
                  >
                    <Select>
                      {DATA_FILEDS.AIMethod.map((option) => (
                        <Option key={option} value={option}>
                          {option}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <Form.Item
                    label="Data Type"
                    name="data_type"
                    tooltip="This is a required field"
                    rules={[{ required: false, message: 'Input is required!' }]}
                  >
                    <Radio.Group>
                      {DATA_FILEDS.Datatype.map((option) => (
                        <Radio key={option} value={option}>
                          {option}
                        </Radio>
                      ))}
                    </Radio.Group>
                  </Form.Item>

                  <Form.Item
                    label="Model Outcomes"
                    name="model_outcome"
                    tooltip="This is a required field"
                    rules={[{ required: false, message: 'Input is required!' }]}
                  >
                    <Select>
                      {DATA_FILEDS.ModelOutcome.map((option) => (
                        <Option key={option} value={option}>
                          {option}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <Form.Item
                    label="ML Model"
                    name="model"
                    tooltip="This is a required field"
                    rules={[{ required: false, message: 'Input is required!' }]}
                  >
                    <Upload {...uploadprops}>
                      <Button icon={<UploadOutlined />}>Click to Upload Model</Button>
                    </Upload>
                  </Form.Item>
                </Col>
                <Col span={12} className="gutter-row">
                  <AssetmentField types={DATA_FILEDS.AssetmentType} />
                </Col>
              </Row>
            </Form>
          </Card>

          <Card title={<h4><UserSwitchOutlined /> User Personas</h4>}
            extra={genPersona()}
            headStyle={{ backgroundColor: "#fafafa", border: "1px solid #d9d9d9" }}
          >

            <PersonaTabs usecaseId={usecaseId} setPersonas={setPersonas} personas={personas}></PersonaTabs>

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

        </PageHeaderWrapper >
      }
    </>

  );
};

export default Create;
