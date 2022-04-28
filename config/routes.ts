export default [
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
  { path: '/usecases', name: 'Usecases', icon: 'home', component: './designuser/Usecases' },
  {
    path: '/usecase/manage/:id',
    hideInMenu: true,
    name: 'Manage Usecase',
    // icon: 'setting',
    component: './designuser/usecases/Create',
    exact: false
  },
  {
    path: '/usecase/analytics',
    name: 'Usecase Analytics',
    icon: 'LineChartOutlined',
    component: './CreateAnalytics',
  },
  {
    path: '/questionnaires',
    name: 'Questionnaires',
    icon: 'question',
    component: './CreateQuestionnaires',
  },
  {
    path: '/questionnaires-toolkit',
    name: 'Questionnaires toolkit',
    icon: 'question',
    component: './QuestionnairesNew',
  },
  // {
  //   path: '/design',
  //   icon: 'crown',
  //   // access: 'canAdmin',
  //   component: './Admin',
  //   routes: [
  //     { path: '/design/create', icon: 'smile', component: './Admin' },
  //     { component: './404' },
  //   ],
  // },
  { path: '/', redirect: '/usecases' },
  { component: './404' },
];
