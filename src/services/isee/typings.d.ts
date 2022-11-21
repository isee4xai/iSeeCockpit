// @ts-ignore
/* eslint-disable */

declare namespace API {
  type CurrentUser = {
    name?: string;
    token?: string;
    email?: string;
    company: Company;
    access?: string;
  };
  type Company = {
    name?: string;
  };


  type OntoPair = {
    key?: string,
    label?: string
  }

  type OntoOption = {
    key?: string;
    label?: string;
    parent?: string;
    children?: OntoOption[];
  }

  type OntoParams = {
    AI_METHOD: OntoOption[],
    AI_TASK: OntoOption[],
    DATA_TYPE: OntoPair[],
    DATASET_TYPE: OntoPair[],
    AI_MODEL_A_METRIC: OntoPair[],
    KNOWLEDGE_LEVEL: OntoPair[],
  }

  type LoginResult = {
    status?: string;
    type?: string;
    currentAuthority?: string;
    status_message?: string;
  };

  type PageParams = {
    current?: number;
    pageSize?: number;
  };

  type RuleListItem = {
    key?: number;
    disabled?: boolean;
    href?: string;
    avatar?: string;
    name?: string;
    owner?: string;
    desc?: string;
    callNo?: number;
    status?: number;
    updatedAt?: string;
    createdAt?: string;
    progress?: number;
  };

  type RuleList = {
    data?: RuleListItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type FakeCaptcha = {
    code?: number;
    status?: string;
  };

  type LoginParams = {
    email?: string;
    password?: string;
    autoLogin?: boolean;
    type?: string;
  };

  type ErrorResponse = {
    /** 业务约定的错误码 */
    errorCode: string;
    /** 业务上的错误信息 */
    errorMessage?: string;
    /** 业务上的请求是否成功 */
    success?: boolean;
  };

  type NoticeIconList = {
    data?: NoticeIconItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type NoticeIconItemType = 'notification' | 'message' | 'event';

  type NoticeIconItem = {
    id?: string;
    extra?: string;
    key?: string;
    read?: boolean;
    avatar?: string;
    title?: string;
    status?: string;
    datetime?: string;
    description?: string;
    type?: NoticeIconItemType;
  };
}
