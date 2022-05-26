import './QuestionForm.less';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Switch,
  Input,
  Select,
  Empty,
  InputNumber,
  Form,
  Popconfirm,
  Divider,
  Space,
  Typography,
} from 'antd';
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
  PlusOutlined,
  RadarChartOutlined,
  DashboardOutlined,
  ThunderboltOutlined,
  CheckCircleOutlined,
  QuestionOutlined,
  SmileOutlined,
} from '@ant-design/icons';

import type { Question } from '@/models/questionnaire';

const QuestionForm: React.FC<{
  question: Question;
  onChange?: (question: Question) => void;
  onDuplication?: (id: string | undefined) => void;
  onDelete?: (id: string | undefined) => void;
  noCategory?: boolean;
}> = ({ question, onChange, onDuplication, onDelete, noCategory = false }) => {
  const [state, setState] = useState<Question>({ ...question });
  const [name, setName] = useState('');
  const [content, setContent] = useState(state.content);

  const handleOptionChange = useCallback((options: string[]) => {
    setState((old) => ({
      ...old,
      responseOptions: options.map((opt) => ({ val: opt })),
    }));
  }, []);

  const handleNameChange = (event: any) => {
    setName(event.target.value);
  };

  const addItem = (e: any) => {
    e.preventDefault();
    if (name && name.trim().length > 0) {
      setState({ ...state, dimension: name });
      setName('');
    }
  };

  useEffect(() => {
    if (onChange) onChange(state);
  }, [state, onChange]);

  const onFormChange = (values: any, allValues: any) => {
    setState({ ...state, ...allValues });
  };

  return (
    <Form className={`QuestionForm-container ${state.responseType}`} onValuesChange={onFormChange}>
      <Input
        style={{ margin: '1rem', width: 'calc(100% - 2rem)' }}
        defaultValue={content}
        allowClear
        size="large"
        placeholder="Enter the question"
        onChange={(e: any) => setContent(e.target.value)}
        onBlur={(e: any) => setState({ ...state, content: e.target.value })}
        addonBefore={<QuestionOutlined />}
      />
      <div className="Questionnaire-body">
        <div className="Questionnaire-top-body">
          {!noCategory && (
            <Form.Item
              initialValue={state.dimension}
              name={'dimension'}
              rules={[
                {
                  required: true,
                  message: 'Please choose a category!',
                },
              ]}
            >
              <Select
                placeholder="Choose a category"
                dropdownRender={(menu) => (
                  <>
                    {menu}
                    <Divider
                      style={{
                        margin: '8px 0',
                      }}
                    />
                    <Space
                      align="center"
                      style={{
                        padding: '0 8px 4px',
                      }}
                    >
                      <Input
                        placeholder="Define the custom category"
                        value={name}
                        onChange={handleNameChange}
                      />
                      <Typography.Link
                        onClick={addItem}
                        style={{
                          whiteSpace: 'nowrap',
                        }}
                      >
                        <PlusOutlined /> Update
                      </Typography.Link>
                    </Space>
                  </>
                )}
              >
                <Select.Option value="Goodness">
                  <LikeOutlined className="selectIcon" /> - Goodness
                </Select.Option>
                <Select.Option value="Satisfaction">
                  <SmileOutlined className="selectIcon" /> - Satisfaction
                </Select.Option>
                <Select.Option value="Mental Model">
                  <RadarChartOutlined className="selectIcon" /> - Mental Model
                </Select.Option>
                <Select.Option value="Curiosity">
                  <QuestionCircleOutlined className="selectIcon" /> - Curiosity
                </Select.Option>
                <Select.Option value="Trust">
                  <CheckOutlined className="selectIcon" /> - Trust
                </Select.Option>
                <Select.Option value="Performance">
                  <ThunderboltOutlined className="selectIcon" /> - Performance
                </Select.Option>
                <Select.Option
                  value={
                    state.dimension &&
                    ![
                      'Goodness',
                      'Satisfaction',
                      'Mental Model',
                      'Curiosity',
                      'Trust',
                      'Performance',
                    ].includes(state.dimension) &&
                    state.dimension.trim()
                      ? state.dimension
                      : 'Custom'
                  }
                >
                  <SettingOutlined className="selectIcon" /> -{' '}
                  {state.dimension &&
                  ![
                    'Goodness',
                    'Satisfaction',
                    'Mental Model',
                    'Curiosity',
                    'Trust',
                    'Performance',
                  ].includes(state.dimension) &&
                  state.dimension.trim()
                    ? state.dimension
                    : 'Custom'}
                </Select.Option>
              </Select>
            </Form.Item>
          )}
          <Form.Item
            initialValue={state.responseType}
            name={'responseType'}
            rules={[
              {
                required: true,
                message: 'Please choose a question type!',
              },
            ]}
          >
            <Select placeholder="Choose a type">
              <Select.Option value="Free-Text">
                <FieldStringOutlined className="selectIcon" /> - Free-Text
              </Select.Option>
              <Select.Option value="Number">
                <FieldNumberOutlined className="selectIcon" /> - Number
              </Select.Option>
              <Select.Option value="Radio">
                <CheckCircleOutlined className="selectIcon" /> - Radio
              </Select.Option>
              <Select.Option value="Checkbox">
                <CheckSquareOutlined className="selectIcon" /> - Checkbox
              </Select.Option>
              <Select.Option value="Likert">
                <DashboardOutlined className="selectIcon" /> - Likert
              </Select.Option>
            </Select>
          </Form.Item>
        </div>
        <div className="Questionanire-dynamic-body">
          {state.responseType === 'Free-Text' ? null : state.responseType === 'Number' ? (
            <div>
              <Form.Item
                initialValue={state.validators?.min}
                name={['validators', 'min']}
                style={{ display: 'inline-block', padding: '0 1rem 0 0' }}
              >
                <InputNumber placeholder={'min'} />
              </Form.Item>
              <Form.Item
                initialValue={state.validators?.max}
                name={['validators', 'max']}
                style={{ display: 'inline-block', padding: '0 1rem 0 0' }}
              >
                <InputNumber placeholder={'max'} />
              </Form.Item>
            </div>
          ) : state.responseType === 'Radio' ? (
            <RadioInput
              onChange={handleOptionChange}
              options={question?.responseOptions?.map((opt) => opt.val)}
            />
          ) : state.responseType === 'Checkbox' ? (
            <CheckboxInput
              onChange={handleOptionChange}
              options={question?.responseOptions?.map((opt) => opt.val)}
            />
          ) : state.responseType === 'Likert' ? (
            <LikertInput
              onChange={handleOptionChange}
              options={question?.responseOptions?.map((opt) => opt.val)}
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
          onClick={() => onDuplication && onDuplication(state.id)}
        />

        <Popconfirm
          title="Are you sure to delete this question?"
          onConfirm={() => onDelete && onDelete(state.id)}
          okText="Yes"
          cancelText="No"
        >
          <DeleteOutlined style={{ fontSize: 22, color: 'grey' }} />
        </Popconfirm>
      </div>
    </Form>
  );
};

export default QuestionForm;
