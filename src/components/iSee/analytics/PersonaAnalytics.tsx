import { Card, Form, Button, Row, Col, Descriptions } from 'antd';
import { Pie, Column } from '@ant-design/plots';

import Meta from 'antd/lib/card/Meta';

const pie_config = {
    appendPadding: 10,
    angleField: 'value',
    colorField: 'key',
    radius: 0.9,
    label: {
        type: 'inner',
        offset: '-30%',
        content: ({ percent }: { percent: any }) => `${(percent * 100).toFixed(0)}%`
    },
    style: {
        fontSize: 14,
        textAlign: 'center',
    },
    interactions: [
        {
            type: 'element-active',
        },
    ],
    legend: {
        layout: "horizontal",
        position: "bottom"
    }
};

const evaluation = {
    id: "987",
    comment: "",
    assessment: "",
    feedback:
        [{
            question: 'Are you more confident on the AI models decisions?',
            category: 'Trust',
            values:
                [{
                    key: "Yes",
                    value: 12
                }, {
                    key: "No",
                    value: 4
                },]
        },
        {
            question: 'How satisfied are you with the outcome?',
            category: 'Satisfaction',
            values:
                [{
                    key: "Satisfied",
                    value: 12
                },
                {
                    key: "Neutral",
                    value: 5
                },
                {
                    key: "Not Satisfied",
                    value: 1
                },]
        },
        {
            question: 'The explanation of the AI model was sufficiently detailed.',
            category: 'Curiosity',
            values:
                [{
                    key: "I agree",
                    value: 2
                },
                {
                    key: "I’m neutral about it",
                    value: 2
                },
                {
                    key: "I disagree",
                    value: 10
                },]
        },
        {
            question: 'The explanation helps me understand how the AI model works.',
            category: 'Curiosity',
            values:
                [{
                    key: "Yes",
                    value: 14
                }, {
                    key: "No",
                    value: 4
                },]
        },
        ]
};

const column_config = {
    xField: 'key',
    yField: 'value',
    label: {
        position: 'middle',
        style: {
            fill: '#FFFFFF',
            opacity: 1,
        },
    },
    xAxis: {
        label: {
            autoHide: true,
            autoRotate: false,
        },
    }
};

const PersonaAnalytics: React.FC = () => {
    return (
        <Card>
            <Row gutter={20}>
                {evaluation.feedback.map((item, index) => (
                    <Col
                        key={index}
                        span={8}
                        xs={{ order: 1 }}
                        sm={{ order: 2 }}
                        md={{ order: 3 }}
                        lg={{ order: 4 }}
                    >
                        <Card
                            title={"Question " + (index + 1)}
                        >
                            <Descriptions.Item label={item.question}>{item.question}</Descriptions.Item>
                            <Meta description={"(" + item.category + ")"} />
                            {item.values.length > 2 ?
                                (<Column
                                    {...column_config}
                                    height={200}
                                    data={item.values} />) :
                                (<Pie
                                    {...pie_config}
                                    height={200}
                                    data={item.values} />)
                            }
                        </Card>

                        <br />
                    </Col>
                ))}
            </Row>
            <Form
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
            </Form>
        </Card >
    );
};

export default PersonaAnalytics;    