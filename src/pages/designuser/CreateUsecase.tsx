import React, { useState } from 'react';
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
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import {
  CheckOutlined,
  CloseOutlined,
  PlusOutlined,
  SettingOutlined,
  UploadOutlined,
  UserSwitchOutlined,
} from '@ant-design/icons';
import AssetmentField from '@/components/iSee/AssetmentFieldSet';
import { Persona } from '@/models/usecase';
import PersonaTabs from '@/components/iSee/persona/PersonaTabs';
import DATA_FILEDS from '@/models/common';
const { Option } = Select;
const { Panel } = Collapse;

const sample_personas: Persona[] = [{
  id: "123", name: "Doctor", status: "Completed"
},
{
  id: "234", name: "Patient", status: "Completed",
  intent: 'Trust',
  intent_questions: ['How confident is the AI model?', "How does this outcome affect my health?", "Are there adverse effects of taking AI's decision?"],
  // todo
  evaluation_questionnaire: {
    questions: [
      {
        question_category: "Trust",
        question_text: "Are you now able to trust the AI model?",
        question_metric: "radio",
        metric_values: ["Yes", "No"]
      },
      {
        question_category: "Trust",
        question_text: "Next time, would you like the explanation with the AI model's decision?",
        question_metric: "radio",
        metric_values: ["Yes", "No"]
      }]
  }
}]

const Admin: React.FC = () => {

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [personas, setPersonas] = useState(sample_personas);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onFinish = (values: any) => {
    values.id = Math.floor(Math.random() * 100000) + 1;
    values.status = "Incomplete";
    setPersonas([...personas, values]);
    console.log('Success:', values);
    handleOk();
    message.success('Succesfully Added Persona');
  };


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

  const genExtra = () => (
    <div>
      <Tag color="red">Pending</Tag>
    </div>
  );

  return (
    <PageHeaderWrapper>
      <PageHeader
        key="head2"
        ghost={false}
        // onBack={() => window.history.back()}
        title="Usecase Name Here"
        subTitle={<Tag color="red">Unpublished</Tag>}
        extra={[
          <div key="head3">
            Publish &nbsp;&nbsp;
            <Switch
              checkedChildren={<CheckOutlined />}
              unCheckedChildren={<CloseOutlined />}
              defaultChecked={false}
            />
          </div>,
        ]}
      />

      <Collapse
        expandIconPosition={'right'}
      >
        <Panel
          header={
            <div>
              <h3><SettingOutlined /> AI Model Settings</h3>
            </div>
          }
          key="1"
          extra={genExtra()}
        >
          <Card
            bordered={false}
            actions={[
              <Button type="primary" htmlType="submit">
                Save AI Model
              </Button>,
            ]}
          >
            <Form
              name="basic"
              // layout="vertical"
              labelCol={{ span: 0 }}
              // wrapperCol={{ span: 10 }}
              initialValues={{ remember: true }}
              // onFinish={onFinish}
              // onFinishFailed={onFinishFailed}
              onFieldsChange={(_, allFields) => {
                console.log(allFields);
              }}
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
                    name="model_outcomes"
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
        </Panel>
        <Panel
          header={
            <div>
              <h3>
                <UserSwitchOutlined /> User Personas
              </h3>
            </div>
          }
          key="2"
          extra={genExtra()} >
          <Card
            bordered={false}
            actions={[
              <Button
                type="primary"
                onClick={showModal}
                htmlType="button"
                icon={<PlusOutlined />}
              >
                Add New Persona
              </Button>,
            ]}
          >
            <PersonaTabs setPersonas={setPersonas} personas={personas}></PersonaTabs>
          </Card>

          {/* </Card> */}
        </Panel>
      </Collapse>


      <Modal
        title="Create new Persona"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button form="create" key="submit" htmlType="submit" type="primary">
            Create
          </Button>,
        ]}
      >
        <Form
          id="create"
          name="create"
          layout="vertical"
          labelCol={{ span: 0 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
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
  );
};

export default Admin;
