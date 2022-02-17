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
  Empty,
} from 'antd';
import { MinusCircleOutlined, PlusOutlined, SettingOutlined } from '@ant-design/icons';
const { Panel } = Collapse;
import CreateQuestionnaire from '@/components/iSee/question/CreateQuestionnaire';
import DATA_FILEDS from '@/models/common';

const CreateQuestionnaires: React.FC = () => {
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

  const [questionnaires, setQuestionnaires] = useState([{
    name: 'Explanation Satisfaction Scale (Hoffman)',
    category: 'Satisfaction',
    questions: [
      {
        question_text: 'From the explanation, I understand how the AI model works.',
        question_metric: 'Likert',
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
        question_metric: 'Likert',
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
        question_metric: 'Likert',
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
        question_metric: 'Likert',
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
        question_metric: 'Likert',
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
        question_metric: 'Likert',
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
        question_metric: 'Likert',
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
        question_metric: 'Likert',
        metric_values: [
          'I agree strongly',
          'I agree somewhat',
          'I’m neutral about it',
          'I disagree somewhat',
          'I disagree strongly',
        ],
        required: true,
      },
    ]
  }, {
    name: 'Explanation Goodness Checklist (Hoffman)',
    category: 'Goodness',
    questions: [
      {
        question_text: 'The explanation helps me understand how the AI model works.',
        question_metric: 'radio',
        metric_values: ['Yes', 'No'],
        required: true,
      },
      {
        question_text: 'The explanation of how the AI model works is satisfying.',
        question_metric: 'radio',
        metric_values: ['Yes', 'No'],
        required: true,
      },
      {
        question_text: 'The explanation of the AI model sufficiently detailed. ',
        question_metric: 'radio',
        metric_values: ['Yes', 'No'],
        required: true,
      },
      {
        question_text: 'The explanation of how the AI model works is sufficiently complete.',
        question_metric: 'radio',
        metric_values: ['Yes', 'No'],
        required: true,
      },
      {
        question_text:
          'The explanation is actionable, that is, it helps me know how to use the AI M=model',
        question_metric: 'radio',
        metric_values: ['Yes', 'No'],
        required: true,
      },
      {
        question_text: 'The explanation lets me know how accurate or reliable the AI model is.',
        question_metric: 'radio',
        metric_values: ['Yes', 'No'],
        required: true,
      },
      {
        question_text: 'The explanation lets me know how trustworthy the AI model is.',
        question_metric: 'radio',
        metric_values: ['Yes', 'No'],
        required: true,
      },
    ]
  },
  {
    name: 'Cahour-Forzy Trust Scale;',
    category: 'Trust',
    questions: [
      {
        question_text: 'What is your confidence in the [tool]? Do you have a feeling of trust in it?',
        question_metric: 'Likert',
        metric_values: [
          '1 (I do not trust it at all.)',
          '2',
          '3',
          '4',
          '5',
          '6',
          '7 (I trust it completely)',
        ],
        required: true,
      }, {
        question_text: 'Are the actions of the [tool] predictable?',
        question_metric: 'Likert',
        metric_values: [
          '1 (It is not at all predictable.)',
          '2',
          '3',
          '4',
          '5',
          '6',
          '7 (It is completely predictable)',
        ],
        required: true,
      }, {
        question_text: 'Is the [tool] reliable? Do you think it is safe?',
        question_metric: 'Likert',
        metric_values: [
          '1 (It is not at all safe.)',
          '2',
          '3',
          '4',
          '5',
          '6',
          '7 (It is completely safe. )',
        ],
        required: true,
      }, {
        question_text: 'Is the [tool] efficient at what it does?',
        question_metric: 'Likert',
        metric_values: [
          '1 (It is not at all efficient.)',
          '2',
          '3',
          '4',
          '5',
          '6',
          '7 (It is completely efficient)',
        ],
        required: true,
      },
    ]
  },
  {
    name: 'Trust Scale (Hoffman)',
    category: 'Trust',
    questions: [
      {
        question_text: 'I am confident in the [tool]. I feel that it works well.',
        question_metric: 'Likert',
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
        question_text: 'The outputs of the [tool] are very predictable.',
        question_metric: 'Likert',
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
        question_text: 'I feel safe that when I rely on the [tool] I will get the right answers.',
        question_metric: 'Likert',
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
        question_text: 'The [tool] is efficient in that it works very quickly.',
        question_metric: 'Likert',
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
        question_text: 'I am wary of the [tool].',
        question_metric: 'Likert',
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
        question_text: ' The [tool] can perform the task better than a novice human user.',
        question_metric: 'Likert',
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
        question_text: 'I like using the system for decision making.',
        question_metric: 'Likert',
        metric_values: [
          'I agree strongly',
          'I agree somewhat',
          'I’m neutral about it',
          'I disagree somewhat',
          'I disagree strongly',
        ],
        required: true,
      }
    ]
  }
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
        <Button
          danger
          className="dynamic-delete-button"
          icon={<MinusCircleOutlined />}>

        </Button>
      </Popconfirm>
    </div>
  );

  return (
    <PageContainer>
      <Modal
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
          initialValues={{ remember: true }}
          onFinish={onFinish}
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
            <Select
            >
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
      <div>
        {
          questionnaires.length != 0 ? (
            <Collapse
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
                    <CreateQuestionnaire questionnaire={questionnaire} />
                  </Card>
                </Panel>
              ))}
            </Collapse>)
            : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No Questionnaires" />}
      </div>
    </PageContainer>
  );
};

export default CreateQuestionnaires;
