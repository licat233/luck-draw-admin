declare namespace API {
  type CurrentUser = {
    name?: string;
    avatar?: string;
    userid?: string;
    email?: string;
    signature?: string;
    title?: string;
    group?: string;
    tags?: { key?: string; label?: string }[];
    notifyCount?: number;
    unreadCount?: number;
    country?: string;
    access?: string;
    geographic?: {
      province?: { label?: string; key?: string };
      city?: { label?: string; key?: string };
    };
    address?: string;
    phone?: string;

    id: number; // 表主键
    uuid: string; // 唯一识别码
    name: string; // 管理员名称
    avatar: string; // 头像
    passport: string; // 账号
    password: string; // 密码
    email: string; // 邮箱
    status: number; // 账号状态，是否可用
    is_super_admin: number; // 是否为超级管理员
    login_count: number; // 登录次数
    last_login: number; // 最后一次登录时间
    create_at: number; // 创建时间
    update_at: number; // 更新时间
    is_deleted: number; // 是否已被删除
    delete_at: number; // 删除时间
  };

  type BaseResp = {
    //响应成功的基本格式
    success: boolean; // 【响应状态】
    message?: string; // 【给予的提示信息】
    data?: any; // 【选填】响应的业务数据
    //涉及列表请求
    total?: number; // 【选填】数据总个数
    pageSize?: number; // 【选填】单页数量
    current?: number; // 【选填】当前页码，current与antd前端对接
    totalPage?: number; // 【自己加上去的】总共有多少页，根据前端的pageSize来计算
    //如果是失败响应，附带debug信息
    errorCode?: number; // 【选填】错误类型代码：400错误请求，401未授权，500服务器内部错误，200成功
    errorMessage?: string; // 【选填】向用户显示消息
    traceMessage?: string; // 【选填】调试错误信息，请勿在生产环境下使用，可有可无
    showType?: number; // 【选填】错误显示类型：0.不提示错误;1.警告信息提示；2.错误信息提示；4.通知提示；9.页面跳转
    traceId?: string; // 【选填】方便后端故障排除：唯一的请求ID
    host?: string; // 【选填】方便后端故障排除：当前访问服务器的主机
  }
  type JwtToken = {
    access_token: string
    access_expire: number
    refresh_after: number
  }

  type ListReq = {
    pageSize?: number; // 页面大小
    current?: number; // 当前页码
    keyword?: string; // 关键词，可选
  }
}
