import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import {
  Card,
  Row,
  Col,
  Statistic,
  Tag,
  Button,
  PageHeader,
  Modal,
  Form,
  Input,
  Select,
  message,
} from 'antd';
import {
  LikeOutlined,
  LineChartOutlined,
  PlusOutlined,
  RocketOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import Meta from 'antd/lib/card/Meta';

const Welcome: React.FC = () => {
  const style = {
    // width: '400px',
    // margin: '30px',
    boxShadow: '0 4px 4px 0 rgba(0, 0, 0, 0.2)',
    border: '1px solid #e8e8e8',
  };

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [useCases, setUseCases] = useState([
    { name: 'Radiology Fracture Detection', goal: 'Determine if a radiology image contains a fracture', published: false, feed: 0, runs: 0 },
    { name: 'Loan Application', goal: 'Determine if a loan application is approved or not', published: true, feed: 120, runs: 130 },
  ]);

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
    values.runs = 0;
    values.feed = 0;
    values.published = false;
    setUseCases([...useCases, values]);
    console.log('Success:', values);
    handleOk();
    message.success('Succesfully Added Usecase');
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
        title="Usecases"
        subTitle="Displaying all usecases"
        extra={[
          <Button type="primary" onClick={showModal} style={{ width: '100%' }}>
            <PlusOutlined /> Add New
          </Button>,
        ]}
      />
      <Card>
        <Row gutter={20}>
          {useCases.map((usecase, index) => (
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
                title={usecase.name}
                extra={
                  (!usecase.published && <Tag color="red">Unpublished</Tag>) ||
                  (usecase.published && <Tag color="green">Published</Tag>)
                }
                actions={[
                  <Button type="text" href="usecase/manage">
                    <SettingOutlined color="green" />
                  </Button>,
                  <Button type="text" href="usecase/analytics">
                    <LineChartOutlined />
                  </Button>,
                ]}
              >
                <Meta description={usecase.goal} />
                <br />
                <Row gutter={16}>
                  <Col span={12}>
                    <Statistic title="Feedback" value={usecase.feed} prefix={<LikeOutlined />} />
                  </Col>
                  <Col span={12}>
                    <Statistic title="Runs" value={usecase.runs} prefix={<RocketOutlined />} />
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
