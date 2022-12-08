import { Radio, Space } from 'antd';
import React from 'react';
import { Response } from '@/models/questionnaire';
import './Chatbot.less';


const AnswerRadio = ({ listAnswer, onChange }) => {
  const [value, setValue] = React.useState<Response>();

  const isChanged = (e: any) => {
    setValue(e.target.value);
  };

  return (
    <div>
      <Radio.Group onChange={isChanged} value={value}>
        <Space size={10} direction="horizontal" wrap id="spaceRadio">
          {listAnswer.map((element: Response, idx: number) => (
            <Radio.Button
              onChange={onChange}
              value={element}
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
