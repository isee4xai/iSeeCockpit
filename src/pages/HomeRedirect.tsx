import { currentUser } from '@/services/isee/user';
import React, { useEffect } from 'react';
import { history } from 'umi';

const Invite: React.FC = (props) => {

    useEffect(() => {
        (async () => {
            const current_user = await currentUser();
            if (current_user.data.access == "design_user") {
                history.push('/usecases')
            }
            else if (current_user.data.access == "end_user") {
                history.push('/enduser/usecases')
            } else {
                history.push('/user/login')
            }
        })();
    }, []);

    return (
        <>

        </>
    );
};

export default Invite;
