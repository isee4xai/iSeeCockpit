import './QuestionForm.less';
import React, { useCallback, useEffect, useState } from 'react';
import { Switch, Input, Select, Empty, Space, InputNumber, Form } from 'antd';
import CheckboxInput from './CheckboxInput';
import LikertInput from './LikertInput';
import RadioInput from './RadioInput';
import {
  CopyOutlined,
  DeleteOutlined,
  FieldStringOutlined,
  QuestionCircleOutlined,
  FieldNumberOutlined,
  CheckOutlined,
  LikeOutlined,
  CloseOutlined,
  CheckSquareOutlined,
  SettingOutlined,
  RadarChartOutlined,
  DashboardOutlined,
  ThunderboltOutlined,
  CheckCircleOutlined,
  QuestionOutlined,
  SmileOutlined,
} from '@ant-design/icons';

interface Question {
  id?: string;
  text?: string;
  metric?: string;
  category?: string;
  metric_values?: {
    val: string;
  }[];
  required?: boolean;
  completed?: boolean;
  validators?: {
    min?: number;
    max?: number;
  };
}

const QuestionForm: React.FC<{
  question: Question;
  onChange: (question: Question) => void;
  onDuplication: (id: string | undefined) => void;
  onDelete: (id: string | undefined) => void;
}> = ({ question, onChange, onDuplication, onDelete }) => {
  const [state, setState] = useState<Question>({ ...question });

  const handleOptionChange = useCallback((options: string[]) => {
    setState((old) => ({
      ...old,
      metric_values: options.map((opt) => ({ val: opt })),
    }));
  }, []);

  useEffect(() => {
    onChange(state);
  }, [state, onChange]);

  const onFormChange = (values: any, allValues: any) => {
    setState({ ...state, ...allValues });
  };

  return (
    <Form className="QuestionForm-container" onValuesChange={onFormChange}>
      <Form.Item
        className="QuestionForm-header"
        name="text"
        rules={[
          {
            required: true,
            message: 'Please input your question!',
          },
        ]}
      >
        <Input
          allowClear
          size="large"
          placeholder="Enter the question"
          defaultValue={state.text}
          addonBefore={<QuestionOutlined />}
        />
      </Form.Item>
      <div className="Questionnaire-body">
        <div className="Questionnaire-top-body">
          <Form.Item
            name={'category'}
            rules={[
              {
                required: true,
                message: 'Please choose a category!',
              },
            ]}
          >
            <Select defaultValue={state.category} placeholder="Choose a category">
              <Select.Option value="Goodness">
                <LikeOutlined /> - Goodness
              </Select.Option>
              <Select.Option value="SatisFaction">
                <SmileOutlined /> - Satisfaction
              </Select.Option>
              <Select.Option value="Mental Model">
                <RadarChartOutlined /> - Mental Model
              </Select.Option>
              <Select.Option value="Curiosity">
                <QuestionCircleOutlined /> - Curiosity
              </Select.Option>
              <Select.Option value="Trust">
                <CheckOutlined /> - Trust
              </Select.Option>
              <Select.Option value="Performance">
                <ThunderboltOutlined /> - Performance
              </Select.Option>
              <Select.Option value="Custom">
                <SettingOutlined /> - Custom
              </Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name={'metric'}
            rules={[
              {
                required: true,
                message: 'Please choose a question type!',
              },
            ]}
          >
            <Select defaultValue={state.metric} placeholder="Choose a type">
              <Select.Option value="Free-Text">
                <FieldStringOutlined /> - Free-Text
              </Select.Option>
              <Select.Option value="Number">
                <FieldNumberOutlined /> - Number
              </Select.Option>
              <Select.Option value="Radio">
                <CheckCircleOutlined /> - Radio
              </Select.Option>
              <Select.Option value="Checkbox">
                <CheckSquareOutlined /> - Checkbox
              </Select.Option>
              <Select.Option value="Likert">
                <DashboardOutlined /> - Likert
              </Select.Option>
            </Select>
          </Form.Item>
        </div>
        <div className="Questionanire-dynamic-body">
          {state.metric === 'Free-Text' ? null : state.metric === 'Number' ? (
            <Space>
              <Form.Item name={['validators', 'min']}>
                <InputNumber placeholder={'min'} />
              </Form.Item>
              <Form.Item name={['validators', 'max']}>
                <InputNumber placeholder={'max'} />
              </Form.Item>
            </Space>
          ) : state.metric === 'Radio' ? (
            <RadioInput
              onChange={handleOptionChange}
              options={question?.metric_values?.map((opt) => opt.val)}
            />
          ) : state.metric === 'Checkbox' ? (
            <CheckboxInput
              onChange={handleOptionChange}
              options={question?.metric_values?.map((opt) => opt.val)}
            />
          ) : state.metric === 'Likert' ? (
            <LikertInput
              onChange={handleOptionChange}
              options={question?.metric_values?.map((opt) => opt.val)}
            />
          ) : (
            <Empty description={'Please, choose a question type !'} />
          )}
        </div>
      </div>
      <div className="Questionnaire-footer">
        <Form.Item name={'required'} label={'required'} className={'footer-required-switch'}>
          <Switch
            checkedChildren={<CheckOutlined />}
            unCheckedChildren={<CloseOutlined />}
            checked={state.required}
          />
        </Form.Item>
        <CopyOutlined
          style={{ fontSize: 22, color: 'grey' }}
          onClick={() => onDuplication(state.id)}
        />
        <DeleteOutlined
          style={{ fontSize: 22, color: 'grey' }}
          onClick={() => onDelete(state.id)}
        />
      </div>
    </Form>
  );
};

export default QuestionForm;