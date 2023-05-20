import type { Usecase } from '@/models/usecase';
import {
    api_get,
} from '@/services/isee/usecases';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import {
    Button,
    Card,
    message,
    PageHeader,
    Result,
    Tag,
} from 'antd';
import React, { useEffect, useState } from 'react';
import Text from 'antd/lib/typography/Text';
import { SmileOutlined } from '@ant-design/icons';

export type Params = {
    match: {
        params: {
            id: string;
        };
    };
};

const Invite: React.FC<Params> = (props) => {
    const [pageStatus, setPageStatus] = useState('');
    message.config({
        top: 400,
    });
    const usecaseId = props.match.params.id;

    const [usecase, setUsecase] = useState<Usecase>({ _id: '0', name: '', published: false });

    useEffect(() => {
        (async () => {
            const res_usecase = await api_get(usecaseId);
            console.log('RUNNING FIRST QUERY');
            console.log(res_usecase);

            setUsecase(res_usecase);
            if (!res_usecase) {
                setPageStatus('404');
            } else {
                setPageStatus('200');
            }
        })();
    }, [props.match.params.id]);


    return (
        <>
            {pageStatus == '404' && (
                <Result
                    status="404"
                    title="404"
                    subTitle="Sorry, we couldn't find the Usecase"
                    extra={
                        <Button type="primary" onClick={() => (window.location.pathname = '/')}>
                            Back Home
                        </Button>
                    }
                />
            )}
            {pageStatus == '404' && (
                <PageHeaderWrapper>

                    <Card>
                        <Result
                            icon={<SmileOutlined />}
                            title="You are invited to  !"
                            extra={<Button type="primary">Next</Button>}
                        />

                    </Card>
                </PageHeaderWrapper>
            )}
        </>
    );
};

export default Invite;
