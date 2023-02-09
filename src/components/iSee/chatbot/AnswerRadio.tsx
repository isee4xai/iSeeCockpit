import { Radio, Space } from 'antd';
import React, { useEffect } from 'react';

import { Response } from '@/models/questionnaire';
import './Chatbot.less';


const AnswerRadio = ({ listAnswer, onChange, disabled, selected }) => {
  const [value, setValue] = React.useState<Response>();

  const isChanged = (e: any) => {
    setValue(e.target.value);
  };

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
              style={{ border: 0 }}
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
