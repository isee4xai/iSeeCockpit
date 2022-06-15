import { Button, Card, Col, Descriptions, Modal, notification, Row } from 'antd';

import DataVisualizer from '@/components/iSee/analytics/DataVisualizer';

import { api_intent_stat } from '@/services/isee/usecases';
import { CopyOutlined } from '@ant-design/icons';
import Meta from 'antd/lib/card/Meta';
import { useEffect, useState } from 'react';

const IntentAnalytics: React.FC<{
  persona: string;
  usecase: string;
  intent: string;
}> = ({ persona, usecase, intent }) => {
  const [data, setData] = useState<
    { question: string; dimension: string; values: Record<string, string | number>[] }[]
  >([]);

  useEffect(() => {
    (async () => {
      const stats = await api_intent_stat(usecase, persona, intent);
      setData(stats);
    })();
  }, [intent, persona, usecase]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentDiagram, setcurrentDiagram] = useState([]);
  let csv = '';

  const showModal = (jsonData: any) => {
    setcurrentDiagram(jsonData);
    setIsModalVisible(true);
  };

  const generateModal = () => {
    const handleOk = () => {
      setIsModalVisible(false);
    };
    const handleCloseModal = () => {
      setIsModalVisible(false);
    };
    if (currentDiagram != undefined) {
      for (let index = 0; index < currentDiagram.length + 1; index++) {
        if (index == 0) {
          csv += Object.keys(currentDiagram[0]).map((element) => {
            return element;
          });
        } else {
          csv +=
            '\r\n' +
            currentDiagram[index - 1][`${Object.keys(currentDiagram[0])[0]}`] +
            ', ' +
            currentDiagram[index - 1][`${Object.keys(currentDiagram[0])[1]}`];
        }
      }
    }
    const addToClipboard = () => {
      navigator.clipboard.writeText(csv).then(
        () => {
          notification.success({
            message: `Success`,
            duration: 3,
            description: 'The questionnaire json has been added to the clipboard',
            placement: 'bottomRight',
          });
        },
        () => {
          notification.error({
            message: `Error`,
            duration: 3,
            description: 'An error occured, the json was not added to the clipboard',
            placement: 'bottomRight',
          });
        },
      );
    };

    return (
      <Modal
        title={'Export'}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCloseModal}
        footer={
          <>
            {
              <Button onClick={addToClipboard} icon={<CopyOutlined />}>
                Copy to clipboard
              </Button>
            }

            <Button type="primary" onClick={handleOk}>
              Close
            </Button>
          </>
        }
      >
        <pre>{<code onClick={(e) => console.dir(e.target)}>{csv}</code>}</pre>
      </Modal>
    );
  };

  return (
    <Card>
      <Row gutter={20}>
        {data.map((item, index) => (
          <Col
            key={item.question}
            span={8}
            xs={{ order: 1 }}
            sm={{ order: 2 }}
            md={{ order: 3 }}
            lg={{ order: 4 }}
          >
            <Card
              title={'Question ' + (index + 1)}
              extra={<Button onClick={() => showModal(item.values)}>Export CSV</Button>}
            >
              <Descriptions.Item label={item.question}>{item.question}</Descriptions.Item>
              <Meta description={'(' + item.dimension + ')'} />
              <DataVisualizer
                defaultType="Pie"
                data={item.values}
                autorizedType={['Pie', 'Column']}
              />
            </Card>

            <br />
          </Col>
        ))}
      </Row>
      {generateModal}
      {/* <Form
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
            // initialValues={questions}
            // onFinish={onFinish}
            // onChange={onChange}
            >

                <Row gutter={10}>
                    <Col span={24} style={{ textAlign: 'center' }}>
                        <Button
                            type="primary"
                            htmlType="submit">
                            Save
                        </Button>
                    </Col>
                </Row>
            </Form> */}
    </Card>
  );
};

export default IntentAnalytics;
