/* eslint-disable react/no-array-index-key */
import {
  LikeOutlined,
  LineChartOutlined,
  PlusOutlined,
  RocketOutlined,
  SettingOutlined,
  CommentOutlined
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  message,
  Modal,
  PageHeader,
  Row,
  Select,
  Statistic,
  Tag,
} from 'antd';
import Meta from 'antd/lib/card/Meta';
import React, { useEffect, useState } from 'react';

import type { Usecase } from '@/models/usecase';
import { api_create, api_get_all } from '@/services/isee/usecases';
import { get_domains } from '@/services/isee/ontology';

const Welcome: React.FC = () => {
  const style = {
    boxShadow: '0 4px 4px 0 rgba(0, 0, 0, 0.2)',
    border: '1px solid #e8e8e8',
  };

  const [isModalVisible, setIsModalVisible] = useState(false);

  const [useCases, setUseCases] = useState([]);
  const [domains, setDomains] = useState<API.OntoPair[]>([]);

  useEffect(() => {
    (async () => {
      const data = await api_get_all();
      setUseCases(data);
    })();
  }, []);

  const showModal = () => {
    get_domains()
      .then((response) => {
        if (response) {
          setDomains(response)
        }
      })
      .catch((error) => {
        console.log("onto-error: User Domains", error);
        message.error("Error Reading Ontology - E501");
      });
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  async function get_all() {
    const data = await api_get_all();
    setUseCases(data);
  }

  async function create(usecase: Usecase) {
    console.log('Create Usecase:', usecase);
    handleOk();
    await api_create(usecase);
    get_all();
    message.success('Succesfully Created New Usecase');
  }

  const onFinish = (values: any) => {
    const blank_obj: Usecase = {
      published: false,
      stats: {
        runs: 0,
        feedback: 0,
      },
      settings: {
        ai_task: '',
        // ai_method: [],
        data_type: '',
        dataset_type: '',
        model_mode: 'file',
        model_alias: '',
        model_backend: '',
        model_source: '',
        model_attributes: {},
        completed: false,
      },
      name: values.name,
      domain: values.domain,
      goal: values.goal,
      personas: [],
    };
    create(blank_obj);
  };

  return (
    <PageContainer>
      <Modal
        title="Create new Usecase"
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
            label="Name of the usecase"
            name="name"
            rules={[{ required: true, message: 'Input is required!' }]}
          >
            <Input placeholder="Name of the usecase" />
          </Form.Item>

          <Form.Item
            label="Domain"
            name="domain"
            rules={[{ required: true, message: 'Please select a suitable domain!' }]}
          >
            <Select placeholder="Select Domain" >
              {domains.map((option: API.OntoPair) => (
                <Select.Option value={option.key} key={option.key}>
                  {option.label}
                </Select.Option>
              ))}

            </Select>
          </Form.Item>

          <Form.Item
            label="Goal of the usecase"
            name="goal"
            rules={[{ required: true, message: 'Input is required!' }]}
          >
            <Input placeholder="Goal of my usecase is to..." />
          </Form.Item>
        </Form>
      </Modal>

      <PageHeader
        ghost={false}
        key="head1"
        // onBack={() => window.history.back()}
        title="Usecases"
        subTitle="Displaying all usecases"
        extra={[
          <Button key={'create-btn'} type="primary" onClick={showModal} style={{ width: '100%' }}>
            <PlusOutlined /> Create New
          </Button>,
        ]}
      />
      <Card>
        <Row gutter={20}>
          {useCases.map((usecase: Usecase, index: number) => (
            <Col
              key={index}
              span={8}
              xs={{ order: 1 }}
              sm={{ order: 2 }}
              md={{ order: 3 }}
              lg={{ order: 4 }}
            >
              <Card
                style={style}
                key={'card' + index}
                title={usecase.name}
                extra={
                  (!usecase.published && <Tag color="red">Unpublished</Tag>) ||
                  (usecase.published && <Tag color="green">Published</Tag>)
                }
                actions={[
                  <Button key={'btn-settings'} type="text" href={'usecase/manage/' + usecase._id}>
                    <SettingOutlined color="green" />
                  </Button>,
                  <Button
                    key={'btn-analytics'}
                    type="text"
                    href={'usecase/analytics/' + usecase._id}
                  >
                    <LineChartOutlined />
                  </Button>,
                  <Button key={'btn-settings'} type="text" href={'/dialogue/' + usecase._id}>
                    <CommentOutlined color="green" />
                  </Button>,
                ]}
              >
                <Meta description={usecase.goal} />
                <br />
                <Row gutter={16}>
                  <Col span={12}>
                    <Statistic
                      title="Feedback"
                      value={usecase.stats?.feedback}
                      prefix={<LikeOutlined />}
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic
                      title="Runs"
                      value={usecase.stats?.runs}
                      prefix={<RocketOutlined />}
                    />
                  </Col>
                </Row>
              </Card>

              <br />
            </Col>
          ))}
        </Row>
      </Card>
    </PageContainer>
  );
};

export default Welcome;
