import { User, Activity, UsersPool } from "@/services/global-api/adminComponents"
export type ActivityDetailInfo = {
    key: number | string;
    //显示
    name: string;  //活动名称
    status: number;  //状态
    score: number;  //在某活动中的积分
    //额外
    user: User;  //参与用户信息
    usersPool: UsersPool; //用户池信息
    activity: Activity; //活动信息，里面包含项目id
}
