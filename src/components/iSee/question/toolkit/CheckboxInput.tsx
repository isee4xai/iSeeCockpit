import './CheckboxInput.less';
import { useEffect, useState } from 'react';
import { Checkbox, Space, Input } from 'antd';
import { PlusSquareOutlined, HolderOutlined } from '@ant-design/icons';
import Draggable from 'react-draggable';
import useDrag from './useDrag';

const CheckboxInput: React.FC<{
  options?: string[];
  onChange: (options: string[]) => void;
}> = ({ options = [], onChange }) => {
  const [add, setAdd] = useState<boolean>(false);
  const [edit, setEdit] = useState<number>(-1);

  const [optionsList, handleStartDrag, handleDrag, handleStopDrag, setOptionList] = useDrag(
    options || [],
  );

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
          {optionsList.map((option, idx, tab) => (
            <Draggable
              axis="y"
              bounds={{ top: -5 - 38 * idx, bottom: 5 + (tab.length - idx - 1) * 38 }}
              key={`${idx}-${option}-${Date.now()}`}
              onStart={handleStartDrag}
              onStop={handleStopDrag}
              onDrag={(event) => {
                setEdit(-1);
                handleDrag(event);
              }}
              handle={'.checkbox-holder'}
            >
              <div key={idx} className="container" drag-index={idx} style={{ padding: '4px 0' }}>
                <HolderOutlined className="checkbox-holder" />
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
            </Draggable>
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
