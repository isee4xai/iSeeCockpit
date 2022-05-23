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
      dimension: 'Satisfaction',
      id: 'q-1',
      questions: [
        {
          content: 'From the explanation, I understand how the AI model works.',
          responseType: 'Likert',
          responseOptions: [
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
          content: 'This explanation of how the AI model works is satisfying.',
          responseType: 'Likert',
          responseOptions: [
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
          content: 'This explanation of how the AI model works has sufficient detail.',
          responseType: 'Likert',
          responseOptions: [
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
          content: 'This explanation of how the AI model works seems complete.',
          responseType: 'Likert',
          responseOptions: [
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
          content: 'This explanation of how the AI model works tells me how to use it',
          responseType: 'Likert',
          responseOptions: [
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
          content: 'This explanation of how the AI model works is useful to my goals.',
          responseType: 'Likert',
          responseOptions: [
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
          content:
            'This explanation of the [software, algorithm, tool] shows me how accurate the AI model is.',
          responseType: 'Likert',
          responseOptions: [
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
          content:
            'This explanation lets me judge when I should trust and not trust the AI model. ',
          responseType: 'Likert',
          responseOptions: [
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
      dimension: 'Goodness',
      id: 'q-2',
      questions: [
        {
          content: 'The explanation helps me understand how the AI model works.',
          responseType: 'Radio',
          responseOptions: [{ val: 'Yes' }, { val: 'No' }],
          required: true,
          id: 'q-2-1',
        },
        {
          content: 'The explanation of how the AI model works is satisfying.',
          responseType: 'Radio',
          responseOptions: [{ val: 'Yes' }, { val: 'No' }],
          required: true,
          id: 'q-2-2',
        },
        {
          content: 'The explanation of the AI model sufficiently detailed. ',
          responseType: 'Radio',
          responseOptions: [{ val: 'Yes' }, { val: 'No' }],
          required: true,
          id: 'q-2-3',
        },
        {
          content: 'The explanation of how the AI model works is sufficiently complete.',
          responseType: 'Radio',
          responseOptions: [{ val: 'Yes' }, { val: 'No' }],
          required: true,
          id: 'q-2-4',
        },
        {
          content:
            'The explanation is actionable, that is, it helps me know how to use the AI M=model',
          responseType: 'Radio',
          responseOptions: [{ val: 'Yes' }, { val: 'No' }],
          required: true,
          id: 'q-2-5',
        },
        {
          content: 'The explanation lets me know how accurate or reliable the AI model is.',
          responseType: 'Radio',
          responseOptions: [{ val: 'Yes' }, { val: 'No' }],
          required: true,
          id: 'q-2-6',
        },
        {
          content: 'The explanation lets me know how trustworthy the AI model is.',
          responseType: 'Radio',
          responseOptions: [{ val: 'Yes' }, { val: 'No' }],
          required: true,
          id: 'q-2-7',
        },
      ],
    },
    {
      name: 'Cahour-Forzy Trust Scale;',
      dimension: 'Trust',
      id: 'q-3',
      questions: [
        {
          content: 'What is your confidence in the [tool]? Do you have a feeling of trust in it?',
          responseType: 'Likert',
          responseOptions: [
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
          content: 'Are the actions of the [tool] predictable?',
          responseType: 'Likert',
          responseOptions: [
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
          content: 'Is the [tool] reliable? Do you think it is safe?',
          responseType: 'Likert',
          responseOptions: [
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
          content: 'Is the [tool] efficient at what it does?',
          responseType: 'Likert',
          responseOptions: [
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
      dimension: 'Trust',
      id: 'q-4',
      questions: [
        {
          content: 'I am confident in the [tool]. I feel that it works well.',
          responseType: 'Likert',
          responseOptions: [
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
          content: 'The outputs of the [tool] are very predictable.',
          responseType: 'Likert',
          responseOptions: [
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
          content: 'I feel safe that when I rely on the [tool] I will get the right answers.',
          responseType: 'Likert',
          responseOptions: [
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
          content: 'The [tool] is efficient in that it works very quickly.',
          responseType: 'Likert',
          responseOptions: [
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
          content: 'I am wary of the [tool].',
          responseType: 'Likert',
          responseOptions: [
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
          content: ' The [tool] can perform the task better than a novice human user.',
          responseType: 'Likert',
          responseOptions: [
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
          content: 'I like using the system for decision making.',
          responseType: 'Likert',
          responseOptions: [
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
            name="dimension"
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
