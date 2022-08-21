import * as components from "./luckdrawComponents"
export * from "./luckdrawComponents"

/**
 * @description "展现抽奖页面"
 */
export function luckView() {
	return webapi.get<null>("/v1/api/luckdraw/:shortlink")
}

/**
 * @description "抽奖者身份验证"
 * @param req
 */
export function identify(req: components.IdentifyReq) {
	return webapi.post<components.BaseResp>("/v1/api/luckdraw/identify", req)
}

/**
 * @description "获取活动奖品列表"
 * @param req
 */
export function prizes(req: components.PrizesReq) {
	return webapi.post<components.BaseResp>("/v1/api/luckdraw/prizes", req)
}

/**
 * @description "获取自己在某活动的中奖名单"
 * @param req
 */
export function luckerList(req: components.LuckerListReq) {
	return webapi.post<components.BaseResp>("/v1/api/luckdraw/luckerList", req)
}

/**
 * @description "抽取奖品"
 * @param req
 */
export function goodluck(req: components.GoodluckReq) {
	return webapi.post<components.BaseResp>("/v1/api/luckdraw/goodluck", req)
}

/**
 * @description "查询中奖信息"
 * @param req
 */
export function search(req: components.SearchReq) {
	return webapi.post<components.BaseResp>("/v1/api/luckdraw/search", req)
}

/**
 * @description "挑选奖品"
 * @param req
 */
export function selectPrizes(req: components.SelectPrizesReq) {
	return webapi.post<components.BaseResp>("/v1/api/luckdraw/selectPrizes", req)
}
