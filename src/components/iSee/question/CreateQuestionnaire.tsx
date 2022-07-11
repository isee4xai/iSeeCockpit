import React, { useState, useCallback, Suspense } from 'react';
import { Form, Input, Select, Button, Empty, Card, message } from 'antd';
import type { Questionnaire } from '@/models/questionnaire';
import DATA_FILEDS from '@/models/common';
const { Option } = Select;
import { v4 as uuidv4 } from 'uuid';
import { api_update } from '@/services/isee/questionnaires';

import { PlusOutlined } from '@ant-design/icons';

const QuestionnaireEditor = React.lazy(
  () => import('@/components/iSee/question/toolkit/QuestionnaireEditor'),
);

const CreateQuestionnaire: React.FC<{ questionnaire: Questionnaire }> = (props) => {
  const [questions, setQuestions] = useState(props.questionnaire.questions || []);
  const [form, setForm] = useState(props.questionnaire);
  const [questionnaire] = useState(form);

  const [formAntd] = Form.useForm();

  const handleQuestionnaireChange = useCallback(
    (updatedQuestions) => {
      setQuestions(updatedQuestions);
    },
    [setQuestions],
  );

  const handleFormChange = (values: any) => {
    setForm({ ...form, ...values });
  };

  const handleSubmit = (values: Questionnaire) => {
    api_update({ ...values, questions, _id: questionnaire._id })
      .then(() => {
        message.success('Questionnaire saved');
      })
      .catch((error) => {
        message.error(error.message);
      });
  };

  const addQuestion = () => {
    const blank_obj = {
      id: 'q-' + uuidv4(),
      responseOptions: [{ val: 'Option 1' }, { val: 'Option 2' }],
    };
    setQuestions([blank_obj, ...questions]);
  };

  return (
    <>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        onValuesChange={handleFormChange}
        wrapperCol={{ span: 16 }}
        initialValues={questionnaire}
        onFinish={handleSubmit}
        form={formAntd}
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
          name="dimension"
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
      </Form>
      <Card
        size="small"
        title={'Questions'}
      // extra={
      //   <Button
      //     size="small"
      //     type="primary"
      //     onClick={addQuestion}
      //     icon={<PlusOutlined />}
      //     name="addQuestionButton"
      //   >
      //     Add
      //   </Button>
      // }
      >
        {questions.length > 0 ? (
          <Suspense fallback={<div>Loading...</div>}>
            <QuestionnaireEditor
              noAdd
              noImport
              defaultQuestions={questions}
              onChange={handleQuestionnaireChange}
              noCategory
            />
          </Suspense>
        ) : (
          <Empty description={'Please add a question!'} />
        )}
      </Card>
      {/* <Button
        type="primary"
        size="large"
        onClick={() => formAntd.submit()}
        style={{ display: 'block', width: '25rem', maxWidth: '50%', margin: '2rem auto 0' }}
      >
        Update
      </Button> */}
    </>
  );
};

export default CreateQuestionnaire;
