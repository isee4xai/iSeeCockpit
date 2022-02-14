import React, { useState } from 'react';
import { Button, Col, Form, Input, Row, Select, message, Empty, Divider, Space, Card, Popconfirm, } from 'antd';
import { Question, Questionnaire } from '@/models/questionnaire';
import CreateQuestion from './CreateQuestion';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import DATA_FILEDS from '@/models/common';

export type QuestionnaireType = {
  questionnaire: Questionnaire
};

const CreateQuestionnaire: React.FC<QuestionnaireType> = (props) => {
  const { Option } = Select;

  const [questionnaire, setQuestionnaire] = useState(props.questionnaire);

  const onFinish = (values: any) => {
    setQuestionnaire(values);
    console.log('Success:', values);
    message.success('Succesfully Updated Questionnaire!');
  };

  const addQuestion = () => {
    const newQuestion: Question = {
      "text": "",
      "metric": "",
      "metric_values": [],
      "required": false,
    };
    const questionsTemp: Question[] = questionnaire.questions || [];
    questionsTemp.push(newQuestion);
    const newQuestionnaire: Questionnaire = {
      "name": questionnaire.name,
      "category": questionnaire.category,
      "questions": questionsTemp
    }
    setQuestionnaire(newQuestionnaire);
    message.success('Added new Question!');
  };

  const removeQuestion = (values: any) => {
    const questionsTemp: Question[] = questionnaire.questions || [];
    const newQuestions = questionsTemp.filter((item) => item.text !== values.text)
    const newQuestionnaire = {
      "name": questionnaire.name,
      "category": questionnaire.category,
      "questions": newQuestions
    };
    setQuestionnaire(newQuestionnaire);
    message.success('Removed Question!');
  };

  return (
    <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      initialValues={questionnaire}
      onFinish={onFinish}
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
        <Select
        >
          {DATA_FILEDS.QUESTION_CATEGORY.map((option) => (
            <Option key={option} value={option}>
              {option}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.List
        name="questions"
      // initialValue={questions}
      >
        {(fields, { }, { errors }) => (
          <>
            <Card
              size="small"
              title={'Questions'}
              extra={
                <Button
                  className="dynamic-delete-button"
                  // danger={true}
                  size="small"
                  onClick={() => addQuestion()}
                  icon={<PlusOutlined />}
                  name='addQuestionButton'
                >
                  Add
                </Button>
              }
            >
              <div>
                {questionnaire.questions?.map((question, index) => (
                  <div
                    key={question.text}>
                    <Divider>
                      <Space>
                        Question {index + 1}
                        <Popconfirm
                          title={'Are you sure to delete?'}
                          onConfirm={() => removeQuestion(question)}
                          // onCancel={cancel}
                          okText="Yes"
                          cancelText="No"
                        >
                          <Button
                            className="dynamic-delete-button"
                            danger={true}
                            icon={<MinusCircleOutlined />}
                          >
                          </Button>
                        </Popconfirm>
                      </Space>
                    </Divider>
                    <CreateQuestion question={question} />
                  </div>
                ))}
                {questionnaire.questions?.length == 0 ? (
                  <Form.Item >
                    <Empty
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                      description="No Questions" />
                  </Form.Item>
                ) : null}
                {/* <Form.ErrorList errors={errors} /> */}
              </div>
            </Card>
          </>
        )
        }

      </Form.List>
      <Row>
        <Col span={24} style={{ textAlign: 'right' }}>
          <Button
            type="primary"
            htmlType="submit">
            Save
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default CreateQuestionnaire;
