import { Radio, Space } from 'antd';
import React from 'react';

const AnswerRadio = ({ listAnswer, onChange }) => {
  const [value, setValue] = React.useState();

  const isChanged = (e) => {
    setValue(e.target.value);
  };

  return (
    <div>
      <Radio.Group onChange={isChanged} value={value}>
        <Space size={20} direction="horizontal" wrap id="spaceRadio">
          {listAnswer.map((element: any, idx: number) => (
            <Radio.Button
              onChange={onChange}
              value={element.val}
              key={'radio' + idx}
              className="radioButton"
            >
              {element.val}
            </Radio.Button>
          ))}
        </Space>
      </Radio.Group>
    </div>
  );
};

export default AnswerRadio;
