/**
 * @name umi 的路由配置
 * @description 只支持 path,component,routes,redirect,wrappers,title 的配置
 * @param path  path 只支持两种占位符配置，第一种是动态参数 :id 的形式，第二种是 * 通配符，通配符只能出现路由字符串的最后。
 * @param component 配置 location 和 path 匹配后用于渲染的 React 组件路径。可以是绝对路径，也可以是相对路径，如果是相对路径，会从 src/pages 开始找起。
 * @param routes 配置子路由，通常在需要为多个路径增加 layout 组件时使用。
 * @param redirect 配置路由跳转
 * @param wrappers 配置路由组件的包装组件，通过包装组件可以为当前的路由组件组合进更多的功能。 比如，可以用于路由级别的权限校验
 * @doc https://umijs.org/docs/guides/routes
 */
export default [
  // {
  //   path: '/login', layout: false, routes: [
  //     { name: "登录", path: '/user/login', component: './User/Login' },
  //     { component: "./404" }
  //   ]
  // },
  { name: "欢迎", path: '/welcome', icon: 'smile', component: './Welcome' },
  {
    path: '/admin',
    name: 'admin',
    icon: 'crown',
    access: 'canAdmin',
    component: './Admin',
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
