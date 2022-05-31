import { PageContainer } from '@ant-design/pro-layout';
import QuestionnaireEditor from '@/components/iSee/question/toolkit/QuestionnaireEditor';
import { Modal, Button, Alert, notification } from 'antd';
import { CopyOutlined, ExportOutlined } from '@ant-design/icons';
import { useState, useCallback } from 'react';

// import { api_test } from '@/services/isee/database';

import type { Question } from '@/models/questionnaire';

const CreateQuestionnaires: React.FC = () => {
  const [modal, setModal] = useState({ visibility: false, type: 'export' });
  const [questions, setQuestions] = useState<Question[]>([]);

  // api_test()

  const handleExportButton = () => {
    setModal({ visibility: true, type: 'export' });
  };

  const addToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify({ questions }, null, 4)).then(
      () => {
        notification.success({
          message: `Success`,
          duration: 3,
          description: 'The questionnaire json has been added to the clipboard',
          placement: 'bottomRight',
        });
      },
      () => {
        notification.error({
          message: `Error`,
          duration: 3,
          description: 'An error occured, the json was not added to the clipboard',
          placement: 'bottomRight',
        });
      },
    );
  };

  const handleCloseModal = () => {
    setModal({ ...modal, visibility: false });
  };

  const handleQuestionChange = useCallback(
    (newQuestions: Question[]) => {
      setQuestions(() => newQuestions);
    },
    [setQuestions],
  );

  const handleOk = () => {
    setModal({ ...modal, visibility: false });
  };

  const isQuestionValid = (question: Question) => {
    if (!question.id || !question.content || !question.responseType || !question.responseType)
      return false;
    if (question.content.trim() === '') return false;

    if (['Likert', 'Radio', 'Checkbox'].includes(question.responseType)) {
      if (!question.responseOptions || question.responseOptions.length === 0) return false;
    }

    return true;
  };
  const isQuestionnaireValid = () => questions.every((question) => isQuestionValid(question));

  return (
    <PageContainer>
      <QuestionnaireEditor onChange={handleQuestionChange} />
      <Modal
        title={modal.type === 'export' ? 'Export' : 'Import'}
        visible={modal.visibility}
        onOk={handleOk}
        onCancel={handleCloseModal}
        footer={
          <>
            {modal.type === 'export' && (
              <Button onClick={addToClipboard} icon={<CopyOutlined />}>
                Copy to clipboard
              </Button>
            )}
            <Button type="primary" onClick={handleOk}>
              {modal.type === 'export' ? 'Close' : 'Import'}
            </Button>
          </>
        }
      >
        {modal.type === 'export' && !isQuestionnaireValid() && (
          <Alert
            message="Your form isn't valid, you may want to fill all fields before exporting it!"
            type="warning"
            showIcon
            className="alert-export"
          />
        )}
        <pre>
          <code onClick={(e) => console.dir(e.target)}>
            {JSON.stringify({ questions }, null, 2)}
          </code>
        </pre>
      </Modal>
      <Button
        className="generate-json"
        onClick={handleExportButton}
        type="primary"
        icon={<ExportOutlined />}
      >
        Generate Json
      </Button>
    </PageContainer>
  );
};

export default CreateQuestionnaires;
