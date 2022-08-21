// export type TableListItem = {
//   key: number;
//   disabled?: boolean;
//   href: string;
//   avatar: string;
//   name: string;
//   owner: string;
//   desc: string;
//   callNo: number;
//   status: string;
//   updatedAt: Date;
//   createdAt: Date;
//   progress: number;
// };

export type UserListParams = {
  keyword?: string;
  // total: number;
  // pageSize: number;
  // current: number;
};

// export type TableListData = {
//   list: TableListItem[];
//   pagination: Partial<TableListPagination>;
// };

// export type TableListParams = {
//   status?: string;
//   name?: string;
//   desc?: string;
//   key?: number;
//   pageSize?: number;
//   currentPage?: number;
//   filter?: Record<string, any[]>;
//   sorter?: Record<string, any>;
// };

export type NullTime = {
  Time: Date;
  Valid: boolean;
}

export type User = {
  Uid: number;
  UserRealName: string;
  UserAvatar: string;
  UserGender: number;
  Passport: string;
  Password: string;
  UserEmail: string;
  UserMobile: string;
  UserRoleId: number;
  UserRoleName: string;
  UserCompanyId: number;
  UserCompanyName: string;
  UserQq: string;
  UserWechat: string;
  UserStatus: number;
  UserCreateTime: string;
  UserUpdateTime: string;
  UserDescription: string;
  UserLoginCount: number;
  LastLoginTime: NullTime;
}

export type BaseUser = {
  Uid: number;
  UserRealName: string;
  UserAvatar: string;
  UserGender: number;
  Passport: string;
  Password: string;
  UserEmail: string;
  UserMobile: string;
  UserRoleId: number;
  UserCompanyId: number;
  UserQq: string;
  UserWechat: string;
  UserStatus: number;
  UserDescription: string;
}