import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { Button, Card, Input, Layout, message, Space } from 'antd';

import { EllipsisOutlined } from '@ant-design/icons';

import './DialogQuestionnaires.less';

import parse from 'html-react-parser';

import AnswerCheckbox from '@/components/iSee/chatbot/AnswerCheckbox';
import AnswerRadio from '@/components/iSee/chatbot/AnswerRadio';
import type { Interaction, Question } from '@/models/questionnaire';

import { api_create /* , api_get_all */ } from '@/services/isee/dialog';

const json: { questions: Question[] } = {
  questions: [
    /* {
      id: '120',
      content:
        '<div> <div>Would you like an explanation about your loan application being rejected? We can help you answer the following questions.</div> <ol> <li>Which entries in the loan application contributed to it being rejected?</li> <li>How to change the application to get a better outcome?</li> <li>How accurate is the system?</li></ol> </div>',
      responseType: 'Free-text',
      dimension: 'intent',
      "answer": [
        "Yes, I would like an explanation. Tell me how accurate this system is."
      ],
      required: true,
    },
    {
      id: '121',
      content:
        '<div>According to the information I have, the system is 81% accurate. That means, system makes a mistake approximately with 1 out of 5 applications.</div>',
      responseType: 'Free-text',
      dimension: 'satisfaction',
      "answer": [
        "Okay, that is concerning. Can I see which entries contributed to it being rejected."
      ],
      required: true,
    },
    {
      id: '122',
      content:
        "<div><div>Here is an explanation that shows the top contributing entries to your loan being rejected.</div> <div><a href='https://ibb.co/0tmQjw2'><img src='https://i.ibb.co/PQFtZSj/lime-explanation-1.png' alt='lime-explanation-1' border='0'></a></div></div>",
      responseType: 'Free-text',
      dimension: 'satisfaction',
      "answer": [
        "Ah I see...So it seems the problem is with my recoveries."
      ],
      required: true,
    },
    {
      id: '123',
      content:
        '<div>Would you like another explanation? I can show how to change the application to get a better outcome.</div>',
      responseType: 'Free-text',
      dimension: 'intent',
      "answer": [
        "yes please..."
      ],
      required: true,
    },
    {
      id: '124',
      content:
        '<div><p>Here are the minimum changes our algorithm recommends to get a better outcome.</p> <ul> <li>Increase principal received to date from 566.86 to 10000.00</li> </ul></div>',
      responseType: 'Free-text',
      dimension: 'satisfaction',
      "answer": [
        "Thanks. I will try that next time I apply."
      ],
      required: true,
    },
    {
      id: '125',
      content:
        '<div><div>Thank you for using iSee services to learn about your loan application outcome.</div><div>Would you like to take a survey about your experience?</div></div>',
      responseType: 'Free-text',
      dimension: 'satisfaction',
      "answer": [
        "Yes sure."
      ],
      required: true,
    },  */
    {
      id: '126',
      content:
        "<div><div>There are three questions in this survey. Please select the most appropriate answer to each statement.</div><div>First statement is 'The explanation helps me understand how the system works.'</div></div>",
      intent: 'Debugging',
      responseType: 'Radio',
      responseOptions: [
        {
          val: 'Yes',
        },
        {
          val: 'No',
        },
      ],
      dimension: 'goodness',
      /* "answer": [
        "I’m neutral about it"
      ], */
      required: true,
    },
    {
      id: '127',
      content: "<div>Second statement is 'Explanations have sufficient detail.'</div>",
      intent: 'Debugging',
      responseType: 'Likert',
      responseOptions: [
        {
          val: 'I agree strongly',
        },
        {
          val: 'I agree somewhat',
        },
        {
          val: 'I’m neutral about it',
        },
        {
          val: 'I disagree somewhat',
        },
        {
          val: 'I disagree strongly',
        },
      ],
      dimension: 'satisfaction',
      /* "answer": [
        "I disagree somewhat"
      ], */
      required: true,
    },
    {
      id: '128',
      content:
        "<div>Third statement is 'Explanations of the system showed me how accurate it is.'</div>",
      intent: 'Debugging',
      responseType: 'Likert',
      responseOptions: [
        {
          val: 'I agree strongly',
        },
        {
          val: 'I agree somewhat',
        },
        {
          val: 'I’m neutral about it',
        },
        {
          val: 'I disagree somewhat',
        },
        {
          val: 'I disagree strongly',
        },
      ],
      dimension: 'satisfaction',
      /* "answer": [
        "I agree somewhat"
      ], */
      required: true,
    },
    /* {
      id: '129',
      content: '<div><div>Thank you for taking the survey.</div><div>Have a nice day!</div></div>',
    }, */
  ],
};

const DialogQuestionnaires: React.FC = () => {
  const { Footer, Content } = Layout;
  const questions = useMemo(() => json.questions, []);
  const [type, setType] = useState<string>();
  const [text, setText] = useState('');
  const [stateRadio, setStateRadio] = useState('');
  const [stateCheckBox, setStateCheckBox] = useState<string[]>([]);

  const [dialogComp, setDialogComp] = useState<JSX.Element[]>([]);

  const [answer, setAnwser] = useState([<React.Fragment key={'no answer'} />]);
  const [question, setQuestion] = useState<Question>();
  const [index, setIndex] = useState<number>(0);
  const [disable, setDisable] = useState(false);

  const addQuestion = useCallback(function (currentQuestion) {
    setDialogComp((oldQuestionComp) => [
      ...oldQuestionComp,
      <div className="question" key={'question' + oldQuestionComp}>
        {parse(currentQuestion?.content ?? '') as JSX.Element}
      </div>,
    ]);
  }, []);

  const addTypeAnswerFooter = useCallback(
    function (currentQuestion) {
      setType(currentQuestion?.responseType || 'Free-Text');
      switch (currentQuestion?.responseType) {
        case 'Radio':
          setAnwser([
            <AnswerRadio
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStateRadio(e.target.value)}
              key={'answer' + index}
              listAnswer={currentQuestion.responseOptions}
            />,
          ]);
          break;
        case 'Checkbox':
          setAnwser([
            <AnswerCheckbox
              onChange={(checkedValue) => setStateCheckBox(checkedValue)}
              key={'answer' + index}
              listAnswer={currentQuestion.responseOptions}
            />,
          ]);
          break;
        case 'Likert':
          setAnwser([
            <AnswerRadio
              key={'answer' + index}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStateRadio(e.target.value)}
              listAnswer={currentQuestion.responseOptions}
            />,
          ]);
          break;
        default:
          setAnwser([<React.Fragment key={'no data'} />]);
          break;
      }
    },
    [index],
  );

  function updateJson(myAnswer: string | string[]) {
    if (typeof myAnswer == 'string') {
      json.questions[index - 1].answer = [myAnswer];
    } else {
      json.questions[index - 1].answer = myAnswer;
    }
    console.log(json.questions);
  }

  function addAnswer() {
    switch (type) {
      case 'Radio':
        setDialogComp((oldDialogComp) => [
          ...oldDialogComp,
          <div className="answer" key={'answer' + oldDialogComp.length}>
            <p>{stateRadio}</p>
          </div>,
        ]);
        updateJson(stateRadio);
        break;
      case 'Checkbox':
        setDialogComp((oldDialogComp) => [
          ...oldDialogComp,
          <div className="answer" key={'answer' + oldDialogComp.length}>
            <p>{stateCheckBox.join(', ')}</p>
          </div>,
        ]);

        updateJson(stateCheckBox);
        break;
      case 'Likert':
        setDialogComp((oldDialogComp) => [
          ...oldDialogComp,
          <div className="answer" key={'answer' + oldDialogComp.length}>
            <p>{stateRadio}</p>
          </div>,
        ]);
        updateJson(stateRadio);
        break;
      default:
        setDialogComp((oldDialogComp) => [
          ...oldDialogComp,
          <div className="answer" key={'answer' + oldDialogComp.length}>
            <p>{text}</p>
          </div>,
        ]);
        updateJson(text);
        break;
    }
  }

  function promiseQuestion() {
    setDisable(true);
    setDialogComp((oldDialogComp) => [
      ...oldDialogComp,
      <EllipsisOutlined id="attenteQuestion" key="test" />,
    ]);
    return new Promise<void>((resolve) => {
      setTimeout(function () {
        setDialogComp((old) => {
          const oldArray = old.slice();
          oldArray.pop();
          return oldArray;
        });
        resolve();
      }, 1000);
    });
  }

  function sendAnswer() {
    let lengthDialog = dialogComp.length;
    let indexMethod = 0;
    while (questions[indexMethod].responseType == undefined) {
      lengthDialog -= 1;
      indexMethod += 1;
    }
    if (lengthDialog % 2) addAnswer();
    setIndex(index + 1);

    promiseQuestion().then(() => {
      if (questions.length !== index) {
        setQuestion(questions[index]);
      }
      if (questions.length == index && !(lengthDialog % 2)) {
        setType('Radio');
      }

      setText('');
      setStateRadio('');
      setDisable(false);
    });
  }

  function send() {
    console.log(index, questions.length);

    if (inputNotNUll() && checkboxNotNull() && radioNotNull()) {
      sendAnswer();
    }

    console.log(index, questions.length);

    if (questions.length == index) {
      const jsonFin: Interaction = {
        name: 'interaction',
        personaId: '62a9f7e9982c944296bdec40',
        usecaseId: '62a9f6d0982c944296bdec3b',
        dimension: 'satisfaction',
        questions: json.questions,
      };

      api_create(jsonFin)
        .then(() => {
          message.success('Succesfully Added questionnaire');
        })
        .catch((errorDB) => {
          message.error(errorDB.message);
        });
    }
  }

  function inputNotNUll() {
    return text != '' || (type != 'Free-Text' && type != 'Number');
  }

  function checkboxNotNull() {
    return stateCheckBox.length != 0 || type != 'Checkbox';
  }

  function radioNotNull() {
    return stateRadio != '' || (type != 'Likert' && type != 'Radio');
  }

  function skip() {
    let lengthDialog = dialogComp.length;
    let indexMethod = 0;
    while (questions[indexMethod].responseType == undefined) {
      lengthDialog -= 1;
      indexMethod += 1;
    }
    if (!question?.required) {
      if (lengthDialog % 2) {
        setDialogComp((oldDialogComp) => [
          ...oldDialogComp,
          <div className="answer" key={'answer' + oldDialogComp.length}>
            <p>SKIP</p>
          </div>,
        ]);
      }
      setIndex(index + 1);
      promiseQuestion().then(() => {
        if (questions.length !== index) {
          setQuestion(questions[index]);
        }
        if (questions.length == index && !(lengthDialog % 2)) {
          setDisable(true);
          setType('Radio');
        }

        setText('');
        setStateRadio('');
        setDisable(false);
      });
    }
  }

  useEffect(() => {
    setQuestion(questions[index]);
    setIndex(index + 1);
  }, []);

  useEffect(() => {
    if (!question || !index) return;
    addQuestion(question);
    addTypeAnswerFooter(question);
    if (question.responseType == undefined) {
      setIndex(index + 1);

      setQuestion(questions[index]);
      send();
    }
    // document.querySelector("#content-card")?.scrollBy(0, (document.querySelector("#content-card")?.scrollHeight || 0) * 2)
  }, [question]);

  return (
    <>
      <Card
        title="iSee ChatBot"
        extra={<a onClick={() => window.location.reload()}>Restart</a>}
        id="card"
      >
        <Layout id="layout">
          <Content id="content-card">{[...dialogComp.slice().reverse()]}</Content>
          <Footer id="footer">
            <Space align="center" direction="vertical">
              {answer}
              <Space direction="horizontal">
                <Input
                  type={type === 'Number' ? 'number' : 'text'}
                  placeholder={
                    type === 'Number'
                      ? 'Answer :   min :' +
                        question?.validators?.min +
                        ' max : ' +
                        question?.validators?.max
                      : 'Answer'
                  }
                  value={
                    // delete the number if it's not between validators min/max
                    type === 'Number' && question?.validators
                      ? parseInt(text) >= question?.validators?.min &&
                        parseInt(text) <= question?.validators?.max
                        ? text
                        : parseInt('')
                      : text
                  }
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setText(e.target.value)}
                  disabled={
                    questions.length < index ||
                    disable ||
                    type === 'Likert' ||
                    type === 'Radio' ||
                    type === 'Checkbox'
                  }
                  id="input"
                />
                <Button
                  type="primary"
                  onClick={send}
                  disabled={
                    questions.length < index ||
                    disable ||
                    (text == '' && (type == 'Free-text' || type == 'Number')) ||
                    (stateCheckBox == [] && type == 'Checkbox') ||
                    (stateRadio == '' && (type == 'Radio' || type == 'Likert'))
                  }
                >
                  Send
                </Button>
                <Button
                  onClick={skip}
                  type="default"
                  disabled={questions.length < index || disable || question?.required}
                >
                  Skip
                </Button>
              </Space>
            </Space>
          </Footer>
        </Layout>
      </Card>
    </>
  );
};

export default DialogQuestionnaires;
