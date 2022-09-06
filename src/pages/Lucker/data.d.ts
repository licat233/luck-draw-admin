export type luckerFormData = {
	id: number // 表主键
	uuid: string // 唯一识别码
	user_id: number // 中奖用户id
	prizes_pool_id: number // 抽中的奖品池id
	status: number // 状态: -1放弃领奖，0未领奖，1已领奖
	luck_date: number // 抽奖时间
	// ip: string // ip地址

    project_id: number
    activity_id: number
    prize_id: number
    prize_grade: number
};
  
export type ReqStorage = {
    activity: Record<number, DefaultOptionType[]>,
    prize: Record<number, DefaultOptionType[]>,
}