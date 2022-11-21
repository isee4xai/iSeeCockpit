/* eslint-disable react/no-array-index-key */
import {
  LikeOutlined,
  LineChartOutlined,
  PlusOutlined,
  RocketOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';


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
  Space, Table
} from 'antd';
import Meta from 'antd/lib/card/Meta';
import React, { useEffect, useState } from 'react';

import type { Usecase } from '@/models/usecase';
import { api_create, api_get_all } from '@/services/isee/usecases';

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  tags: string[];
}
const columns: ColumnsType<DataType> = [
  {
    title: 'Explainer',
    dataIndex: 'name',
    key: 'name',
    render: text => <a>{text}</a>,
  },
  {
    title: 'ExplainabilityTechnique',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: 'Dataset Type',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: 'Tags',
    key: 'tags',
    dataIndex: 'tags',
    render: (_, { tags }) => (
      <>
        {tags.map(tag => {
          let color = tag.length > 5 ? 'geekblue' : 'green';
          if (tag === 'loser') {
            color = 'volcano';
          }
          return (
            <Tag color={color} key={tag}>
              {tag.toUpperCase()}
            </Tag>
          );
        })}
      </>
    ),
  },
  {
    title: 'Action',
    key: 'action',
    render: (_, record) => (
      <Space size="middle">
        <a>Invite {record.name}</a>
        <a>Delete</a>
      </Space>
    ),
  },
];

const data: DataType[] = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer'],
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: ['loser'],
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
  },
];


const Explainers: React.FC = () => {
  const style = {
    boxShadow: '0 4px 4px 0 rgba(0, 0, 0, 0.2)',
    border: '1px solid #e8e8e8',
  };

  const [isModalVisible, setIsModalVisible] = useState(false);

  const [useCases, setUseCases] = useState([]);

  useEffect(() => {
    (async () => {
      const data = await api_get_all();
      setUseCases(data);
    })();
  }, []);

  const showModal = () => {
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
    message.success('Succesfully Added Usecase');
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
        ml_model: '',
        model_mode: 'file',
        completed: false,
      },
      name: values.name,
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
            <Input />
          </Form.Item>

          <Form.Item
            label="Domain"
            name="domain"
            rules={[{ required: false, message: 'Input is required!' }]}
          >
            <Select>
              <Select.Option value="finance">Finance</Select.Option>
              <Select.Option value="healthcare">Healthcare</Select.Option>
              <Select.Option value="technology">Technology</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Goal of the usecase"
            name="goal"
            rules={[{ required: false, message: 'Input is required!' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      <PageHeader
        ghost={false}
        key="head1"
        // onBack={() => window.history.back()}
        title="Explainer Library"
        subTitle="Displaying all explainers"
        extra={[
          <Button key={'create-btn'} type="primary" onClick={showModal} style={{ width: '100%' }}>
            <PlusOutlined /> Add New
          </Button>,
        ]}
      />
      {/* <Card> */}
      {/* <Row gutter={20}> */}
      <Table columns={columns} dataSource={data} />

      {/* {useCases.map((usecase: Usecase, index: number) => (
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
      ))} */}
      {/* </Row>
      </Card> */}
    </PageContainer>
  );
};

export default Explainers;
