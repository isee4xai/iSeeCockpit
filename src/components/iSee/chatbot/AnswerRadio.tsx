import { Radio, Space } from 'antd';
import React, { useEffect } from 'react';

import { Response } from '@/models/questionnaire';
import './Chatbot.less';
import DATA_FILEDS from '@/models/common';

const AnswerRadio = ({ listAnswer, onChange, disabled, selected }) => {
  const [value, setValue] = React.useState<Response>();
  const colours = {
    "Debugging": '#edf2f4',
    "Transparency": '#ffe5d9',
    "Performance": '#edf6f9',
    "Comprehensibility": '#cbc0d3',
    "Effectiveness": '#f8edeb',
    "Actionability": '#e8e8e4',
    "Compliancy": '#eddcd2',
  };
  const isChanged = (e: any) => {
    setValue(e.target.value);
  };

  function getbackcolour(t: string) {
    let col = '#ffffff';
    DATA_FILEDS.INTENT_QUESTIONS.forEach(function (intent) {
      intent.questions.forEach(function (question) {
        if (question.text == t) {
          col = colours[intent.label];
          return true;
        }
      });
    });
    return col;
  }

  useEffect(() => {
    if (selected) {
      setValue(selected);
    }
  }, []);



  return (
    <div>
      <Radio.Group onChange={!disabled ? isChanged : undefined} value={value}>
        <Space size={10} direction="horizontal" wrap id="spaceRadio">
          {listAnswer.map((element: Response, idx: number) => (
            <Radio.Button
              onChange={!disabled ? onChange : undefined}
              value={element}
              // disabled={disabled}
              key={'radio' + idx}
              className="radioButton"
              style={element.id?.indexOf("UserQuestion") != -1 ? { border: 0, backgroundColor: getbackcolour(element.content ? element.content : '') } : { border: 0, backgroundColor: '#ffffff' }}
            >
              <div dangerouslySetInnerHTML={{ __html: element.content ?? '' }} />
            </Radio.Button>
          ))}
        </Space>
      </Radio.Group>
    </div>
  );
};

export default AnswerRadio;
