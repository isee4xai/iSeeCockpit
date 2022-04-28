import './CheckboxInput.less';
import { useEffect, useState } from 'react';
import { Checkbox, Space, Input } from 'antd';
import { PlusSquareOutlined } from '@ant-design/icons';

const CheckboxInput: React.FC<{
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
      <Checkbox.Group value={undefined}>
        <Space direction="vertical" size={0}>
          {optionsList.map((option, idx) => (
            <div key={idx} className="container" drag-index={idx} style={{ padding: '4px 0' }}>
              <Checkbox className="checkbox-item" value={option} onClick={() => handleEdit(idx)}>
                {edit === idx ? (
                  <Input
                    defaultValue={option}
                    onBlur={(event) => handleEditComplete(idx, event.target.value)}
                    autoFocus
                  />
                ) : (
                  option
                )}
              </Checkbox>
            </div>
          ))}
        </Space>
      </Checkbox.Group>
      <div className="CheckboxForm-Add" onClick={handleAdd}>
        <PlusSquareOutlined style={{ color: '#BFBFBF', fontSize: 16 }} />
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

export default CheckboxInput;
