import CreateQuestionnaire from '@/components/iSee/question/CreateQuestionnaire';
import DATA_FILEDS from '@/models/common';
import {
  CopyOutlined,
  ExportOutlined,
  MinusCircleOutlined,
  PlusOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import {
  Button,
  Card,
  Collapse,
  Empty,
  Form,
  Input,
  message,
  Modal,
  notification,
  PageHeader,
  Popconfirm,
  Select,
} from 'antd';
import React, { useEffect, useState } from 'react';
const { Panel } = Collapse;
const { Option } = Select;

import type { Questionnaire } from '@/models/questionnaire';
import { api_create, api_delete, api_get_all } from '@/services/isee/questionnaires';

const CreateQuestionnaires: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modal, setModal] = useState({ visibility: false, idx: -1 });
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);

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

  const onFinish = (values: any) => {
    values.questions = [];

    api_create(values)
      .then((data) => {
        setQuestionnaires([...questionnaires, data]);
        message.success('Succesfully Added questionnaire');
      })
      .catch((error) => {
        message.error(error.message);
      });

    handleOk();
  };

  const removeQuestionnaire = (values: any) => {
    api_delete(values._id)
      .then(() => {
        setQuestionnaires(questionnaires.filter((item) => item.name !== values.name));
        message.success('Succesfully deleted questionnaire');
      })
      .catch((error) => {
        message.error(error.message);
      });
  };

  const genExtra = (values: any) => (
    <div>
      <Button
        type="primary"
        icon={<ExportOutlined />}
        ghost
        style={{ marginRight: '10px' }}
        onClick={() => {
          setModal({ visibility: true, idx: questionnaires.indexOf(values) });
        }}
      />
      {/* <Popconfirm
        title={'Are you sure to delete?'}
        onConfirm={() => removeQuestionnaire(values)}
        okText="Yes"
        cancelText="No"
      >
        <Button danger type="primary" ghost icon={<MinusCircleOutlined />} />
      </Popconfirm> */}
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

  useEffect(() => {
    (async () => {
      const data = await api_get_all();
      setQuestionnaires(data);
    })();
  }, []);

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
        key="questionnaires_heading"
        title="Pre-loaded Questionnaires"
      // subTitle="Displaying questionnaires"
      // Later enable for Admins only
      // extra={[
      //   <Button
      //     type="primary"
      //     onClick={showModal}
      //     style={{ width: '100%' }}
      //     key={'add-questionnaire-btn'}
      //   >
      //     <PlusOutlined /> Add New Questionnaire
      //   </Button>,
      // ]}
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
                key={questionnaire.name || 'no-name'}
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
