import './QuestionForm.less';
import React, { useCallback, useEffect, useState } from 'react';
import { Switch, Input, Select, Empty, Space, InputNumber } from 'antd';
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
  const [title, setTitle] = useState<string>(state.text ?? '');

  const handleCategoryChange = (newCategory: string) => {
    setState({ ...state, category: newCategory });
  };

  const handleTypeChange = (newType: string) => {
    setState({ ...state, metric: newType });
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleRequireChange = (required: boolean) => {
    setState({ ...state, required });
  };

  const handleOptionChange = useCallback((options: string[]) => {
    setState((old) => ({
      ...old,
      metric_values: options.map((opt) => ({ val: opt })),
    }));
  }, []);

  const handleMaxInputChange = (max: number) => {
    setState({ ...state, validators: { ...state.validators, max } });
  };

  const handleMinInputChange = (min: number) => {
    setState({ ...state, validators: { ...state.validators, min } });
  };

  useEffect(() => {
    onChange(state);
  }, [state, onChange]);

  return (
    <div className="QuestionForm-container">
      <div className="QuestionForm-header">
        <Input
          size="large"
          allowClear
          placeholder="Enter the question"
          value={title}
          onChange={handleTitleChange}
          onBlur={(e) => setState({ ...state, text: e.target.value })}
          addonBefore={<QuestionOutlined />}
        />
      </div>
      <div className="Questionnaire-body">
        <div className="Questionnaire-top-body">
          <Select
            defaultValue={state.category}
            placeholder="Choose a category"
            style={{ width: 'calc(50% - .5rem)' }}
            onChange={handleCategoryChange}
          >
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
          <Select
            defaultValue={state.metric}
            placeholder="Choose a type"
            style={{ width: 'calc(50% - .5rem)' }}
            onChange={handleTypeChange}
          >
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
        </div>
        <div className="Questionanire-dynamic-body">
          {state.metric === 'Free-Text' ? null : state.metric === 'Number' ? (
            <>
              <Space>
                <InputNumber placeholder={'min'} onChange={handleMinInputChange} />
                <InputNumber placeholder={'max'} onChange={handleMaxInputChange} />
              </Space>
            </>
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
        <span>Required</span>
        <Switch
          checkedChildren={<CheckOutlined />}
          unCheckedChildren={<CloseOutlined />}
          checked={state.required}
          onChange={handleRequireChange}
        />
        <CopyOutlined
          style={{ fontSize: 22, color: 'grey' }}
          onClick={() => onDuplication(state.id)}
        />
        <DeleteOutlined
          style={{ fontSize: 22, color: 'grey' }}
          onClick={() => onDelete(state.id)}
        />
      </div>
    </div>
  );
};

export default QuestionForm;
