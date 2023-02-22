/* eslint-disable react/no-array-index-key */
import QuestionnaireEditor from '@/components/iSee/question/toolkit/QuestionnaireEditor';
import type { Persona } from '@/models/persona';
import type { Question, Questionnaire } from '@/models/questionnaire';
import { api_persona_update_intent } from '@/services/isee/usecases';
import {
  SaveOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  notification,
  Row,
  Space,
} from 'antd';
import React, { useCallback, useState } from 'react';

import './QuestionnaireTab.less';

export type PersonaType = {
  evaluation: Questionnaire;
  updateIntentEvaluation?: any;
  persona: Persona;
  usecaseId: string;
  intent_cat: string;
};


const QuestionnaireTab: React.FC<PersonaType> = ({
  evaluation,
  updateIntentEvaluation,
  persona,
  usecaseId,
  intent_cat,
}) => {
  const [questions, setQuestions] = useState(evaluation.questions || []);
  // New Load Quesionts Popu Functions
  const [isChangedQuestion, setIsChangedQuestion] = useState(false);

  // Callback fix for issue with multiple options
  const handleQuestionChange = useCallback(
    (newQuestions: Question[]) => {
      setIsChangedQuestion(true);
      setQuestions(() => newQuestions);
    },
    [setQuestions],
  );

  const isQuestionValid = (question: Question) => {
    const error: string[] = [];

    if (!question.content || question.content.trim() === '') {
      error.push('Question Text is required');
    }

    if (
      !['Free-Text', 'Radio', 'Checkbox', 'Number', 'Likert'].includes(question.responseType ?? '')
    ) {
      error.push('Metric is required');
    } else if (['Likert', 'Radio', 'Checkbox'].includes(question.responseType ?? '')) {
      if (!question.responseOptions || question.responseOptions.length === 0) {
        error.push('Metric Values are required for type ' + question.responseType + ' questions');
      } else if (!question.responseOptions || question.responseOptions.length === 1) {
        error.push('There should be multiple options');
      }
    } else if (question.responseType === 'Number') {
      if (question?.validators?.max !== undefined && question?.validators?.min !== undefined) {
        if (question.validators?.max < question.validators?.min) {
          error.push('Max should be greater than Min');
        }
      }
    }
    if (!question.dimension || question.dimension.trim() == '') {
      error.push('A category is required');
    }

    return error;
  };

  async function saveQuestionnaire() {
    console.log('%c Saving.... ', 'font-size: 20px; color: orange;');
    const errors = questions.map((q) => isQuestionValid(q) as string[]);
    setIsChangedQuestion(false);

    if (errors.reduce((prev, curr) => [...prev, ...curr], []).length === 0) {
      console.log('%c Valid ! ', 'font-size: 20px; color: green;');
      const intent = persona.intents?.find((i) => i.name === intent_cat);
      if (intent) {
        await api_persona_update_intent(usecaseId, persona._id, intent.id, {
          ...intent,
          evaluation: { questions },
        });
      }

      updateIntentEvaluation(intent, questions);

      notification.success({
        message: 'Saved Evaluation Questionnaire',
        placement: 'top',
        duration: 3,
      });
    } else {
      notification.error({
        message: `Invalid Questionnaire`,
        description: (
          <div>
            <p>Please fix the following errors before saving:</p>
            {errors.map(
              (e, i) =>
                e.length > 0 && (
                  <React.Fragment key={i}>
                    <b> Questions {i + 1}</b>
                    <br />
                    {e.map((err, j) => (
                      <React.Fragment key={j}>
                        <span style={{ marginLeft: '1rem' }}>{err}</span>
                        <br />
                      </React.Fragment>
                    ))}
                    <br />
                  </React.Fragment>
                ),
            )}
          </div>
        ),
        placement: 'top',
        duration: Math.min(3, errors.length * 2),
      });
      console.table(errors);
    }
  }

  return (
    <Row gutter={24}>
      <Col span={24}>
        <Card
          size="small"
          title={'Evaluation Questions'}
          extra={
            <div>
              <Button
                type="primary"
                disabled={!isChangedQuestion}
                onClick={saveQuestionnaire}
                icon={<SaveOutlined />}
                name="addQuestionButton"
              >
                Save Questionnaire
              </Button>
            </div>
          }
        >
          <QuestionnaireEditor
            noImport
            noAdd
            defaultQuestions={questions}
            onChange={handleQuestionChange}
          />
          {questions.length > 0 ? (
            <Row>
              <Col span={8} offset={10}>
                <Space>
                  <Button
                    type="primary"
                    disabled={!isChangedQuestion}
                    onClick={saveQuestionnaire}
                    icon={<SaveOutlined />}
                    name="addQuestionButton"
                  >
                    Save Questionnaire
                  </Button>
                </Space>
              </Col>
            </Row>
          ) : (
            <></>
          )
          }

        </Card>
      </Col>

    </Row>
  );
};

export default QuestionnaireTab;
