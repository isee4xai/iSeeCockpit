import './RadioInput.less';
import { useEffect, useState } from 'react';
import { Radio, Space, Input } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';

const RadioInput: React.FC<{
  options?: string[];
  onChange: (options: string[]) => void;
}> = ({ options = [], onChange }) => {
  const [add, setAdd] = useState<boolean>(false);
  const [edit, setEdit] = useState<number>(-1);

  const [optionsList, setOptionList] = useState(options || []);

  const handleAdd = () => setAdd(true);
  const handleEdit = (idx: number) => setEdit(idx);

  const handleAddComplete = (value: string) => {
    setAdd(false);
    if (value.trim() === '') return;
    setOptionList([...optionsList, value]);
  };

  const handleEditComplete = (idx: number, value: string) => {
    const oldState = optionsList.slice();
    oldState[idx] = value;

    setOptionList(oldState);
    setEdit(-1);
  };

  useEffect(() => {
    onChange(optionsList);
  }, [onChange, optionsList]);

  return (
    <>
      <Radio.Group value={null}>
        <Space direction="vertical" size={0}>
          {optionsList.map((option, idx) => (
            <Radio key={idx} className="radio-item" value={option} onClick={() => handleEdit(idx)}>
              {edit === idx ? (
                <Input
                  defaultValue={option}
                  onBlur={(event) => handleEditComplete(idx, event.target.value)}
                  autoFocus
                />
              ) : (
                option
              )}
            </Radio>
          ))}
        </Space>
      </Radio.Group>
      <div className="RadioForm-Add" onClick={handleAdd}>
        <PlusCircleOutlined style={{ color: '#BFBFBF', fontSize: 16 }} />
        {add ? (
          <Input
            autoFocus
            onBlur={(e) => handleAddComplete(e.target.value)}
            style={{ width: 'max-content' }}
          />
        ) : (
          'Add an option'
        )}
      </div>
    </>
  );
};

export default RadioInput;
