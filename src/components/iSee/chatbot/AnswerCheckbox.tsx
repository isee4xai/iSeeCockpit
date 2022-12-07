import { Response } from '@/models/questionnaire';
import { Checkbox } from 'antd';
import React from 'react';

const AnswerCheckbox: React.FC<{
  listAnswer: Response[];
  onChange: (options: any) => void;
}> = ({ listAnswer, onChange }) => {
  return (
    <Checkbox.Group onChange={onChange}>
      {listAnswer.map((element: Response, idx: number) => (
        <Checkbox value={element} key={idx}>
          {element.content}
        </Checkbox>
      ))}
    </Checkbox.Group>
  );
};

export default AnswerCheckbox;
