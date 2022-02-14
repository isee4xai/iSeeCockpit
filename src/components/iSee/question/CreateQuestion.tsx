import React, { useState } from 'react';
import { Card, Form, Input, Button, Select, Switch, message } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Question } from '@/models/questionnaire';
import DATA_FILEDS from '@/models/common';

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

const CreateQuestion: React.FC<{ question: Question }> = (props) => {
  const { Option } = Select;

  const [question, setQuestion] = useState(props.question);

  const onQuestionTextChange = (values: any) => {
    console.log('onQuestionTextChange:', values);
    const newQuestion: Question = {
      "text": values.target.value,
      "metric": question.metric,
      "metric_values": question.metric_values,
      "required": question.required
    }
    setQuestion(newQuestion);
  };

  const onQuestionMetricChange = (values: any) => {
    console.log('onQuestionMetricChange:', values);
    const newQuestion: Question = {
      "text": question.text,
      "metric": values,
      "metric_values": question.metric_values,
      "required": question.required
    }
    setQuestion(newQuestion);
  }

  const onFinish = (values: any) => {
    // setQuestion(values);
    console.log('Success Question:', values);
    // message.success('Succesfully Updated Question!');
  };

  const onResponseValueChange = (values: any) => {
    console.log('onResponseValueChange:', values);
  }

  const onRequiredChange = (values: any) => {
    console.log('onRequiredChange:', values);
    const newQuestion: Question = {
      "text": question.text,
      "metric": question.metric,
      "metric_values": question.metric_values,
      "required": values
    }
    setQuestion(newQuestion);
  }

  const addResponse = () => {
    const newResponse: string = "";
    const responsesTemp: string[] = question.metric_values || [];
    responsesTemp.push(newResponse);
    const newQuestion = {
      "text": question.text,
      "metric": question.metric,
      "metric_values": responsesTemp,
      "required": question.required
    }
    setQuestion(newQuestion);
    message.success('Added new Response!');
  };

  const removeResponse = (value: any) => {
    const newResponses = question.metric_values?.filter((item) => item !== value)
    const newQuestion = {
      "text": question.text,
      "metric": question.metric,
      "metric_values": newResponses,
      "required": question.required
    }
    setQuestion(newQuestion);
    message.success('Removed Response!');
  };

  return (
    <Card bordered={false}>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={question}
        onFinish={onFinish}
      // onChange={onChange}
      >
        <Form.Item
          label="Question Text"
          name="question_text"
          tooltip="This is a required field"
          rules={[{ required: true, message: 'Input is required!' }]}
        >
          <Input onChange={onQuestionTextChange} />
        </Form.Item>

        <Form.Item
          label="Response Type"
          name="question_metric"
          tooltip="This is a required field"
          rules={[{ required: true, message: 'Input is required!' }]}
        >
          <Select
            onChange={onQuestionMetricChange}>
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
              <Form.List
                name="metric_values">
                {(metric_values, { }, { errors }) => (
                  <>
                    {question.metric_values?.map((value, index) => (
                      <Form.Item
                        {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                        label={index === 0 ? 'Response Values' : ''}
                        required={true}
                        key={index}
                        name="response_value"
                      >
                        <Form.Item
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
                          <Input
                            placeholder="response value"
                            style={{ width: '60%' }}
                            onChange={onResponseValueChange}
                            defaultValue={value} />
                        </Form.Item>
                        {question.metric_values ? question.metric_values.length > 2 ? (
                          <Button
                            className="dynamic-delete-button"
                            // danger={true}
                            icon={<MinusCircleOutlined />}
                            onClick={() => removeResponse(value)}
                          >

                          </Button>

                        ) : null : null}
                      </Form.Item>
                    ))}
                    <Form.Item {...formItemLayoutWithOutLabel}>
                      <Button
                        type="dashed"
                        onClick={() => addResponse()}
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

        <Form.Item label="Required" name="required" valuePropName="required">
          <Switch
            onChange={onRequiredChange} />
        </Form.Item>
      </Form>
    </Card >
  );
};

export default CreateQuestion;
