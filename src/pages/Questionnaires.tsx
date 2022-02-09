import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import {
  Button,
  Card,
  Collapse,
  PageHeader,
  Popconfirm,
  message,
  Modal,
  Form,
  Input,
  Select,
} from 'antd';
import { MinusCircleOutlined, PlusOutlined, SettingOutlined } from '@ant-design/icons';
const { Panel } = Collapse;
import Questionnaire from '@/components/iSee/Questionnaire';

const DATA_FILEDS = {
  QUESTION_CATEGORY: [
    'Goodness',
    'Satisfaction',
    'Mental Model',
    'Curiosity',
    'Trust',
    'Performance',
  ],
};

const Welcome: React.FC = () => {
  const { Option } = Select;

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

  const [questionnaires, setQuestionnaires] = useState([
    {
      name: 'Hoffman Satisfaction Scale',
      category: 'Satisfaction',
      questions: [
        {
          question_text: 'From the explanation, I understand how the AI model works.',
          metric: 'likert',
          metric_values: [
            'I agree strongly',
            'I agree somewhat',
            'I’m neutral about it',
            'I disagree somewhat',
            'I disagree strongly',
          ],
          required: true,
        },
        {
          question_text: 'This explanation of how the AI model works is satisfying.',
          metric: 'likert',
          metric_values: [
            'I agree strongly',
            'I agree somewhat',
            'I’m neutral about it',
            'I disagree somewhat',
            'I disagree strongly',
          ],
          required: false,
        },
        {
          question_text: 'This explanation of how the AI model works has sufficient detail.',
          metric: 'likert',
          metric_values: [
            'I agree strongly',
            'I agree somewhat',
            'I’m neutral about it',
            'I disagree somewhat',
            'I disagree strongly',
          ],
          required: true,
        },
        {
          question_text: 'This explanation of how the AI model works seems complete.',
          metric: 'likert',
          metric_values: [
            'I agree strongly',
            'I agree somewhat',
            'I’m neutral about it',
            'I disagree somewhat',
            'I disagree strongly',
          ],
          required: false,
        },
        {
          question_text: 'This explanation of how the AI model works tells me how to use it',
          metric: 'likert',
          metric_values: [
            'I agree strongly',
            'I agree somewhat',
            'I’m neutral about it',
            'I disagree somewhat',
            'I disagree strongly',
          ],
          required: true,
        },
        {
          question_text: 'This explanation of how the AI model works is useful to my goals.',
          metric: 'likert',
          metric_values: [
            'I agree strongly',
            'I agree somewhat',
            'I’m neutral about it',
            'I disagree somewhat',
            'I disagree strongly',
          ],
          required: false,
        },
        {
          question_text:
            'This explanation of the [software, algorithm, tool] shows me how accurate the AI model is.',
          metric: 'likert',
          metric_values: [
            'I agree strongly',
            'I agree somewhat',
            'I’m neutral about it',
            'I disagree somewhat',
            'I disagree strongly',
          ],
          required: false,
        },
        {
          question_text:
            'This explanation lets me judge when I should trust and not trust the AI model. ',
          metric: 'likert',
          metric_values: [
            'I agree strongly',
            'I agree somewhat',
            'I’m neutral about it',
            'I disagree somewhat',
            'I disagree strongly',
          ],
          required: true,
        },
      ],
    },
    {
      name: 'Explanation Goodness Checklist',
      category: 'Goodness',
      questions: [
        {
          question_text: 'The explanation helps me understand how the AI model works.',
          metric: 'radio',
          metric_values: ['Yes', 'No'],
          required: true,
        },
        {
          question_text: 'The explanation of how the AI model works is satisfying.',
          metric: 'radio',
          metric_values: ['Yes', 'No'],
          required: true,
        },
        {
          question_text: 'The explanation of the AI model sufficiently detailed. ',
          metric: 'radio',
          metric_values: ['Yes', 'No'],
          required: true,
        },
        {
          question_text: 'The explanation of how the AI model works is sufficiently complete.',
          metric: 'radio',
          metric_values: ['Yes', 'No'],
          required: true,
        },
        {
          question_text:
            'The explanation is actionable, that is, it helps me know how to use the AI M=model',
          metric: 'radio',
          metric_values: ['Yes', 'No'],
          required: true,
        },
        {
          question_text: 'The explanation lets me know how accurate or reliable the AI model is.',
          metric: 'radio',
          metric_values: ['Yes', 'No'],
          required: true,
        },
        {
          question_text: 'The explanation lets me know how trustworthy the AI model is.',
          metric: 'radio',
          metric_values: ['Yes', 'No'],
          required: true,
        },
      ],
    },
  ]);

  const onFinish = (values: any) => {
    values.questions = [];
    setQuestionnaires([...questionnaires, values]);
    console.log('Success:', values);
    handleOk();
    message.success('Succesfully Added Usecase');
  };

  const removeQuestionnaire = (values: any) => {
    console.log('Success:', values);
    setQuestionnaires(questionnaires.filter((item) => item.name !== values.name));
  };

  const genExtra = (values: any) => (
    <div>
      <Popconfirm
        title={'Are you sure to delete?'}
        onConfirm={() => removeQuestionnaire(values)}
        // onCancel={cancel}
        okText="Yes"
        cancelText="No"
      >
        <Button danger className="dynamic-delete-button" icon={<MinusCircleOutlined />}>
          Remove
        </Button>
      </Popconfirm>
    </div>
  );

  return (
    <PageContainer>
      <Modal
        width={780}
        title="Create new Questionnaire"
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
          // wrapperCol={{ span: 8 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          // onFinishFailed={onFinishFailed}
          // onFieldsChange={(_, allFields) => {
          //   console.log(allFields);
          // }}
          autoComplete="off"
        >
          <Form.Item
            label="Questionnaire Name"
            name="name"
            rules={[{ required: true, message: 'Input is required!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Questionnaire Category"
            name="category"
            tooltip="This is a required field"
            rules={[{ required: true, message: 'Input is required!' }]}
          >
            <Select>
              {DATA_FILEDS.QUESTION_CATEGORY.map((option) => (
                <Option key={option} value={option}>
                  {option}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <PageHeader
        ghost={false}
        key="questionnaires_heading"
        title="Questionnaires"
        // subTitle="Displaying questionnaires"
        extra={[
          <Button type="primary" onClick={showModal} style={{ width: '100%' }}>
            <PlusOutlined /> Add New Questionnaire
          </Button>,
        ]}
      />

      <Collapse
        // defaultActiveKey={['1']}
        // onChange={callback}
        expandIconPosition={'right'}
        accordion
      >
        {questionnaires.map((questionnaire) => (
          <Panel
            header={
              <div>
                <SettingOutlined /> {questionnaire.name}
              </div>
            }
            key={questionnaire.name}
            extra={genExtra(questionnaire)}
          >
            <Card>
              <Questionnaire />
            </Card>
          </Panel>
        ))}
      </Collapse>
    </PageContainer>
  );
};

export default Welcome;
