import { w3cwebsocket as W3CWebSocket } from "websocket";

import React, { useCallback, useEffect, useState } from 'react';

import { Avatar, Button, Input, Layout, PageHeader, Space } from 'antd';

import { EllipsisOutlined, ReloadOutlined, SendOutlined } from '@ant-design/icons';

import { WS_URL } from '@/services/isee/api.config';

import './DialogQuestionnaires.less';

import parse from 'html-react-parser';

import AnswerCheckbox from '@/components/iSee/chatbot/AnswerCheckbox';
import AnswerFileImage from '@/components/iSee/chatbot/AnswerFileImage';
import AnswerFileCSV from '@/components/iSee/chatbot/AnswerFileCSV';
import AnswerRadio from '@/components/iSee/chatbot/AnswerRadio';
import { Question, Response, ResponseType } from '@/models/questionnaire';
import { currentUser } from '@/services/isee/user';
import { response } from "express";
import Papa from "papaparse";

export type Params = {
  match: {
    params: {
      id: string;
    };
  };
};

const DialogQuestionnaires: React.FC<Params> = (props) => {
  const { Footer, Content } = Layout;
  const [responseType, setResponseType] = useState(ResponseType.OPEN);

  const [dialogComp, setDialogComp] = useState<JSX.Element[]>([]);
  const [text, setText] = useState('');
  const [radio, setRadio] = useState<Response>();
  const [check, setCheck] = useState<Response[]>([]);
  const [likert, setLikert] = useState<Response>();
  const [file, setFile] = useState<Response>();
  const [answer, setAnswer] = useState([<React.Fragment key={'no answer'} />]);
  const [question, setQuestion] = useState<Question>();

  const [client, setClient] = useState('');
  const [user, setUser] = useState({});
  const [promise, setPromise] = useState(false);

  const usecaseId = props.match.params.id;

  useEffect(() => {
    (async () => {
      const current_user = await currentUser();
      setUser(current_user);
      setClient(new W3CWebSocket(WS_URL + current_user.data["_id"]))
    })();
  }, []);

  useEffect(() => {
    if (client) {
      client.onopen = () => {
        // on connecting
        client.send(JSON.stringify({ user: user.data, usecase_id: usecaseId }));
        console.log('connected')
      }

      client.onmessage = (evt: any) => {
        // on receiving a message
        setPromise(false);
        // promiseQuestion().then(() => {
        setQuestion(JSON.parse(evt.data));
        // });
      }

      client.onclose = () => {
        // on disconnecting
        console.log('disconnected');
      }
    }

  }, [client]);


  const addQuestion = useCallback(function (currentQuestion) {
    setDialogComp((oldQuestionComp) => [
      ...oldQuestionComp,
      <>
        <div style={{ display: 'inline-block' }}>
          <Avatar size={44} shape="circle" src="/isee_icon_wide.png" className="question-avatar" />
          <div className="question" key={'question' + oldQuestionComp}>
            {parse(currentQuestion?.content ?? '') as JSX.Element}
          </div>
        </div>
      </>,
    ]);
  }, []);

  function handleRadioChange(event: any) {
    setRadio(event.target.value);
  }

  function handleFileImageChange(e: any) {
    let reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = function () {
      setFile(createFileImageAnswer(reader.result));
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
  }

  function handleFileCSVChange(e: any) {
    console.log(e.target.files[0]);
    Papa.parse(e.target.files[0], {
      complete: function (results) {
        console.log("Finished:", results.data);
        setFile(createFileCSVAnswer(results.data));
      }
    });
    // let reader = new FileReader();
    // reader.readAsText(e.target.files[0]);
    // reader.onload = function () {
    //   setFile(createFileCSVAnswer(reader.result));
    // };
    // reader.onerror = function (error) {
    //   console.log('Error: ', error);
    // };
  }

  function handleLikertChange(event: any) {
    setLikert(event.target.value);
  }

  const addResponses = useCallback(
    function (currentQuestion) {
      setResponseType(currentQuestion?.responseType ?? ResponseType.OPEN);
      switch (currentQuestion?.responseType) {
        case ResponseType.RADIO:
          setAnswer([
            <AnswerRadio
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleRadioChange(e)}
              key={'answer'}
              listAnswer={currentQuestion.responseOptions}
            />,
          ]);
          break;
        case ResponseType.CHECK:
          setAnswer([
            <AnswerCheckbox
              onChange={(checkedValue) => setCheck(checkedValue)}
              key={'answer'}
              listAnswer={currentQuestion.responseOptions}
            />,
          ]);
          break;
        case ResponseType.LIKERT:
          setAnswer([
            <AnswerRadio
              key={'answer'}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleLikertChange(e)}
              listAnswer={currentQuestion.responseOptions}
            />,
          ]);
          break;
        case ResponseType.FILE_IMAGE:
          setAnswer([
            <AnswerFileImage
              key={'answer'}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFileImageChange(e)}
            />,
          ]);
          break;
        case ResponseType.FILE_CSV:
          setAnswer([
            <AnswerFileCSV
              key={'answer'}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFileCSVChange(e)}
            />,
          ]);
          break;
        default:
          setAnswer([<React.Fragment key={'no data'} />]);
          break;
      }
    },
    [],
  );

  function sendAnswer() {
    if (responseType == ResponseType.OPEN) {
      client.send(JSON.stringify(createOpenAnswer()));
    }
    else if (responseType == ResponseType.NUMBER) {
      client.send(JSON.stringify(createNumberAnswer()));
    }
    else if (responseType == ResponseType.LIKERT) {
      client.send(JSON.stringify(likert));
    }
    else if (responseType == ResponseType.CHECK) {
      client.send(JSON.stringify(check));
    }
    else if (responseType == ResponseType.RADIO) {
      client.send(JSON.stringify(radio));
    }
    else if (responseType == ResponseType.FILE_IMAGE) {
      client.send(JSON.stringify(file));
    }
    else if (responseType == ResponseType.FILE_CSV) {
      client.send(JSON.stringify(file));
    }
    addAnswer();
    clearAnswer();
    setPromise(true);
  }

  function clearAnswer() {
    if (responseType == ResponseType.OPEN || responseType == ResponseType.NUMBER) {
      setText('');
    }
    else if (responseType == ResponseType.LIKERT) {
      setLikert(undefined);
    }
    else if (responseType == ResponseType.CHECK) {
      setCheck([]);
    }
    else if (responseType == ResponseType.RADIO) {
      setRadio(undefined);
    }
    else if (responseType == ResponseType.FILE_IMAGE) {
      setFile(undefined);
    }
    else if (responseType == ResponseType.FILE_CSV) {
      setFile(undefined);
    }
  }

  function addAnswer() {
    switch (responseType) {
      case ResponseType.RADIO:
        setDialogComp((oldDialogComp) => [
          ...oldDialogComp,
          <div className="answer-check" key={'answer' + oldDialogComp.length}>
            <div dangerouslySetInnerHTML={{ __html: radio?.content ?? '' }} />
          </div>,
        ]);
        break;
      case ResponseType.FILE_IMAGE:
        setDialogComp((oldDialogComp) => [
          ...oldDialogComp,
          <div className="answer-image" key={'answer' + oldDialogComp.length}>
            <div dangerouslySetInnerHTML={{ __html: generateImageFromBase64(file?.content ?? '') }} />
          </div>,
        ]);
        break;
      case ResponseType.FILE_CSV:
        setDialogComp((oldDialogComp) => [
          ...oldDialogComp,
          <div className="answer-csv" key={'answer' + oldDialogComp.length}>
            <div dangerouslySetInnerHTML={{ __html: generateTableFromJSON(file?.content ?? '') }} />
          </div>,
        ]);
        break;
      case ResponseType.CHECK:
        setDialogComp((oldDialogComp) => [
          ...oldDialogComp,
          <div className="answer" key={'answer' + oldDialogComp.length}>
            <p>{check.map(i => i.content).join(', ')}</p>
          </div>,
        ]);
        break;
      case ResponseType.LIKERT:
        setDialogComp((oldDialogComp) => [
          ...oldDialogComp,
          <div className="answer" key={'answer' + oldDialogComp.length}>
            <p>{likert?.content}</p>
          </div>,
        ]);
        break;
      default:
        setDialogComp((oldDialogComp) => [
          ...oldDialogComp,
          <div className="answer" key={'answer' + oldDialogComp.length}>
            <p>{text}</p>
          </div>,
        ]);
        break;
    }
  }

  function generateImageFromBase64(data: any) {
    let content = "<div><img width=\"400\" src=\"";
    content += data;
    content += "\"/></div>";
    return content;
  }

  function generateTableFromJSON(data: any) {
    let table = '<div class=\"target-prediction\"><table border="1" class="dataframe">';
    table += '<thead>';
    table += '<tr>';
    for (const key in data) {
      table += `<th>${key}</th>`;
    }
    table += '</tr>';
    table += '</thead>';

    // create data rows
    table += '<tbody>';
    table += '<tr>';
    for (const key in data) {
      table += `<th>${data[key]}</th>`;
    }
    table += '</tr>';
    table += '</tbody>';

    table += '</table></div>';
    return table;

  }

  function sendAndReceive() {
    if (textInputNotNUll() || checkInputNotNull() || radioInputNotNull() || likertInputNotNull() || fileInputNotNUll()) {
      sendAnswer();
    }
  }

  function textInputNotNUll() {
    return text != '' && (responseType == ResponseType.OPEN || responseType == ResponseType.NUMBER);
  }

  function fileInputNotNUll() {
    return file && (responseType == ResponseType.FILE_IMAGE || responseType == ResponseType.FILE_CSV);
  }

  function checkInputNotNull() {
    return check && check.length > 0 && responseType == ResponseType.CHECK;
  }

  function radioInputNotNull() {
    return radio && responseType === ResponseType.RADIO;
  }

  function likertInputNotNull() {
    return likert && responseType == ResponseType.LIKERT;
  }

  function createOpenAnswer() {
    var temp = {
      id: "temp",
      content: text
    };
    return temp;
  }

  function createNumberAnswer() {
    var temp = {
      id: "temp",
      content: text
    };
    return temp;
  }

  function createFileImageAnswer(_base64: string) {
    var temp = {
      id: "temp",
      content: _base64
    };
    return temp;
  }

  function createFileCSVAnswer(data: any) {
    const ks = data[0];
    const vs = data[1].map((val: any) => isNaN(val) ? val.replaceAll("\"", "").trim() : Number(val));;
    const dict = {};
    for (let i = 0; i < ks.length; i++) {
      dict[ks[i]] = vs[i];
    }
    var temp = {
      id: "temp",
      content: dict
    };
    return temp;
  }

  useEffect(() => {
    if (!question) return;

    addQuestion(question);
    addResponses(question);
  }, [question]);

  useEffect(() => {
    if (promise) {
      setDialogComp((oldDialogComp) => [
        ...oldDialogComp,
        <EllipsisOutlined id="attenteQuestion" key="test" />,
      ]);
    }
    else {
      setDialogComp((old) => {
        const oldArray = old.slice();
        oldArray.pop();
        return oldArray;
      });
    }
  }, [promise]);


  return (
    <>
      {/* <PageContainer title="" > */}


      {/* <Card
          title="iSee Dialog Manager"
          extra={<a onClick={() => window.location.reload()}>Restart</a>}
          id="card"
        > */}
      <Layout id="layout">
        <PageHeader
          ghost={false}
          key="head1"
          style={{ borderRadius: '10px 10px 0 0' }}
          title="iSee Evaluation Tool"
          extra={[
            <Button shape="round" key={'create-btn'} type="primary" onClick={() => window.location.reload()} style={{ width: '100%' }}>
              <ReloadOutlined /> Restart
            </Button>,
          ]}
        />
        <Content id="content-card">{[...dialogComp.slice().reverse()]}</Content>
        <Footer id="footer" style={{ borderRadius: '0 0 10px 10px' }}>
          {/* <Space align="center" direction="vertical"> */}

          <Space direction="horizontal">
            {answer}
            <Input
              size="large"
              style={{ borderRadius: '10px' }}
              type={(responseType !== ResponseType.NUMBER && responseType !== ResponseType.OPEN) ? 'hidden' : responseType === ResponseType.NUMBER ? 'number' : 'text'}
              placeholder={
                responseType === ResponseType.NUMBER
                  ? 'Response :   min :' +
                  question?.validators?.min +
                  ' max : ' +
                  question?.validators?.max
                  : 'Response'
              }
              value={
                // delete the number if it's not between validators min/max
                responseType === ResponseType.NUMBER && question?.validators && answer
                  ? parseInt(answer[0]?.content) >= question?.validators?.min &&
                    parseInt(answer[0]?.content) <= question?.validators?.max
                    ? answer[0]?.content
                    : parseInt('')
                  : answer[0]?.content
              }
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setText(e.target.value)}
              disabled={
                responseType === ResponseType.RADIO ||
                responseType === ResponseType.CHECK ||
                responseType === ResponseType.LIKERT ||
                responseType === ResponseType.INFO
              }
              id="input"
            />
            <Button
              type={responseType == ResponseType.INFO ? 'ghost' : 'primary'}
              shape="round"
              size="large"
              onClick={sendAndReceive}
              disabled={
                (text == '' && (responseType == ResponseType.OPEN || responseType == ResponseType.NUMBER)) ||
                (!check && responseType == ResponseType.CHECK) ||
                (!radio && responseType == ResponseType.RADIO) ||
                (!likert && responseType == ResponseType.LIKERT) ||
                responseType == ResponseType.INFO
              }
            >
              Send
              <SendOutlined />
            </Button>
          </Space>
          {/* </Space> */}
        </Footer >
      </Layout>
      {/* </Card> */}
      {/* </PageContainer> */}
    </>
  );
};

export default DialogQuestionnaires;