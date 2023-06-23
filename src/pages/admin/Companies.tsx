/* eslint-disable react/no-array-index-key */
import {
  LikeOutlined,
  LineChartOutlined,
  PlusOutlined,
  RocketOutlined,
  SettingOutlined,
  CommentOutlined,
  LinkOutlined,
  UserOutlined,
  UsergroupAddOutlined,
  FileAddOutlined
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import {
  Button,
  Card,
  Cascader,
  Col,
  Empty,
  Form,
  Input,
  message,
  Modal,
  PageHeader,
  Row,
  Select,
  Statistic,
  Tag,
  Typography,
} from 'antd';
import Meta from 'antd/lib/card/Meta';
import React, { useEffect, useState } from 'react';

// import type { Company } from '@/models/company';
import { api_admin_create_company, api_admin_get_companies } from '@/services/isee/admin';
import { get_domains } from '@/services/isee/ontology';
import TOOL_TIPS from '@/models/tooltips';
import { Company } from '@/models/company';
const { Text } = Typography;
const { Title } = Typography;

const Welcome: React.FC = () => {
  const style = {
    boxShadow: '0 4px 4px 0 rgba(0, 0, 0, 0.2)',
    border: '1px solid #e8e8e8',
  };

  const [isModalVisible, setIsModalVisible] = useState(false);

  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    (async () => {
      const data = await api_admin_get_companies();
      setCompanies(data);
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
    const data = await api_admin_get_companies();
    setCompanies(data);
  }

  async function create(company: Company) {
    console.log('Create Company:', company);
    handleOk();
    await api_admin_create_company(company);
    get_all();
    message.success('Succesfully Created New Company');
  }

  const onFinish = (values: any) => {
    const blank_obj: Company = {
      active: true,
      name: values.name,
      type: values.type
    };
    create(blank_obj);
  };

  return (
    <PageContainer>
      <Modal
        title="Create new Company"
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
            label="Name of the company"
            name="name"
            rules={[{ required: true, message: 'Input is required!' }]}
          >
            <Input placeholder="RGU..." />
          </Form.Item>

          <Form.Item
            label="Type of the company"
            name="type"
            rules={[{ required: true, message: 'Input is required!' }]}
          >
            <Input placeholder="Demo" />
          </Form.Item>
        </Form>
      </Modal>

      <PageHeader
        ghost={false}
        key="head1"
        // onBack={() => window.history.back()}
        title="Companies"
        subTitle="Displaying all companies"
        extra={[
          <Button key={'create-btn'} type="primary" onClick={showModal} style={{ width: '100%' }}>
            <PlusOutlined /> Create New
          </Button>,
        ]}
      />
      <Card>
        <Row gutter={20}>
          {companies.map((company: Company, index: number) => (
            <Col
              key={index}
              span={12}
            >
              <Card
                style={style}
                key={'card' + index}
                title={company.name}
                extra={
                  (!company.active && <Tag color="red">Disabled</Tag>) ||
                  (company.active && <> <Tag color="green">Active</Tag></>)
                }
                actions={[
                  <Button key={'btn-settings'} type="text" href={'/admin/company/' + company._id}>
                    <SettingOutlined color="green" /> Manage
                  </Button>,
                ]}
              >

                <Row gutter={2}>
                  <Col span={24}>
                    <Text style={{ paddingBottom: 10 }} strong> Type: {company.type}</Text>
                  </Col>
                  <Col span={24}>
                    <Text style={{ marginBottom: 10 }} disabled > {company.createdAt}</Text>
                  </Col>
                </Row>
                <br />
                <Row gutter={1}>

                  <Col span={8}>
                    <Statistic
                      title="Users"
                      value={company.users_count}
                      prefix={<UsergroupAddOutlined />}
                    />
                  </Col>
                  <Col span={8}>
                    <Statistic
                      title="Usecases"
                      value={company.usecases_count}
                      prefix={<FileAddOutlined />}
                    />
                  </Col>
                </Row>
              </Card>

              <br />
            </Col>
          ))}

          <Col
            hidden={companies.length > 0}
            span={12}
            offset={6}
          >
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No Companies yet! Start creating companies using the '+ Create New' button" />
          </Col>
        </Row>
      </Card>
    </PageContainer >
  );
};

export default Welcome;
