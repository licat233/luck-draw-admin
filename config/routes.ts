export default [
  // {
  //   path: '/login', layout: false, routes: [
  //     { name: "登录", path: '/user/login', component: './User/Login' },
  //     { component: "./404" }
  //   ]
  // },
  { name: "欢迎", path: '/welcome', icon: 'smile', component: './Welcome' },
  {
    name: "admin",
    path: '/admin',
    icon: 'crown',
    access: 'canAdmin',
    routes: [{ path: '/admin/sub-page', icon: 'smile', component: './Welcome' }],
  },
  // { name: "标准列表", icon: 'table', path: '/basic-form', component: './basic-form' },
  // { name: "查询表格", icon: 'table', path: '/list', component: './TableList' },
  { name: "登录", path: '/login', component: './Login',layout: false, },
  //layout
  { name: "管理员", icon: 'idcard', path: '/adminer', component: './Adminer' },
  { name: "用户", icon: 'user', path: '/user', component: './User' },
  { name: "项目", icon: 'project', path: '/project', component: './Project' },
  { name: "活动", icon: 'flag', path: '/activity', component: './Activity' },
  { name: "奖品", icon: 'gift', path: '/prize', component: './Prize' },
  // { name: "奖品池", icon: 'shop', path: '/prizes_pool', component: './PrizesPool' },
  { name: "抽奖记录", icon: 'container', path: '/lucker', component: './Lucker' },
  { path: '/', redirect: '/welcome' },
  { path: '*', component: './404' },
];
