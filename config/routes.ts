export default [
  {
    path: '/user', layout: false, routes: [
      { name: "登录", path: '/user/login', component: './User/Login' },
      { component: "./404" }
    ]
  },
  { name: "欢迎", path: '/welcome', icon: 'smile', component: './Welcome' },
  {
    name: "admin",
    path: '/admin',
    icon: 'crown',
    access: 'canAdmin',
    routes: [{ path: '/admin/sub-page', icon: 'smile', component: './Welcome' }],
  },
  // { name: "标准列表", icon: 'table', path: '/basic-form', component: './basic-form' },
  { name: "查询表格", icon: 'table', path: '/list', component: './TableList' },
  { name: "管理员", icon: 'table', path: '/adminer', component: './Adminer' },
  { name: "项目", icon: 'table', path: '/project', component: './Project' },
  { name: "活动", icon: 'table', path: '/activity', component: './Activity' },
  { name: "产品", icon: 'table', path: '/prize', component: './Prize' },
  { name: "抽奖人", icon: 'table', path: '/lucker', component: './Lucker' },
  { path: '/', redirect: '/welcome' },
  { path: '*', component: './404' },
];
