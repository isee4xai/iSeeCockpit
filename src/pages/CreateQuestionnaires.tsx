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
  notification,
  Empty,
} from 'antd';
import {
  MinusCircleOutlined,
  DownloadOutlined,
  CopyOutlined,
  PlusOutlined,
  SettingOutlined,
} from '@ant-design/icons';
const { Panel } = Collapse;
import CreateQuestionnaire from '@/components/iSee/question/CreateQuestionnaire';
import DATA_FILEDS from '@/models/common';

const CreateQuestionnaires: React.FC = () => {
  const { Option } = Select;

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modal, setModal] = useState({ visibility: false, idx: -1 });

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
    setModal({ visibility: false, idx: -1 });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const [questionnaires, setQuestionnaires] = useState([
    {
      name: 'Explanation Satisfaction Scale (Hoffman)',
      category: 'Satisfaction',
      id: 'q-1',
      questions: [
        {
          text: 'From the explanation, I understand how the AI model works.',
          metric: 'Likert',
          metric_values: [
            { val: 'I agree strongly' },
            { val: 'I agree somewhat' },
            { val: "I'm neutral about it" },
            { val: 'I disagree somewhat' },
            { val: 'I disagree strongly' },
          ],
          required: true,
          id: 'q-1-1',
        },
        {
          text: 'This explanation of how the AI model works is satisfying.',
          metric: 'Likert',
          metric_values: [
            { val: 'I agree strongly' },
            { val: 'I agree somewhat' },
            { val: "I'm neutral about it" },
            { val: 'I disagree somewhat' },
            { val: 'I disagree strongly' },
          ],
          required: false,
          id: 'q-1-2',
        },
        {
          text: 'This explanation of how the AI model works has sufficient detail.',
          metric: 'Likert',
          metric_values: [
            { val: 'I agree strongly' },
            { val: 'I agree somewhat' },
            { val: "I'm neutral about it" },
            { val: 'I disagree somewhat' },
            { val: 'I disagree strongly' },
          ],
          required: true,
          id: 'q-1-3',
        },
        {
          text: 'This explanation of how the AI model works seems complete.',
          metric: 'Likert',
          metric_values: [
            { val: 'I agree strongly' },
            { val: 'I agree somewhat' },
            { val: "I'm neutral about it" },
            { val: 'I disagree somewhat' },
            { val: 'I disagree strongly' },
          ],
          required: false,
          id: 'q-1-4',
        },
        {
          text: 'This explanation of how the AI model works tells me how to use it',
          metric: 'Likert',
          metric_values: [
            { val: 'I agree strongly' },
            { val: 'I agree somewhat' },
            { val: "I'm neutral about it" },
            { val: 'I disagree somewhat' },
            { val: 'I disagree strongly' },
          ],
          required: true,
          id: 'q-1-5',
        },
        {
          text: 'This explanation of how the AI model works is useful to my goals.',
          metric: 'Likert',
          metric_values: [
            { val: 'I agree strongly' },
            { val: 'I agree somewhat' },
            { val: "I'm neutral about it" },
            { val: 'I disagree somewhat' },
            { val: 'I disagree strongly' },
          ],
          required: false,
          id: 'q-1-6',
        },
        {
          text: 'This explanation of the [software, algorithm, tool] shows me how accurate the AI model is.',
          metric: 'Likert',
          metric_values: [
            { val: 'I agree strongly' },
            { val: 'I agree somewhat' },
            { val: "I'm neutral about it" },
            { val: 'I disagree somewhat' },
            { val: 'I disagree strongly' },
          ],
          required: false,
          id: 'q-1-7',
        },
        {
          text: 'This explanation lets me judge when I should trust and not trust the AI model. ',
          metric: 'Likert',
          metric_values: [
            { val: 'I agree strongly' },
            { val: 'I agree somewhat' },
            { val: "I'm neutral about it" },
            { val: 'I disagree somewhat' },
            { val: 'I disagree strongly' },
          ],
          required: true,
          id: 'q-1-8',
        },
      ],
    },
    {
      name: 'Explanation Goodness Checklist (Hoffman)',
      category: 'Goodness',
      id: 'q-2',
      questions: [
        {
          text: 'The explanation helps me understand how the AI model works.',
          metric: 'Radio',
          metric_values: [{ val: 'Yes' }, { val: 'No' }],
          required: true,
          id: 'q-2-1',
        },
        {
          text: 'The explanation of how the AI model works is satisfying.',
          metric: 'Radio',
          metric_values: [{ val: 'Yes' }, { val: 'No' }],
          required: true,
          id: 'q-2-2',
        },
        {
          text: 'The explanation of the AI model sufficiently detailed. ',
          metric: 'Radio',
          metric_values: [{ val: 'Yes' }, { val: 'No' }],
          required: true,
          id: 'q-2-3',
        },
        {
          text: 'The explanation of how the AI model works is sufficiently complete.',
          metric: 'Radio',
          metric_values: [{ val: 'Yes' }, { val: 'No' }],
          required: true,
          id: 'q-2-4',
        },
        {
          text: 'The explanation is actionable, that is, it helps me know how to use the AI M=model',
          metric: 'Radio',
          metric_values: [{ val: 'Yes' }, { val: 'No' }],
          required: true,
          id: 'q-2-5',
        },
        {
          text: 'The explanation lets me know how accurate or reliable the AI model is.',
          metric: 'Radio',
          metric_values: [{ val: 'Yes' }, { val: 'No' }],
          required: true,
          id: 'q-2-6',
        },
        {
          text: 'The explanation lets me know how trustworthy the AI model is.',
          metric: 'Radio',
          metric_values: [{ val: 'Yes' }, { val: 'No' }],
          required: true,
          id: 'q-2-7',
        },
      ],
    },
    {
      name: 'Cahour-Forzy Trust Scale;',
      category: 'Trust',
      id: 'q-3',
      questions: [
        {
          text: 'What is your confidence in the [tool]? Do you have a feeling of trust in it?',
          metric: 'Likert',
          metric_values: [
            { val: '1 (I do not trust it at all.)' },
            { val: '2' },
            { val: '3' },
            { val: '4' },
            { val: '5' },
            { val: '6' },
            { val: '7 (I trust it completely)' },
          ],
          required: true,
          id: 'q-3-1',
        },
        {
          text: 'Are the actions of the [tool] predictable?',
          metric: 'Likert',
          metric_values: [
            { val: '1 (I do not trust it at all.)' },
            { val: '2' },
            { val: '3' },
            { val: '4' },
            { val: '5' },
            { val: '6' },
            { val: '7 (I trust it completely)' },
          ],
          required: true,
          id: 'q-3-2',
        },
        {
          text: 'Is the [tool] reliable? Do you think it is safe?',
          metric: 'Likert',
          metric_values: [
            { val: '1 (I do not trust it at all.)' },
            { val: '2' },
            { val: '3' },
            { val: '4' },
            { val: '5' },
            { val: '6' },
            { val: '7 (I trust it completely)' },
          ],
          required: true,
          id: 'q-3-3',
        },
        {
          text: 'Is the [tool] efficient at what it does?',
          metric: 'Likert',
          metric_values: [
            { val: '1 (I do not trust it at all.)' },
            { val: '2' },
            { val: '3' },
            { val: '4' },
            { val: '5' },
            { val: '6' },
            { val: '7 (I trust it completely)' },
          ],
          required: true,
          id: 'q-3-4',
        },
      ],
    },
    {
      name: 'Trust Scale (Hoffman)',
      category: 'Trust',
      id: 'q-4',
      questions: [
        {
          text: 'I am confident in the [tool]. I feel that it works well.',
          metric: 'Likert',
          metric_values: [
            { val: 'I agree strongly' },
            { val: 'I agree somewhat' },
            { val: "I'm neutral about it" },
            { val: 'I disagree somewhat' },
            { val: 'I disagree strongly' },
          ],
          required: true,
          id: 'q-4-1',
        },
        {
          text: 'The outputs of the [tool] are very predictable.',
          metric: 'Likert',
          metric_values: [
            { val: 'I agree strongly' },
            { val: 'I agree somewhat' },
            { val: "I'm neutral about it" },
            { val: 'I disagree somewhat' },
            { val: 'I disagree strongly' },
          ],
          required: true,
          id: 'q-4-2',
        },
        {
          text: 'I feel safe that when I rely on the [tool] I will get the right answers.',
          metric: 'Likert',
          metric_values: [
            { val: 'I agree strongly' },
            { val: 'I agree somewhat' },
            { val: "I'm neutral about it" },
            { val: 'I disagree somewhat' },
            { val: 'I disagree strongly' },
          ],
          required: true,
          id: 'q-4-3',
        },
        {
          text: 'The [tool] is efficient in that it works very quickly.',
          metric: 'Likert',
          metric_values: [
            { val: 'I agree strongly' },
            { val: 'I agree somewhat' },
            { val: "I'm neutral about it" },
            { val: 'I disagree somewhat' },
            { val: 'I disagree strongly' },
          ],
          required: true,
          id: 'q-4-4',
        },
        {
          text: 'I am wary of the [tool].',
          metric: 'Likert',
          metric_values: [
            { val: 'I agree strongly' },
            { val: 'I agree somewhat' },
            { val: "I'm neutral about it" },
            { val: 'I disagree somewhat' },
            { val: 'I disagree strongly' },
          ],
          required: true,
          id: 'q-4-5',
        },
        {
          text: ' The [tool] can perform the task better than a novice human user.',
          metric: 'Likert',
          metric_values: [
            { val: 'I agree strongly' },
            { val: 'I agree somewhat' },
            { val: "I'm neutral about it" },
            { val: 'I disagree somewhat' },
            { val: 'I disagree strongly' },
          ],
          required: true,
          id: 'q-4-6',
        },
        {
          text: 'I like using the system for decision making.',
          metric: 'Likert',
          metric_values: [
            { val: 'I agree strongly' },
            { val: 'I agree somewhat' },
            { val: "I'm neutral about it" },
            { val: 'I disagree somewhat' },
            { val: 'I disagree strongly' },
          ],
          required: true,
          id: 'q-4-7',
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
      <Button
        ghost
        type="primary"
        icon={<DownloadOutlined />}
        style={{ marginRight: '10px' }}
        onClick={() => {
          setModal({ visibility: true, idx: questionnaires.indexOf(values) });
        }}
      />
      <Popconfirm
        title={'Are you sure to delete?'}
        onConfirm={() => removeQuestionnaire(values)}
        okText="Yes"
        cancelText="No"
      >
        <Button danger className="dynamic-delete-button" icon={<MinusCircleOutlined />} />
      </Popconfirm>
    </div>
  );

  const handleCloseModal = () => {
    setModal({ ...modal, visibility: false });
  };

  const addToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(questionnaires[modal.idx], null, 4)).then(
      () => {
        notification.success({
          message: `Success`,
          duration: 3,
          description: 'The questionnaire json has been added to the clipboard',
          placement: 'bottomRight',
        });
      },
      () => {
        notification.error({
          message: `Error`,
          duration: 3,
          description: 'An error occured, the json was not added to the clipboard',
          placement: 'bottomRight',
        });
      },
    );
  };

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
          <Button
            type="primary"
            onClick={showModal}
            style={{ width: '100%' }}
            key={'add-questionnaire-btn'}
          >
            <PlusOutlined /> Add New Questionnaire
          </Button>,
        ]}
      />
      <div>
        {questionnaires.length != 0 ? (
          <Collapse accordion>
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
          </Collapse>
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No Questionnaires" />
        )}
      </div>
      <Modal
        title={'Export'}
        visible={modal.visibility}
        onOk={handleOk}
        onCancel={handleCloseModal}
        footer={
          <>
            <Button onClick={addToClipboard} icon={<CopyOutlined />}>
              Copy to clipboard
            </Button>

            <Button type="primary" onClick={handleOk}>
              Close
            </Button>
          </>
        }
      >
        <pre>
          <code onClick={(e) => console.dir(e.target)}>
            {JSON.stringify(questionnaires[modal.idx], null, 2)}
          </code>
        </pre>
      </Modal>
    </PageContainer>
  );
};

export default CreateQuestionnaires;
