import { Card, Form, Button, Row, Col, Descriptions } from 'antd';
import { Pie } from '@ant-design/plots';

import Meta from 'antd/lib/card/Meta';

const usage_by_persona = {
    outerHeight: 200,
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

const feedbacks =
    [{
        question: 'Are you able to trust AI model decisions?',
        category: 'Trust',
        values:
            [{
                key: "Yes",
                value: 4
            }, {
                key: "No",
                value: 4
            },]
    },
    {
        question: 'From the explanation, I understand how the AI model works.',
        category: 'Mental Model',
        values:
            [{
                key: "I agree strongly",
                value: 4
            },
            {
                key: "I agree somewhat",
                value: 5
            },
            {
                key: "I’m neutral about it",
                value: 2
            },
            {
                key: "I disagree somewhat",
                value: 1
            },
            {
                key: "I disagree strongly",
                value: 1
            },]
    },
    {
        question: 'The explanation of the AI model sufficiently detailed.',
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
    ];

const PersonaAnalytics: React.FC = () => {
    return (
        <Card>
            <Row gutter={20}>
                {feedbacks.map((feedback, index) => (
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
                            <Descriptions.Item label={feedback.question}>{feedback.question}</Descriptions.Item>
                            <Meta description={"(" + feedback.category + ")"} />
                            <Pie height={200} {...usage_by_persona}
                                data={feedback.values} />
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