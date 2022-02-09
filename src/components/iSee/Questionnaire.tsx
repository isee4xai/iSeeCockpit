import React from 'react';
import { Button, Col, Form, Input, Row, Select } from 'antd';
import QuestionSet from '@/components/iSee/QuestionSet';

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

  return (
    <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      initialValues={{ remember: true }}
      // onFinish={onFinish}
      // onFinishFailed={onFinishFailed}
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

      <QuestionSet />
      <Form.Item></Form.Item>
      <Row>
        <Col span={24} style={{ textAlign: 'right' }}>
          <Button type="primary" htmlType="submit">
            Save
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default Welcome;
