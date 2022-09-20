import { Activity } from '@/services/global-api/admin-custom';
import { PrizesPool } from "@/services/global-api/adminComponents";

export type PrizeDetailInfo = {
    index: number;
    id: number;  //奖品id
    uuid: string;
    key: number | string;
    name: string; //奖品名
    image: string; //图片
    price: number; //价格
    grade: string; //级别
    chance: string; //概率
    luck_value: number; //幸运值
    total: number; //总数量
    status: number; //状态
    remainder: number; //剩余数量
    prizesPool: PrizesPool;
    activity: Activity; //活动id
}
