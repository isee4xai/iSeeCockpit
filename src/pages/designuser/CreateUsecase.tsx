import React from 'react';
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
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import {
  CheckOutlined,
  CloseOutlined,
  SettingOutlined,
  UploadOutlined,
  UserSwitchOutlined,
} from '@ant-design/icons';
import AssetmentField from '@/components/iSee/AssetmentFieldSet';
import PersonaField from '@/components/iSee/PersonaFieldSet';
const { Option } = Select;
const { Panel } = Collapse;

const DATA_FILEDS = {
  AITask: ['Classifier', 'Something', 'Something 2'],
  AIMethod: ['ANN', 'SVM', 'CNN'],
  Datatype: ['Tabular', 'Image', 'Textual'],
  ModelOutcome: ['Binary', 'Multi-Class', 'Range'],
  AssetmentType: ['Accuracy', 'F1 Score'],
  IntentType: [
    'Debugging',
    'Education',
    'Effectiveness',
    'Efficiency',
    'Persuasiveness',
    'Satisfaction',
    'Scruitablity',
    'Transparency',
    'Trust',
  ],
};

const Admin: React.FC = () => {
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
      {/* <SettingOutlined
        onClick={event => {
          // If you don't want click extra trigger collapse, you can prevent this:
          event.stopPropagation();
        }}
      /> */}
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
        // defaultActiveKey={['1']}
        // onChange={callback}
        expandIconPosition={'right'}
      >
        <Panel
          header={
            <div>
              <SettingOutlined /> AI Model Settings
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
              <UserSwitchOutlined /> User Personas
            </div>
          }
          key="2"
          extra={genExtra()}
        >
          <Card bordered={false}>
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
                <Col span={10} className="gutter-row">
                  <PersonaField intents={DATA_FILEDS.IntentType} />
                </Col>
              </Row>
            </Form>
          </Card>
        </Panel>
        <Panel header="Explanation Strategies" key="3" extra={genExtra()} />
      </Collapse>
    </PageHeaderWrapper>
  );
};

export default Admin;
