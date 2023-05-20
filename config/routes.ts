﻿export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user',
        routes: [{ name: 'Login', path: '/user/login', component: './user/Login' }],
      },
      { component: './404' },
    ],
  },
  { path: '/welcome', name: 'Welcome', icon: 'smile', component: './Welcome', hideInMenu: true },
  {
    path: '/usecases',
    access: 'designUser',
    name: 'Usecases',
    icon: 'home',
    component: './designuser/Usecases',
  },
  {
    path: '/usecase/manage/:id',
    hideInMenu: true,
    access: 'designUser',
    name: 'Manage Usecase',
    // icon: 'setting',
    component: './designuser/usecases/Create',
    exact: false,
  },
  {
    path: '/usecase/users/:id',
    hideInMenu: true,
    access: 'designUser',
    name: 'Manage Endusers ',
    // icon: 'setting',
    component: './designuser/usecases/Endusers',
    exact: false,
  },
  {
    path: '/invite/:id',
    hideInMenu: true,
    // access: 'designUser',
    name: 'Invitation ',
    // icon: 'setting',
    component: './endusers/invite',
    exact: false,
  },
  {
    path: '/usecase/analytics',
    name: 'Usecase Analytics',
    access: 'designUser',
    icon: 'LineChartOutlined',
    component: './CreateAnalytics',
  },
  {
    path: '/usecase/analytics/:id',
    hideInMenu: true,
    access: 'designUser',
    name: 'Usecase Analytics',
    component: './Analytics',
    exact: false,
  },
  {
    path: '/questionnaires',
    name: 'Questionnaires',
    access: 'designUser',
    icon: 'question',
    component: './CreateQuestionnaires',
  },
  // {
  //   path: '/questionnaires-toolkit',
  //   name: 'Questionnaires toolkit',
  //   icon: 'EditOutlined',
  //   access: 'designUser',
  //   component: './QuestionnairesNew',
  // },
  {
    path: '/dialogue/:id',
    hideInMenu: true,
    access: 'designUser',
    name: 'Dialogue',
    component: './chatbot/DialogQuestionnaires',
    exact: false,
  },
  {
    path: '/explainers',
    name: 'Explainer Library',
    icon: 'BulbOutlined',
    // access: 'designUser',
    component: './explainers/Explainers',
  },
  {
    path: 'https://editor-dev.isee4xai.com/',
    name: 'Strategy Editor',
    icon: 'EditOutlined',
    access: 'designUser',
    component: './404',
  },
  // {
  //   path: '/design',
  //   icon: 'crown',
  //   access: 'canAdmin',
  //   component: './Chatbot',
  //   routes: [
  //     { path: '/design/create', icon: 'smile', component: './Chatbot' },
  //     { component: './404' },
  //   ],
  // },
  { path: '/', redirect: '/usecases' },
  { component: './404' },
];
