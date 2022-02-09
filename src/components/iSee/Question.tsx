import React from 'react';
import { Card, Form, Input, Button, Select, Switch } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

const DATA_FILEDS = {
  QUESTION_CATEGORY: [
    'Goodness',
    'Satisfaction',
    'Mental Model',
    'Curiosity',
    'Trust',
    'Performance',
  ],
  QUESTION_METRIC: ['free-text', 'integer', 'radio', 'check', 'Likert'],
};

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};
const formItemLayoutWithOutLabel = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 16, offset: 8 },
  },
};

const Question: React.FC = () => {
  const { Option } = Select;

  return (
    <Card bordered={false}>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        // onFinish={onFinish}
        // onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label="Question Text"
          name="question_text"
          tooltip="This is a required field"
          rules={[{ required: true, message: 'Input is required!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Response Type"
          name="question_metric"
          tooltip="This is a required field"
          rules={[{ required: true, message: 'Input is required!' }]}
        >
          <Select>
            {DATA_FILEDS.QUESTION_METRIC.map((option) => (
              <Option key={option} value={option}>
                {option}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          shouldUpdate={(prevValues, currentValues) =>
            prevValues.question_metric !== currentValues.question_metric
          }
          noStyle
        >
          {({ getFieldValue }) =>
            getFieldValue('question_metric') === 'radio' ||
            getFieldValue('question_metric') === 'check' ||
            getFieldValue('question_metric') === 'Likert' ? (
              <Form.List name="metric_values">
                {(fields, { add, remove }, { errors }) => (
                  <>
                    {fields.map((field, index) => (
                      <Form.Item
                        {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                        label={index === 0 ? 'Response Values' : ''}
                        required={false}
                        key={field.key}
                      >
                        <Form.Item
                          {...field}
                          validateTrigger={['onChange', 'onBlur']}
                          rules={[
                            {
                              required: true,
                              whitespace: true,
                              message: 'At least two options are required!',
                            },
                          ]}
                          noStyle
                        >
                          <Input placeholder="response value" style={{ width: '60%' }} />
                        </Form.Item>
                        {fields.length > 2 ? (
                          <MinusCircleOutlined
                            className="dynamic-delete-button"
                            onClick={() => remove(field.name)}
                          />
                        ) : null}
                      </Form.Item>
                    ))}
                    <Form.Item {...formItemLayoutWithOutLabel}>
                      <Button
                        type="dashed"
                        onClick={() => add()}
                        style={{ width: '60%' }}
                        icon={<PlusOutlined />}
                      >
                        Add Response Values
                      </Button>

                      <Form.ErrorList errors={errors} />
                    </Form.Item>
                  </>
                )}
              </Form.List>
            ) : null
          }
        </Form.Item>

        <Form.Item label="Required" valuePropName="question_required">
          <Switch />
        </Form.Item>
      </Form>
    </Card>
  );
};

export default Question;
