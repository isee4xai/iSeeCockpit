import './LikertInput.less';
import { useEffect, useState } from 'react';
import { Radio, Space, Input } from 'antd';
import { PlusCircleOutlined, HolderOutlined } from '@ant-design/icons';
import Draggable from 'react-draggable';
import useDrag from './useDrag';

const RadioInput: React.FC<{
  options?: string[];
  onChange?: (options: string[]) => void;
}> = ({ options = [], onChange = () => null }) => {
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

    if (value.trim() === '') oldState.splice(idx, 1);
    else oldState[idx] = value;

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
          {optionsList.map((option, idx, tab) => (
            <Draggable
              axis="y"
              position={{ x: 0, y: 0 }}
              bounds={{ top: -5 - 48 * idx, bottom: 5 + (tab.length - idx - 1) * 48 }}
              key={`${idx}-${option}`}
              onStart={handleStartDrag}
              onStop={handleStopDrag}
              onDrag={(event) => {
                setEdit(-1);
                handleDrag(event);
              }}
              handle={'.likert-holder'}
            >
              <div className="container" drag-index={idx} style={{ padding: '4px 0' }}>
                <HolderOutlined className="likert-holder" />
                <Radio.Button
                  className="likert-item"
                  value={option}
                  onClick={() => handleEdit(idx)}
                >
                  {edit === idx ? (
                    <Input
                      defaultValue={option}
                      onBlur={(event) => handleEditComplete(idx, event.target.value)}
                      bordered={false}
                      allowClear
                      onPressEnter={(event) =>
                        handleEditComplete(idx, (event.target as HTMLInputElement).value)
                      }
                      autoFocus
                    />
                  ) : (
                    option
                  )}
                </Radio.Button>
              </div>
            </Draggable>
          ))}
        </Space>
      </Radio.Group>
      <div className="LikertForm-Add" onClick={handleAdd}>
        <PlusCircleOutlined style={{ color: '#BFBFBF', fontSize: 16 }} />
        {add ? (
          <Input
            allowClear
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
